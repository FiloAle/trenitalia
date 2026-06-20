import { encode } from 'base-64';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getProxyUrl(targetUrl: string) {
  const hostUri = Constants.expoConfig?.hostUri;
  const proxyBase = hostUri ? `http://${hostUri}/api/proxy?url=` : "/api/proxy?url=";
  return `${proxyBase}${encodeURIComponent(targetUrl)}`;
}

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

const locationIdCache = new Map<string, number>();

async function getLocationId(stationName: string): Promise<number> {
  if (locationIdCache.has(stationName)) {
    return locationIdCache.get(stationName)!;
  }

  let url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${encodeURIComponent(stationName)}&limit=1`;
  if (Platform.OS === 'web') {
    url = getProxyUrl(url);
  }

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve location: ${stationName}`);
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error(`Location not found: ${stationName}`);
  }

  const id = data[0].id;
  locationIdCache.set(stationName, id);
  return id;
}

function parseBffTimeToHHmm(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export async function searchJourneys(from: string, to: string, date: Date = new Date()): Promise<TrenitResponse> {
  try {
    const fromId = await getLocationId(from);
    const toId = await getLocationId(to);

    // Format ISO string locally without Z to match BFF expected format: YYYY-MM-DDTHH:mm:00.000
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2, '0');
    const D = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const departureTime = `${Y}-${M}-${D}T${h}:${m}:00.000`;

    const payload = {
      departureLocationId: fromId,
      arrivalLocationId: toId,
      departureTime: departureTime,
      adults: 1,
      children: 0,
      criteria: {
        frecceOnly: false,
        regionalOnly: false,
        intercityOnly: false,
        tourismOnly: false,
        noChanges: false,
        order: "DEPARTURE_DATE",
        offset: 0,
        limit: 10
      },
      advancedSearchRequest: {
        bestFare: false,
        bikeFilter: false,
        forwardDiscountCodes: []
      }
    };

    let url = "https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions";
    if (Platform.OS === 'web') {
      url = getProxyUrl(url);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Channel': '320',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Trenitalia BFF Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.solutions) {
      return { data: { routes: [] } };
    }

    const filteredSolutions = data.solutions.filter((item: any) => {
      const hasBusOrUrbano = (item.solution.nodes || []).some((node: any) => {
        const ts = (node.train?.acronym || '').toUpperCase();
        const cat = (node.train?.trainCategory || '').toUpperCase();
        const isBus = ts === 'BU' || ts === 'BUS' || cat.includes('BUS');
        const isUrbano = ts === 'UB' || cat.includes('URBANO');
        return isBus || isUrbano;
      });
      return !hasBusOrUrbano;
    });

    const routes: TrenitRoute[] = filteredSolutions.map((item: any) => {
      const sol = item.solution;
      
      const departureDateObj = new Date(sol.departureTime);
      const dx = Math.floor(departureDateObj.getTime() / 1000);
      const dd = `${departureDateObj.getFullYear()}-${(departureDateObj.getMonth()+1).toString().padStart(2, '0')}-${departureDateObj.getDate().toString().padStart(2, '0')}`;
      
      const dt = parseBffTimeToHHmm(sol.departureTime);
      const at = parseBffTimeToHHmm(sol.arrivalTime);
      
      // dur mapping: "4h 32min" -> "4h32'"
      const durMatch = sol.duration.match(/(?:(\d+)h\s*)?(?:(\d+)min)?/);
      let dur = sol.duration;
      if (durMatch) {
        const hrs = durMatch[1] ? `${durMatch[1]}h` : '';
        const mins = durMatch[2] ? `${durMatch[2]}'` : '';
        dur = `${hrs}${mins}`;
      }

      const ns = sol.trains && sol.trains.length > 0 ? sol.trains[0].name : '';

      const legs: TrenitLeg[] = (sol.nodes || []).map((node: any) => {
        let ts = node.train.acronym || '';
        if (ts === 'FR') ts = 'FrRossa';
        else if (ts === 'FA') ts = 'FrArgento';
        else if (ts === 'FB') ts = 'FrBianca';
        else if (ts === 'IC') ts = 'InterCity';
        else if (ts === 'NI') ts = 'ICnotte';
        else if (ts === 'RE' || ts === 'REG') ts = 'Reg';
        else if (ts === 'RV') ts = 'Regv';
        
        if (node.train.logoId === 'TTPER' || (node.train.denomination && node.train.denomination.includes('TTPER'))) {
           if (ts === 'Regv') ts = 'Regv Tper';
           else ts = 'Reg Tper';
        }
        
        return {
          ts: ts,
          n: node.train.name,
          dt: parseBffTimeToHHmm(node.departureTime),
          ds: node.origin,
          at: parseBffTimeToHHmm(node.arrivalTime),
          as: node.destination
        };
      });

      const route: TrenitRoute = {
        dx,
        ns,
        dd,
        dt,
        ds: sol.origin,
        at,
        as: sol.destination,
        dur,
        l: legs
      };

      let totalCoveredNodes = 0;
      if (item.grids) {
        item.grids.forEach((g: any) => {
          totalCoveredNodes += g.summaries ? g.summaries.length : 1;
        });
      }

      const isSaleable = sol.status === 'SALEABLE' && item.grids && totalCoveredNodes === (sol.nodes || []).length;

      if (isSaleable && sol.price && sol.price.amount !== undefined && sol.price.amount !== null) {
        route.pr = sol.price.amount.toFixed(2).replace('.', ',');
      }

      if (isSaleable && item.grids && item.grids.length > 0) {
        let defaultOfferName = "Ordinaria";
        let defaultServiceName = "Standard";
        const firstGrid = item.grids[0];
        if (firstGrid.services && firstGrid.services.length > 0) {
          const service = firstGrid.services.find((s: any) => s.id === firstGrid.selectedServiceId) || firstGrid.services[0];
          if (service && service.name) {
            defaultServiceName = service.name.replace(/ PRENOTAZIONE/i, '').trim();
          }
          if (service && service.offers && service.offers.length > 0) {
            const offer = service.offers.find((o: any) => o.offerId === firstGrid.selectedOfferId) || service.offers[0];
            if (offer && offer.name) defaultOfferName = offer.name;
          }
        }

        let nodeOffset = 0;
        route.tk = item.grids.map((grid: any, gridIdx: number) => {
          const classes: string[] = [];
          const offersSet = new Set<string>();
          
          (grid.services || []).forEach((service: any) => {
            if (service.name) classes.push(service.name.replace(/ PRENOTAZIONE/i, '').trim());
            (service.offers || []).forEach((offer: any) => {
              if (offer.name) offersSet.add(offer.name);
            });
          });
          
          const offers = Array.from(offersSet);
          const prices: string[][] = [];
          
          (grid.services || []).forEach((service: any) => {
            const classPrices: string[] = [];
            offers.forEach((offerName: string) => {
              const offer = (service.offers || []).find((o: any) => o.name === offerName);
              if (offer && offer.price && offer.price.amount !== undefined && offer.price.amount !== null) {
                classPrices.push(offer.price.amount.toFixed(2).replace('.', ','));
              } else {
                classPrices.push('');
              }
            });
            prices.push(classPrices);
          });
          
          const indices = [];
          const gridNodeCount = grid.summaries ? grid.summaries.length : 1;
          for (let k = 0; k < gridNodeCount; k++) {
             indices.push(nodeOffset++);
          }

          return {
            i: indices,
            c: classes,
            f: offers,
            p: prices,
            sf: gridIdx === 0 ? defaultOfferName : undefined,
            sc: gridIdx === 0 ? defaultServiceName : undefined
          };
        });
      } else if (isSaleable && sol.price && sol.price.amount !== undefined && sol.price.amount !== null) {
        // Fallback if grids is empty but we have a price
        let fallbackOffer = sol.trains && sol.trains.length > 0 ? sol.trains[0].trainCategory : "Standard";
        route.tk = [{
          i: [0],
          c: ["Standard"],
          sf: fallbackOffer,
          p: [[route.pr!]]
        }];
      }

      return route;
    });

    return { data: { routes } };

  } catch (error) {
    console.error("Trenitalia BFF fetch failed:", error);
    throw error;
  }
}
