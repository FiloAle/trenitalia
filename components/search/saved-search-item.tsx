import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Pressable, View } from "react-native";

interface SavedSearchItemProps {
	route: string;
	badge: string;
	colorClass: string;
	onPress?: () => void;
}

export function SavedSearchItem({
	route,
	badge,
	colorClass,
	onPress,
}: SavedSearchItemProps) {
	const [bg, text, border] = colorClass.split(" ");

	return (
		<Pressable
			onPress={onPress}
			className="flex-row items-center justify-between py-2.5 px-2"
		>
			<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-900">
				{route}
			</ThemedText>
			<View className={`${bg} ${border} border px-2 py-0.5 rounded-md`}>
				<ThemedText className={`text-[11px] font-plus-jakarta-bold ${text}`}>
					{badge}
				</ThemedText>
			</View>
		</Pressable>
	);
}
