/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				"plus-jakarta": ["PlusJakartaSans_400Regular"],
				"plus-jakarta-medium": ["PlusJakartaSans_500Medium"],
				"plus-jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
				"plus-jakarta-bold": ["PlusJakartaSans_700Bold"],
				"plus-jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
			},
		},
	},
	plugins: [],
};
