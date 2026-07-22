// Deterministic QR-style visual (prototype only — not a scannable code).
export default function QrCode({ value, size = 168 }: { value: string; size?: number }) {
  const N = 21
  // simple deterministic hash → bit for each cell
  const bit = (i: number) => {
    let h = 2166136261
    const s = value + ':' + i
    for (let k = 0; k < s.length; k++) {
      h ^= s.charCodeAt(k)
      h = Math.imul(h, 16777619)
    }
    return ((h >>> 0) & 1) === 1
  }

  const cell = size / N
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0)
  }
  const finderOn = (r: number, c: number) => {
    const box = (br: number, bc: number) => {
      const lr = r - br
      const lc = c - bc
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true
      return false
    }
    if (r < 7 && c < 7) return box(0, 0)
    if (r < 7 && c >= N - 7) return box(0, N - 7)
    if (r >= N - 7 && c < 7) return box(N - 7, 0)
    return false
  }

  const cells = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const on = isFinder(r, c) ? finderOn(r, c) : bit(r * N + c)
      if (on)
        cells.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#191718" />,
        )
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR code">
      <rect width={size} height={size} fill="#fff" />
      {cells}
    </svg>
  )
}
