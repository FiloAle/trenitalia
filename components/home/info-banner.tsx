import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

interface InfoBannerProps {
	title?: string;
	description?: string;
}

export function InfoBanner({
	title = "Informazioni sulla circolazione",
	description = "Vai alle notizie",
}: InfoBannerProps) {
	return (
		<Pressable className="flex-row items-center rounded-lg bg-[#eef4ff] px-4 py-3">
			<View className="mr-4 items-center justify-center">
				<Icon name="info" size={24} color="#003594" />
			</View>
			<View className="flex-1">
				<ThemedText className="font-plus-jakarta-semibold text-[13px] !text-gray-800">
					{title}
				</ThemedText>
				<View className="flex-row items-center">
					<ThemedText className="mr-1 font-plus-jakarta-medium text-[13px] !text-gray-500">
						{description}
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
