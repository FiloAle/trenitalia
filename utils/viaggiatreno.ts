import { Platform } from "react-native";
import Constants from "expo-constants";

export async function getTrainStopsCount(
	trainNumber: string,
	originName: string,
	destinationName: string
): Promise<number | null> {
	const hostUri = Constants.expoConfig?.hostUri;
	const proxyBase =
		Platform.OS === "web"
			? hostUri
				? `http://${hostUri}/api/proxy?url=`
				: "/api/proxy?url="
			: "";

	try {
		// 1. Get CodLocOrig via Autocomplete
		const autoUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`;
		const targetFetchUrl = proxyBase
			? `${proxyBase}${encodeURIComponent(autoUrl)}`
			: autoUrl;

		const autoResponse = await fetch(targetFetchUrl);
		const autoText = await autoResponse.text();

		const firstLine = autoText.split("\n")[0];
		if (!firstLine || !firstLine.includes("|")) return null;

		const parts = firstLine.split("|");
		if (parts.length < 2) return null;

		const ids = parts[1].trim().split("-");
		if (ids.length < 3) return null;

		const tNum = ids[0];
		const codLocOrig = ids[1];
		const dataPartenza = ids[2]; 

		// 2. Fetch train details
		const detailsUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/andamentoTreno/${codLocOrig}/${tNum}/${dataPartenza}`;
		const detailsTargetFetchUrl = proxyBase
			? `${proxyBase}${encodeURIComponent(detailsUrl)}`
			: detailsUrl;

		const detailsResponse = await fetch(detailsTargetFetchUrl);
		const data = await detailsResponse.json();

		if (!data.fermate || data.fermate.length === 0) return null;

		const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

		const normOrigin = normalize(originName);
		const normDest = normalize(destinationName);

		let startIndex = -1;
		let endIndex = -1;

		data.fermate.forEach((f: any, idx: number) => {
			const normStazione = normalize(f.stazione);
			if (normStazione === normOrigin || normStazione.includes(normOrigin) || normOrigin.includes(normStazione)) {
				if (startIndex === -1) startIndex = idx;
			}
			if (normStazione === normDest || normStazione.includes(normDest) || normDest.includes(normStazione)) {
				endIndex = idx;
			}
		});

		if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
			return endIndex - startIndex;
		}

		return null;
	} catch (e) {
		console.warn("getTrainStopsCount error:", e);
		return null;
	}
}
