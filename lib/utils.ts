// ----------------------------------------------------------------
// Currency & number formatting
// ----------------------------------------------------------------

/** Format a number as Philippine Peso (e.g. ₱1,250,000.00) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'symbol',
  })
    .format(amount)
    .replace('PHP', '₱')
    .trim();
}

/** Format a number with comma separators (e.g. 1,250,000) */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PH').format(num);
}

// ----------------------------------------------------------------
// Finance calculation
// ----------------------------------------------------------------

/**
 * Standard amortization formula.
 * Returns the monthly payment amount (Philippine Peso).
 *
 * @param price          - Vehicle cash price
 * @param downPayment    - Down payment amount
 * @param annualRate     - Annual interest rate as a percentage (e.g. 12 for 12%)
 * @param termMonths     - Loan term in months
 * @param tradeInValue   - Optional trade-in credit applied to down payment
 */
export function calculateMonthlyPayment(
  price: number,
  downPayment: number,
  annualRate: number,
  termMonths: number,
  tradeInValue = 0,
): number {
  const principal = price - downPayment - tradeInValue;
  if (principal <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.round(payment * 100) / 100;
}

// ----------------------------------------------------------------
// Condition / status color helpers  (Tailwind CSS class tokens)
// ----------------------------------------------------------------

/** Returns a Tailwind color name for a condition_rating value */
export function getConditionColor(rating: string): string {
  const map: Record<string, string> = {
    excellent: 'green',
    very_good: 'teal',
    good: 'blue',
    fair: 'yellow',
    poor: 'red',
  };
  return map[rating] ?? 'gray';
}

/** Returns a Tailwind color name for a car status value */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    available: 'green',
    reserved: 'yellow',
    sold: 'red',
  };
  return map[status] ?? 'gray';
}

// ----------------------------------------------------------------
// Text helpers
// ----------------------------------------------------------------

/** Convert text to a URL-safe slug (e.g. "Toyota Vios 2023" → "toyota-vios-2023") */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Truncate a string to `length` characters, appending "…" if trimmed */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

// ----------------------------------------------------------------
// Communication helpers
// ----------------------------------------------------------------

/** Build a wa.me deep-link URL */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

// ----------------------------------------------------------------
// Date helpers
// ----------------------------------------------------------------

/** Return a human-readable relative time string (e.g. "2 hours ago") */
export function timeAgo(date: Date | string): string {
  const then = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];

  for (const [divisor, label] of intervals) {
    const count = Math.floor(seconds / divisor);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}
