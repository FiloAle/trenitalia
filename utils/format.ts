/**
 * Centralised formatting helpers for ticket / travel-solution display values.
 * Every component should import from here instead of doing inline replacements.
 */

// ─── Class name ──────────────────────────────────────────────────────

/**
 * Formats a service-class name for display.
 * - Strips "PRENOTAZIONE" and "posto/posti a sedere" suffixes
 * - Uppercases the result
 * - Clamps to `maxLength` characters with an ellipsis
 */
export function formatClassName(name: string, maxLength: number = 16): string {
	if (!name) return "";
	const cleaned = name
		.replace(/ PRENOTAZIONE/i, "")
		.replace(/[- ]*post[oi]\s+a\s+sedere/gi, "")
		.trim()
		.toUpperCase();
	return cleaned.length > maxLength
		? cleaned.substring(0, maxLength) + "…"
		: cleaned;
}

// ─── Offer name ──────────────────────────────────────────────────────

/**
 * Formats an offer name for display (Title Case, with special-case handling).
 * - Strips "posto/posti a sedere" suffixes
 * - Handles branded names: S.ECONOMY → Super Economy, FR.DAYS/FRECCIADAYS → FrecciaDAYS, FRECCIAYOUNG → FrecciaYOUNG
 * - Everything else → Title Case
 */
export function formatOfferName(rawName: string): string {
	if (!rawName) return "";
	const name = rawName.replace(/[- ]*post[oi]\s+a\s+sedere/gi, "").trim();

	if (name === "S.ECONOMY") return "Super Economy";

	const upper = name.toUpperCase();
	if (upper === "FR.DAYS" || upper === "FRECCIADAYS") return "FrecciaDAYS";
	if (upper === "FRECCIAYOUNG") return "FrecciaYOUNG";

	return name
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
		.trim();
}

// ─── Person name ─────────────────────────────────────────────────────

/**
 * Formats a person name in Title Case (e.g. "MARIO ROSSI" → "Mario Rossi").
 */
export function formatPersonName(name: string): string {
	if (!name) return "";
	return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Backward-compatible alias ───────────────────────────────────────

/** @deprecated Use `formatClassName` instead */
export const clampClassName = formatClassName;

// ─── Train name ──────────────────────────────────────────────────────

/**
 * Formats a train type name for display (e.g. "frrossa" -> "Frecciarossa").
 */
export function formatTrainName(type: string): string {
	if (!type) return "";
	const normalizedType = type.trim().toLowerCase();
	if (
		normalizedType.includes("frecciarossa") ||
		normalizedType === "frrossa"
	) {
		return "FRECCIAROSSA";
	} else if (
		normalizedType.includes("frecciargento") ||
		normalizedType === "frargento"
	) {
		return "FRECCIARGENTO";
	} else if (
		normalizedType.includes("frecciabianca") ||
		normalizedType === "frbianca"
	) {
		return "FRECCIABIANCA";
	} else if (
		normalizedType.includes("intercity") ||
		normalizedType === "icnotte" ||
		normalizedType === "ic" ||
		normalizedType === "ni"
	) {
		return "InterCity";
	} else if (normalizedType.includes("tper")) {
		return "Trenitalia TPER";
	} else if (
		normalizedType.includes("reg") ||
		normalizedType === "rv" ||
		normalizedType === "re"
	) {
		return "Regionale";
	} else if (normalizedType.includes("eurocity") || normalizedType === "ec") {
		return "EuroCity";
	}
	return type
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
		.trim();
}

