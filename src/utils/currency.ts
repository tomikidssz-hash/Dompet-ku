/**
 * Format number to Indonesian Rupiah (IDR) currency format.
 * Example: 8500000 -> "Rp 8.500.000"
 */
export function formatRupiah(amount: number, withPrefix = true): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formatted = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (withPrefix) {
    return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
  }
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format large amounts to short readable Rupiah
 * Example: 8500000 -> "Rp 8,5 jt"
 */
export function formatCompactRupiah(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let result = '';
  if (abs >= 1000000000) {
    result = `${(abs / 1000000000).toFixed(1).replace('.', ',')} M`;
  } else if (abs >= 1000000) {
    result = `${(abs / 1000000).toFixed(1).replace('.0', '').replace('.', ',')} jt`;
  } else if (abs >= 1000) {
    result = `${(abs / 1000).toFixed(0)} rb`;
  } else {
    result = abs.toString();
  }

  return isNegative ? `-Rp ${result}` : `Rp ${result}`;
}

/**
 * Clean input string to raw number
 */
export function parseRupiahInput(val: string): number {
  const numericOnly = val.replace(/[^0-9]/g, '');
  return numericOnly ? parseInt(numericOnly, 10) : 0;
}
