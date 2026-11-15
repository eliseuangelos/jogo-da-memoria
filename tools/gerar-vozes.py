#!/usr/bin/env python3
"""Gera as 102 falas do Jogo da Memória e o manifesto que o jogo lê.

  python tools/gerar-vozes.py sintetizar   # voz neural (Kokoro, pf_dora) -> tools/brutos/NNN.wav
  python tools/gerar-vozes.py processar    # tools/brutos/NNN.* -> assets/sounds/voz/*.mp3 + manifest.js
  python tools/gerar-vozes.py tudo         # as duas etapas

'processar' aceita áudio de qualquer origem (Polly, Azure, gravação humana), desde que o
arquivo se chame NNN.<extensão>, com o id de tools/falas.json. Requer ffmpeg no PATH.
"""
import argparse, json, re, shutil, subprocess, sys, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FALAS = json.loads((RAIZ / 'tools' / 'falas.json').read_text(encoding='utf-8'))
BRUTOS, SAIDA = RAIZ / 'tools' / 'brutos', RAIZ / 'assets' / 'sounds' / 'voz'
TAXA = 24000  # taxa nativa do Kokoro


def nome(f):
    ascii_ = unicodedata.normalize('NFD', f['texto']).encode('ascii', 'ignore').decode().lower()
    return '%03d-%s.mp3' % (f['id'], re.sub(r'[^a-z0-9]+', '-', ascii_).strip('-'))


def sintetizar(a):
    try:
        import numpy as np
        import soundfile as sf
        from kokoro import KPipeline
    except ImportError:
        sys.exit('Faltam pacotes. Rode: pip install kokoro soundfile')
    BRUTOS.mkdir(parents=True, exist_ok=True)
    pipe = KPipeline(lang_code='p')  # 'p' = português do Brasil

    def dizer(texto, vel):
        partes = [np.asarray(x.detach().cpu().numpy() if hasattr(x, 'detach') else x, dtype='float32')
                  for _, _, x in pipe(texto, voice=a.voz, speed=vel) if x is not None]
        return np.concatenate(partes)

    for f in FALAS:
        audio = dizer(f['texto'], a.velocidade)
        if a.repetir:  # fala devagar, faz uma pausa e repete um pouco mais rápido
            pausa = np.zeros(int(TAXA * 0.7), dtype='float32')
            audio = np.concatenate([audio, pausa, dizer(f['texto'], min(1.0, a.velocidade + 0.2))])
        sf.write(str(BRUTOS / ('%03d.wav' % f['id'])), audio, TAXA)
        print('%03d %s' % (f['id'], f['texto']))


def processar(a):
    if not shutil.which('ffmpeg'):
        sys.exit('ffmpeg não encontrado no PATH.')
    SAIDA.mkdir(parents=True, exist_ok=True)
    corta = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05'
    filtro = ('aformat=channel_layouts=mono,%s,areverse,%s,areverse,'
              'loudnorm=I=-18:TP=-2:LRA=7,adelay=120,apad=pad_dur=0.15') % (corta, corta)
    for f in FALAS:
        brutos = sorted(BRUTOS.glob('%03d.*' % f['id']))
        if not brutos:
            continue
        r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(brutos[0]), '-af', filtro,
                            '-ar', str(TAXA), '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k',
                            str(SAIDA / nome(f))], capture_output=True, text=True)
        if r.returncode:  # avisos de timestamp do ffmpeg com código 0 são inofensivos e não são exibidos
            print('falhou:', brutos[0].name, r.stderr.strip()[-200:])
    prontos = {str(f['id']): nome(f) for f in FALAS if (SAIDA / nome(f)).exists()}
    (SAIDA / 'manifest.js').write_text(
        '/* Gerado por tools/gerar-vozes.py: não edite à mão. */\nwindow.MemoriaVozes='
        + json.dumps({'arquivos': prontos}, ensure_ascii=False) + ';\n', encoding='utf-8')
    sem = [f['id'] for f in FALAS if str(f['id']) not in prontos]
    print('%d de %d falas prontas em %s' % (len(prontos), len(FALAS), SAIDA)
          + ('; sem áudio: %s' % sem if sem else ''))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('etapa', choices=['sintetizar', 'processar', 'tudo'])
    p.add_argument('--voz', default='pf_dora', help='voz do Kokoro (padrão: pf_dora, feminina pt-BR)')
    p.add_argument('--velocidade', type=float, default=0.75, help='1 = normal; menor = mais devagar (padrão: 0,75)')
    p.add_argument('--repetir', action='store_true', help='fala a palavra devagar e repete em seguida')
    a = p.parse_args()
    if a.etapa in ('sintetizar', 'tudo'):
        sintetizar(a)
    if a.etapa in ('processar', 'tudo'):
        processar(a)


if __name__ == '__main__':
    main()
