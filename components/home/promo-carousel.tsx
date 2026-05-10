import React from "react";
import { ScrollView, View } from "react-native";

export function PromoCarousel() {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="-mx-5"
			contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
		>
			<View className="h-40 w-80 rounded-lg bg-gray-200" />
			<View className="h-40 w-80 rounded-lg bg-gray-200" />
			<View className="h-40 w-80 rounded-lg bg-gray-200" />
		</ScrollView>
	);
}
