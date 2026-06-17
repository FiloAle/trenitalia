import { encode } from 'base-64';
import { Platform } from 'react-native';

export interface TrenitLeg {
  ts: string;  // Train type, e.g., "FrRossa"
  n: string;   // Train number
  dt: string;  // Departure time "HH:mm"
  ds: string;  // Departure station
  at: string;  // Arrival time "HH:mm"
  as: string;  // Arrival station
}

export interface TrenitRoute {
  dx: number;   // Unix Timestamp
  ns: string;   // Train number
  dd: string;   // Departure date "YYYY-MM-DD"
  dt: string;   // Departure time
  ds: string;   // Departure station
  at: string;   // Arrival time
  as: string;   // Arrival station
  dur: string;  // Duration "6h52'"
  l: TrenitLeg[]; // Legs (train changes)
  pr?: string;    // Price string "93,90", might be missing
  tk?: any[];     // Tickets array
}

export interface TrenitResponse {
  data?: {
    routes?: TrenitRoute[];
  };
  err?: string;
  s?: string;
}

export let selectedSolutionCache: any = null;
export function setSelectedSolutionCache(sol: any) {
	selectedSolutionCache = sol;
}

export let searchResultsCache: any = null;
export function setSearchResultsCache(res: any) {
	searchResultsCache = res;
}

/**
 * Generates a pseudo-random UUID for the API request.
 * The Trenit API seems to use UUIDs to track sessions or requests.
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Searches for train journeys using the reverse-engineered Trenit API.
 * 
 * @param from - Departure station name (e.g. "Milano Centrale")
 * @param to - Arrival station name (e.g. "Roma Termini")
 * @param date - The date and time of departure
 * @returns A promise resolving to the API response
 */
export async function searchJourneys(from: string, to: string, date: Date = new Date()): Promise<TrenitResponse> {
  const Y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const H = date.getHours().toString().padStart(2, '0');
  const i = date.getMinutes().toString().padStart(2, '0');

  const uuid = generateUUID();
  const extraPartial = `*A1`;

  try {
    // 1. Attempt Web API
    const userPartialWeb = `${uuid}*do*f*it`;
    const payloadWeb = [from, to, Y, m, d, H, i, userPartialWeb, extraPartial].join('|');
    const utf8PayloadWeb = unescape(encodeURIComponent(payloadWeb));
    
    let encodedWeb = encode(utf8PayloadWeb).replace(/=/g, '').split('').reverse().join('');
    encodedWeb += 'W';

    let urlWeb = `https://trenit.app/v1/grx?r=${encodedWeb}`;
    
    // On web, Trenit's API doesn't return CORS headers, so the browser blocks it.
    // We use corsproxy.io to bypass this during web development.
    if (Platform.OS === 'web') {
      urlWeb = `https://corsproxy.io/?${encodeURIComponent(urlWeb)}`;
    }
    
    const responseWeb = await fetch(urlWeb, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    
    if (!responseWeb.ok) {
      throw new Error(`Web API HTTP Error: ${responseWeb.status}`);
    }

    const data: TrenitResponse = await responseWeb.json();
    if (data.err || !data.data || !data.data.routes) {
      throw new Error(`Web API returned logic error or empty data: ${data.err || 'No routes'}`);
    }
    return data;
  } catch (error) {
    console.warn("Web API failed, attempting mobile fallback...", error);
    
    // 2. Fallback to Mobile API
    // Mobile API seems to require a 28-char alphanumeric ID without hyphens (like Firebase UIDs)
    const mobileUuid = generateUUID().replace(/-/g, '').substring(0, 28).padEnd(28, 'a');
    const userPartialMobile = `${mobileUuid}*i122*f*it`;
    // Mobile uses bne*Ab1 instead of just *A1
    const extraPartialMobile = `bne*Ab1`;
    const payloadMobile = [from, to, Y, m, d, H, i, userPartialMobile, extraPartialMobile].join('|');
    const utf8PayloadMobile = unescape(encodeURIComponent(payloadMobile));
    
    let encodedMobile = encode(utf8PayloadMobile).replace(/=/g, '').split('').reverse().join('');
    encodedMobile += 'I';

    let urlMobileGr = `https://ws.trenit.info/v1/gr?r=${encodedMobile}`;
    let urlMobileGrx = `https://ws.trenit.info/v1/grx?r=${encodedMobile}`;
    
    if (Platform.OS === 'web') {
      urlMobileGr = `https://corsproxy.io/?${encodeURIComponent(urlMobileGr)}`;
      urlMobileGrx = `https://corsproxy.io/?${encodeURIComponent(urlMobileGrx)}`;
    }
    
    // Step 1: Call /v1/gr to initialize the search
    const responseMobileGr = await fetch(urlMobileGr, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'it-IT,it;q=0.9',
        'User-Agent': 'Trenit/122 CFNetwork/3860.600.12 Darwin/25.5.0',
      }
    });
    
    if (!responseMobileGr.ok) {
      throw new Error(`Mobile API (gr) HTTP Error: ${responseMobileGr.status}`);
    }

    // Step 2: Call /v1/grx to get the actual results
    const responseMobileGrx = await fetch(urlMobileGrx, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'it-IT,it;q=0.9',
        'User-Agent': 'Trenit/122 CFNetwork/3860.600.12 Darwin/25.5.0',
      }
    });

    if (!responseMobileGrx.ok) {
      throw new Error(`Mobile API (grx) HTTP Error: ${responseMobileGrx.status}`);
    }

    const dataMobile: TrenitResponse = await responseMobileGrx.json();
    return dataMobile;
  }
}
