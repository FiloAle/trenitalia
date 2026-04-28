import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

export function InfoBanner() {
	return (
		<Pressable className="flex-row items-center rounded-xl bg-[#eef4ff] py-3 px-4">
			<View className="mr-4 items-center justify-center">
				<Icon name="info" size={24} color="#003594" />
			</View>
			<View className="flex-1">
				<ThemedText className="text-base font-plus-jakarta-semibold !text-gray-800 text-[13px] -mb-1">
					Informazioni sulla circolazione
				</ThemedText>
				<View className="flex-row items-center">
					<ThemedText className="mr-1 text-sm font-plus-jakarta-medium !text-gray-500">
						Vai alle notizie
					</ThemedText>
					<Icon
						name="open_in_new"
						size={12}
						color="#6b7280"
						className="!mt-0.5"
					/>
				</View>
			</View>
		</Pressable>
	);
}
