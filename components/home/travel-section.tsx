import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { View } from "react-native";

export function TravelSection() {
	return (
		<View className="gap-4">
			<ThemedText className="text-md font-plus-jakarta-bold !text-[#262626]">
				Per il tuo viaggio
			</ThemedText>
			<View className="flex-row gap-3">
				<View className="flex-1 rounded-lg bg-[#e6f2f2] p-4">
					<View className="mb-4 flex-row items-center justify-between">
						<Icon name="near_me" size={20} color="teal-900" />
						<ThemedText className="text-xs font-plus-jakarta-bold !text-teal-900">
							Cambia
						</ThemedText>
					</View>
					<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-600 mb-0.5">
						Prossime partenze da:
					</ThemedText>
					<ThemedText className="text-[13px] font-plus-jakarta-bold !text-teal-900 line-clamp-1">
						Milano Bovisa Politecnico
					</ThemedText>
				</View>

				<View className="flex-1 rounded-lg bg-[#e6f2f2] p-4">
					<View className="mb-4 flex-row items-center justify-start">
						<Icon name="info" size={20} color="teal-900" />
					</View>
					<ThemedText className="text-[13px] font-plus-jakarta-bold !text-gray-900 mb-0.5">
						Notizie di infomobilità
					</ThemedText>
					<ThemedText className="text-[11px] font-plus-jakarta-medium !text-gray-500">
						Ultimo aggiornamento: 05/05/2026
					</ThemedText>
				</View>
			</View>
		</View>
	);
}
