/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				"google-sans-regular": ["GoogleSans_400Regular"],
				"google-sans-medium": ["GoogleSans_500Medium"],
				"google-sans-semibold": ["GoogleSans_600SemiBold"],
				"google-sans-bold": ["GoogleSans_700Bold"],
				"google-sans-extrabold": ["GoogleSans_700Bold"],
			},
			colors: {
				primary: {
					100: "#ADFFFF",
					200: "#00E1E1",
					300: "#00B6B6",
					400: "#008D8D",
					500: "#006666",
					600: "#004141",
					700: "#002020",
				},
			},
		},
	},
	plugins: [],
};
