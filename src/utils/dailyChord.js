// Hash inteiro determinístico (xorshift-style) para descorrelacionar data ↔ acorde.
function hashInt(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  return (n ^ (n >>> 15)) >>> 0;
}

// Acorde do dia: mesmo resultado para a mesma data (data local).
export function chordOfDay(date = new Date()) {
  const key =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate();
  const h = hashInt(key);
  return {
    rootPc: h % 12,
    quality: Math.floor(h / 12) % 2 ? "menor" : "maior",
  };
}
