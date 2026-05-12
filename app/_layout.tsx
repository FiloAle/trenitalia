import "../global.css";

import {
	MaterialSymbols_100Thin,
	MaterialSymbols_200ExtraLight,
	MaterialSymbols_300Light,
	MaterialSymbols_400Regular,
	MaterialSymbols_500Medium,
	MaterialSymbols_600SemiBold,
	MaterialSymbols_700Bold,
	useFonts,
} from "@expo-google-fonts/material-symbols";
import {
	PlusJakartaSans_400Regular,
	PlusJakartaSans_500Medium,
	PlusJakartaSans_600SemiBold,
	PlusJakartaSans_700Bold,
	PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
	/* ignore */
});

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const [loaded, error] = useFonts({
		MaterialSymbols_100Thin,
		MaterialSymbols_200ExtraLight,
		MaterialSymbols_300Light,
		MaterialSymbols_400Regular,
		MaterialSymbols_500Medium,
		MaterialSymbols_600SemiBold,
		MaterialSymbols_700Bold,
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_600SemiBold,
		PlusJakartaSans_700Bold,
		PlusJakartaSans_800ExtraBold,
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync().catch(() => {
				// Ignore errors when the splash screen is already hidden
			});
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<ThemeProvider value={DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
			<StatusBar style="dark" />
		</ThemeProvider>
	);
}
