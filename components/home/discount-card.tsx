import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, View } from "react-native";

export function DiscountCard() {
	return (
		<Pressable className="rounded-2xl overflow-hidden border border-gray-200">
			<View className="h-[140px] relative overflow-hidden bg-black">
				<Image
					source={require("@/assets/images/summer.avif")}
					className="w-full aspect-video absolute bottom-0"
					resizeMode="cover"
				/>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.8)"]}
					style={StyleSheet.absoluteFill}
				/>
				<View className="absolute top-0 bottom-0 left-0 right-0 px-4 items-center justify-end pb-3.5">
					<ThemedText className="!text-white text-center font-plus-jakarta-medium text-[15px]">
						Utilizza il codice sconto{" "}
						<ThemedText className="!text-white font-plus-jakarta-bold text-[15px] underline">
							ESTATE25
						</ThemedText>
						{"\n"}per ottenere il 25% di sconto.
					</ThemedText>
				</View>
			</View>
			<View className="bg-teal-900 flex-row justify-between items-center px-5 py-4">
				<ThemedText className="!text-white font-plus-jakarta-bold text-lg tracking-wider">
					ESTATE25
				</ThemedText>
				<Pressable className="flex-row items-center">
					<ThemedText className="!text-white font-plus-jakarta-medium text-[15px] mr-2">
						Copia
					</ThemedText>
					<Icon name="content_copy" size={20} color="white" />
				</Pressable>
			</View>
		</Pressable>
	);
}
