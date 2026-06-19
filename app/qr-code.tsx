import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { USER_DATA } from "@/constants/user";
import { generateAztec, getCachedAztec } from "@/utils/aztec";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Pressable,
	View,
	Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import Constants, { ExecutionEnvironment } from "expo-constants";

const { width } = Dimensions.get("window");

export default function QRCodeScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const qrValue =
		USER_DATA.firstName +
		"|" +
		USER_DATA.lastName +
		"|" +
		USER_DATA.loyaltyCode +
		"|" +
		((params.pnr as string) || "undefined"); // Fallback to PNR string

	const [aztecImageUri, setAztecImageUri] = useState<string | null>(getCachedAztec(qrValue, 16));

	useEffect(() => {
		generateAztec(qrValue, 16)
			.then((uri) => setAztecImageUri(uri))
			.catch((err) => console.error("Aztec code generation error:", err));
	}, [qrValue]);

	return (
		<View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
			{/* Header Nav */}
			<View className="flex-row items-center justify-end px-5 py-4">
				<Pressable className="p-2" onPress={() => router.back()}>
					<Icon name="close" size={28} color="black" />
				</Pressable>
			</View>

			{/* Aztec / QR Code Container */}
			<View className="flex-1 items-center justify-center px-10">
				{Platform.OS === "web" || Constants.executionEnvironment === ExecutionEnvironment.StoreClient ? (
					<QRCode
						value={qrValue}
						size={width * 0.8}
						color="black"
						backgroundColor="white"
					/>
				) : aztecImageUri ? (
					<Image
						source={{ uri: aztecImageUri }}
						style={{ width: width * 0.8, height: width * 0.8 }}
						resizeMode="contain"
					/>
				) : (
					<ActivityIndicator size="large" color="#004141" />
				)}
			</View>

			{/* Bottom Button */}
			<View
				className="px-5 pb-8 pt-4"
				style={{ paddingBottom: insets.bottom + 20 }}
			>
				<MainButton
					title="Chiudi"
					onPress={() => router.back()}
					className="!h-16"
				/>
			</View>
		</View>
	);
}
