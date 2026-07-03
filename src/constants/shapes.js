// rel: idx 0 = corda 6 ... 5 = corda 1 (null = abafada)
// off: base = (tônica - off) mod 12
// root: corda (índice) da tônica
export const SHAPES = {
  maior: {
    C: { rel: [null, 3, 2, 0, 1, 0], off: 0, root: 1 },
    A: { rel: [null, 0, 2, 2, 2, 0], off: 9, root: 1 },
    G: { rel: [3, 2, 0, 0, 0, 3], off: 7, root: 0 },
    E: { rel: [0, 2, 2, 1, 0, 0], off: 4, root: 0 },
    D: { rel: [null, null, 0, 2, 3, 2], off: 2, root: 2 },
  },
  menor: {
    E: { rel: [0, 2, 2, 0, 0, 0], off: 4, root: 0 },
    A: { rel: [null, 0, 2, 2, 1, 0], off: 9, root: 1 },
    D: { rel: [null, null, 0, 2, 3, 1], off: 2, root: 2 },
  },
};

export const SHAPE_PT = { C: "Dó", A: "Lá", G: "Sol", E: "Mi", D: "Ré" };
export const ALL_SHAPES = ["C", "A", "G", "E", "D"];
export const NUM_FRETS = 14;
export const INLAYS = new Set([3, 5, 7, 9]);
