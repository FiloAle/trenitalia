import { ThemedText } from "@/components/themed-text";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, View } from "react-native";

export function PromoCarousel() {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="-mx-6 px-1"
			contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
		>
			<View className="h-40 w-80 rounded-2xl overflow-hidden relative bg-neutral-200">
				<Image
					source={require("@/assets/images/young.webp")}
					style={{
						width: "100%",
						height: 300,
						position: "absolute",
						bottom: 0,
					}}
					resizeMode="cover"
				/>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.9)"]}
					style={StyleSheet.absoluteFill}
				/>
				<View className="absolute bottom-0 left-0 right-0 px-4 pb-4 items-center">
					<ThemedText className="!text-white font-google-sans-extrabold text-md mb-1 text-center">
						CARNET 10 VIAGGI YOUNG
					</ThemedText>
					<ThemedText className="!text-white font-google-sans-medium text-[13px] opacity-90 leading-tight text-center">
						10 viaggi con il 25% di sconto{"\n"}per gli under 30.
					</ThemedText>
				</View>
			</View>
			<View className="h-40 w-80 rounded-2xl overflow-hidden relative bg-neutral-200">
				<Image
					source={require("@/assets/images/senior.webp")}
					className="w-full h-full"
					resizeMode="cover"
				/>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.9)"]}
					style={StyleSheet.absoluteFill}
				/>
				<View className="absolute bottom-0 left-0 right-0 px-4 pb-4 items-center">
					<ThemedText className="!text-white font-google-sans-extrabold text-md mb-1 text-center">
						FrecciaSENIOR
					</ThemedText>
					<ThemedText className="!text-white font-google-sans-medium text-[13px] opacity-90 leading-tight text-center">
						Gli over 60 viaggiano sulle Frecce{"\n"}a partire da 29€.
					</ThemedText>
				</View>
			</View>
			<View className="h-40 w-80 rounded-2xl overflow-hidden relative bg-neutral-200">
				<Image
					source={require("@/assets/images/freccia.webp")}
					className="w-full h-full"
					resizeMode="cover"
				/>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.9)"]}
					style={StyleSheet.absoluteFill}
				/>
				<View className="absolute bottom-0 left-0 right-0 px-4 pb-4 items-center">
					<ThemedText className="!text-white font-google-sans-extrabold text-sm mb-1 text-center">
						VIAGGIA CON FRECCIA
					</ThemedText>
					<ThemedText className="!text-white font-google-sans-medium text-[13px] opacity-90 leading-tight text-center">
						Raggiungi destinazioni turistiche{"\n"}con Freccia a partire da 19€.
					</ThemedText>
				</View>
			</View>
		</ScrollView>
	);
}
