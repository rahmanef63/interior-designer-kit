/** Shared UI helpers + components (stub — add shared React components here). */

/** Format a number as Indonesian Rupiah, e.g. 150000000 → "Rp 150.000.000". */
export function formatIdr(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
