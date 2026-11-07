/**
 * Modal FastAPI client (kids-words API).
 * Credentials live in Script Properties only — never sent to the client.
 *
 * Required Script Properties:
 * - MODAL_BASE_URL  e.g. https://….modal.run
 * - MODAL_API_KEY
 */

const KEYS_CACHE_SECONDS = 60 * 60;

export const isModalConfigured = () => {
  const props = PropertiesService.getScriptProperties();
  const baseUrl = String(props.getProperty('MODAL_BASE_URL') || '').trim();
  const apiKey = String(props.getProperty('MODAL_API_KEY') || '').trim();
  return Boolean(baseUrl && apiKey);
};

const getCredentials = () => {
  const props = PropertiesService.getScriptProperties();
  const baseUrl = String(props.getProperty('MODAL_BASE_URL') || '')
    .trim()
    .replace(/\/$/, '');
  const apiKey = String(props.getProperty('MODAL_API_KEY') || '').trim();

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Modal is not configured. Add MODAL_BASE_URL and MODAL_API_KEY in Project Settings → Script properties.',
    );
  }

  return { baseUrl, apiKey };
};

const unwrapPayload = (payload) => {
  if (payload && typeof payload === 'object' && payload.data && typeof payload.data === 'object') {
    return payload.data;
  }
  return payload;
};

/** GET a Modal path with optional query params. Returns parsed JSON. */
export const modalGet = (path, query = {}) => {
  const { baseUrl, apiKey } = getCredentials();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const params = Object.entries(query)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  const url = `${baseUrl}${cleanPath}${params ? `?${params}` : ''}`;

  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      'X-API-Key': apiKey,
      Accept: 'application/json',
    },
    muteHttpExceptions: true,
    followRedirects: true,
  });

  const status = response.getResponseCode();
  const text = response.getContentText() || '';

  if (status < 200 || status >= 300) {
    throw new Error(`Modal request failed (${status}). Try again in a moment.`);
  }

  try {
    return unwrapPayload(JSON.parse(text));
  } catch (ignore) {
    throw new Error('Modal returned an invalid response.');
  }
};

/** Science quiz topic keys from Modal (cached ~1 hour). */
export const getScienceQuizKeys = () => {
  if (!isModalConfigured()) {
    return [];
  }

  const cache = CacheService.getScriptCache();
  const cached = cache.get('modal-science-keys');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (ignore) {
      // refresh below
    }
  }

  try {
    const payload = modalGet('/science/quiz/keys');
    let keys = [];
    if (Array.isArray(payload)) {
      keys = payload;
    } else if (payload && Array.isArray(payload.keys)) {
      keys = payload.keys;
    }
    keys = keys.map((key) => String(key).trim()).filter(Boolean);
    if (keys.length) {
      cache.put('modal-science-keys', JSON.stringify(keys), KEYS_CACHE_SECONDS);
    }
    return keys;
  } catch (ignore) {
    return [];
  }
};
