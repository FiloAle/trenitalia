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
	GoogleSans_400Regular,
	GoogleSans_500Medium,
	GoogleSans_600SemiBold,
	GoogleSans_700Bold,
} from "@expo-google-fonts/google-sans";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
		GoogleSans_400Regular,
		GoogleSans_500Medium,
		GoogleSans_600SemiBold,
		GoogleSans_700Bold,
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
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider value={DefaultTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="search" options={{ animation: "slide_from_bottom", headerShown: false }} />
					<Stack.Screen name="search-results" options={{ animation: "slide_from_right", headerShown: false }} />
					<Stack.Screen
						name="ticket-detail"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="qr-code"
						options={{
							animation: "slide_from_bottom",
							headerShown: false,
						}}
					/>
					<Stack.Screen name="add-services" options={{ presentation: "fullScreenModal", headerShown: false }} />
					<Stack.Screen name="complete-trip" options={{ presentation: "fullScreenModal", headerShown: false }} />
					<Stack.Screen name="electronic-credit" options={{ presentation: "fullScreenModal", headerShown: false }} />
					<Stack.Screen name="payment-processing" options={{ headerShown: false }} />
					<Stack.Screen name="payment-success" options={{ headerShown: false }} />
					<Stack.Screen name="select-offer" options={{ headerShown: false }} />
					<Stack.Screen name="passenger-data" options={{ headerShown: false }} />
					<Stack.Screen name="summary" options={{ headerShown: false }} />
					<Stack.Screen name="train-details" options={{ headerShown: false }} />
					<Stack.Screen name="station-board" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="dark" />
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
