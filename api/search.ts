import { encode } from 'base-64';

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
  
  // Internal trenit identifiers: id * client * type * lang
  // We use *do*f*it meaning (desktop, ?, italian)
  const userPartial = `${uuid}*do*f*it`;
  
  // Extra options, e.g. traveler types (*A1 = 1 Adult)
  const extraPartial = `*A1`;

  // Payload format: from | to | Y | m | d | H | i | userPartial | extraPartial
  const payload = [from, to, Y, m, d, H, i, userPartial, extraPartial].join('|');
  
  // Encode string to UTF-8 bytes to properly handle accents like in "Forlì"
  const utf8Payload = unescape(encodeURIComponent(payload));
  
  // 1. Base64 encode the payload
  let encoded = encode(utf8Payload);
  
  // 2. Remove base64 padding '='
  encoded = encoded.replace(/=/g, '');
  
  // 3. Reverse the string completely
  encoded = encoded.split('').reverse().join('');
  
  // 4. Append 'W' to the end
  encoded += 'W';

  const url = `https://trenit.app/v1/grx?r=${encoded}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data: TrenitResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trenit API:", error);
    throw error;
  }
}
