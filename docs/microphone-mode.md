# Plano técnico — Modo microfone (não implementado)

> Documento de design. **Nenhum código de produção existe ainda.** Descreve como
> adicionaríamos detecção automática de nota por microfone ao caged-trainer:
> "tocar a nota até atingir a frequência da forma desejada".

## Objetivo

Validar a execução do acorde ouvindo o instrumento pelo microfone, em vez de o
usuário marcar as casas manualmente. O usuário toca as cordas e o app confirma,
corda a corda, se a nota tocada bate com a frequência esperada da forma.

## Por que corda-a-corda (arpejo) e não o acorde inteiro

- **Corda-a-corda (recomendado):** detecção **monofônica** de pitch (uma nota por
  vez). O usuário arpeja o acorde; cada corda é validada isoladamente. Robusto,
  barato e encaixa direto no modelo por corda que já existe (`perString`,
  `correct` de `computeCorrect`).
- **Polifônico (acorde inteiro):** detectar todas as notas de um acorde soando
  juntas é difícil — harmônicos se sobrepõem e geram ambiguidade. Robustez prática
  só com modelos de ML (CREPE, transcrição de áudio), com custo, latência e
  incerteza altos. **Fora de escopo por ora.**

## Captura de áudio (Web Audio API)

```js
const stream = await navigator.mediaDevices.getUserMedia({
  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
});
const ctx = new AudioContext();
const src = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
analyser.fftSize = 4096; // janela grande: corda 6 (Mi grave) ≈ 82 Hz
src.connect(analyser);

const buf = new Float32Array(analyser.fftSize);
function frame() {
  analyser.getFloatTimeDomainData(buf);
  // → detecção de pitch sobre `buf`
  requestAnimationFrame(frame);
}
```

Desligar `echoCancellation`/`noiseSuppression`/`autoGainControl` evita distorção
dos harmônicos. `fftSize` grande é necessário para resolução no grave.

## Detecção de pitch (monofônica)

- Algoritmo: **YIN** (mais robusto contra erro de oitava) ou autocorrelação
  normalizada. Saída: `f0` em Hz + confiança (clarity).
- Guardas contra ruído:
  - **Gate de RMS** — ignora silêncio/ruído de fundo.
  - **Threshold de clarity** — descarta detecção incerta.
  - **Mediana de N frames** — estabiliza a leitura (custo: latência percebida).

## Mudança de modelo necessária: tabela de Hz

O modelo hoje só tem **pitch-class** (`OPEN_PITCH` em `src/constants/notes.js`),
sem oitava — insuficiente para casar Hz. Adicionar oitava por corda:

```js
// src/constants/notes.js
export const OPEN_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4 (idx 0..5)

// src/utils/pitch.js (novo)
export const midiAt = (stringIdx, fret) => OPEN_MIDI[stringIdx] + fret;
export const freqOf = (midi) => 440 * 2 ** ((midi - 69) / 12);       // A440
export const cents = (f, target) => 1200 * Math.log2(f / target);
```

## Fluxo de validação

1. Da forma alvo, obter `correct = computeCorrect(quality, rootPc, shape)`.
2. `targetFreqs[i] = freqOf(midiAt(i, correct[i]))` para cada corda com
   `correct[i] !== "x"`.
3. A cada frame com pitch estável, achar a corda-alvo cujo `|cents(f0, target)|`
   é mínimo.
4. Marcar a corda como **acertada** quando `|cents(f0, target)| <= tolerância`
   (sugestão: **±25–35 cents**) de forma estável por alguns frames.
5. Reaproveitar `perString`/feedback existentes; acorde completo quando todas as
   cordas não-abafadas foram acertadas.

## Arquivos que seriam criados/tocados (quando implementado)

- `src/constants/notes.js` — adicionar `OPEN_MIDI`.
- `src/utils/pitch.js` — `midiAt`, `freqOf`, `cents` + algoritmo de detecção.
- `src/hooks/useMic.js` — ciclo de vida (`getUserMedia`/`AudioContext`/rAF) +
  cleanup obrigatório (`ctx.close()`, parar tracks do stream). Cleanup idempotente
  por causa do StrictMode em dev.
- `src/components/mic/MicTuner.jsx` — UI do modo microfone.
- Integração opcional no `Trainer` ou nova aba.

## Bibliotecas candidatas

- **`pitchy`** — YIN/McLeod, pequena, browser-first. **Recomendada para começar.**
- `pitchfinder` — YIN/AMDF/ACF/wavelet, flexível.
- ML (`ml5`/CREPE) — maior precisão, maior custo/latência; só se necessário.
- Implementação própria de autocorrelação (~50 linhas) basta para um MVP, mas o
  YIN pronto reduz erros de oitava.

## Trade-offs e riscos

- **Tolerância (cents):** apertada demais frustra; larga demais aceita nota errada.
- **Latência × estabilidade:** mediana de frames estabiliza mas atrasa a resposta.
- **Grave:** corda 6 é o pior caso de resolução e erro de oitava — priorizar YIN
  e `fftSize` maior.
- **Permissão de microfone** e **cleanup** de `AudioContext`/tracks são
  obrigatórios (vazamento de recurso/aba travada se ignorados).
