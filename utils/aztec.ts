import * as bwipjs from "@bwip-js/react-native";

const cache: Record<string, string> = {};

export function getCachedAztec(text: string, scale: number = 16): string | null {
	return cache[`${text}-${scale}`] || null;
}

export async function generateAztec(text: string, scale: number = 16): Promise<string> {
	const cacheKey = `${text}-${scale}`;
	if (cache[cacheKey]) {
		return cache[cacheKey];
	}

	try {
		const result: any = await bwipjs.toDataURL({
			bcid: "azteccode",
			text,
			scale,
			backgroundcolor: "ffffff",
		});
		
		const uri = result.uri || result;
		cache[cacheKey] = uri;
		return uri;
	} catch (err) {
		console.error("Aztec code generation error:", err);
		throw err;
	}
}
