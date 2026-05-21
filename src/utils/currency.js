const fallbackRates = {
  USD: 1.0,
  PEN: 3.75,
  EUR: 0.92,
};

let cachedRates = null;
let lastFetched = 0;
const CACHE_DURATION = 3600000; // 1 hour

const fetchExchangeRates = async () => {
  const now = Date.now();
  if (cachedRates && now - lastFetched < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // We fetch from a free, open exchange rate API
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) throw new Error("API response error");

    const data = await response.json();
    if (data && data.result === "success" && data.rates) {
      cachedRates = data.rates;
      lastFetched = now;
      return cachedRates;
    }
  } catch (error) {
    console.warn("Failed to fetch dynamic exchange rates, using fallback rates:", error.message);
  }

  // Fallback to offline pre-configured rates
  cachedRates = fallbackRates;
  return cachedRates;
};

/**
 * Convert an amount from one currency to another.
 * @param {number|string} amount
 * @param {string} from
 * @param {string} to
 * @returns {Promise<number>}
 */
export const convertAmount = async (amount, from, to) => {
  const rates = await fetchExchangeRates();
  const numAmount = Number(amount) || 0;

  const fromRate = rates[from.toUpperCase()] || fallbackRates[from.toUpperCase()] || 1;
  const toRate = rates[to.toUpperCase()] || fallbackRates[to.toUpperCase()] || 1;

  // Convert to USD first (base currency), then to target currency
  const amountInUSD = numAmount / fromRate;
  const converted = amountInUSD * toRate;

  return Math.round(converted * 100) / 100;
};
