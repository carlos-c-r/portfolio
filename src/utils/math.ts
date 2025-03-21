export function map(x: number, inMin: number, inMax: number, outMin: number, outMax: number, clamp = false) : number {
    const out = outMin + (x - inMin) / (inMax - inMin) * (outMax - outMin);
    return clamp ? Math.max(Math.min(out, outMax), outMin) : out;
}
