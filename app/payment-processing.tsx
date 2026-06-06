import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentProcessingScreen() {
	const insets = useSafeAreaInsets();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace("/payment-success");
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<View className="flex-1 bg-white">
			<Stack.Screen options={{ headerShown: false }} />

			{/* Minimal Header */}
			<View
				className="bg-white px-5 flex-row items-center justify-center relative"
				style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
			>
				<ThemedText className="text-[17px] font-plus-jakarta-bold !text-gray-950 text-center">
					Pagamento
				</ThemedText>
			</View>

			<View className="flex-1 items-center justify-center px-8 mb-20">
				{/* Illustration Placeholder */}
				<View className="w-48 h-48 bg-[#e8f1f1] rounded-full items-center justify-center mb-8 relative">
					{/* Add some grid lines to simulate the illustration background */}
					<View className="absolute w-full h-[1px] bg-[#d1e3e3] rotate-45" />
					<View className="absolute w-full h-[1px] bg-[#d1e3e3] -rotate-45" />
					<View className="absolute h-full w-[1px] bg-[#d1e3e3] ml-12" />
					<View className="absolute w-full h-[1px] bg-[#d1e3e3] mt-12" />
					
					{/* Credit Card Icon rotated */}
					<View className="bg-[#c1152c] rounded-xl p-4 -rotate-12 shadow-sm border border-red-800/20">
						<Icon name="credit_card" size={80} color="white" />
					</View>
				</View>

				<ThemedText className="text-[20px] font-plus-jakarta-bold !text-gray-950 text-center mb-2">
					Attendi
				</ThemedText>
				<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-950 text-center leading-tight">
					Stiamo procedendo con l'operazione.{"\n"}A breve verrai reindirizzato nella schermata{"\n"}di riepilogo.
				</ThemedText>
			</View>
		</View>
	);
}
