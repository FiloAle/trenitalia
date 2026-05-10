import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

interface SearchCardProps {
	type: string;
	route: string;
	subtitle: string;
	typeColor: string;
	typeLabelColor: string;
}

function QuickSearchCard({
	type,
	route,
	subtitle,
	typeColor,
	typeLabelColor,
}: SearchCardProps) {
	return (
		<Pressable className="mr-4 w-72 rounded-lg border border-gray-200 bg-white p-4">
			<View
				className="mb-3 self-start rounded-md px-2 py-1"
				style={{ backgroundColor: typeColor }}
			>
				<ThemedText
					className="text-sm font-plus-jakarta-bold"
					style={{ color: typeLabelColor }}
				>
					{type}
				</ThemedText>
			</View>
			<ThemedText className="mb-1 text-base font-plus-jakarta-bold !text-gray-950">
				{route}
			</ThemedText>
			<ThemedText className="font-plus-jakarta-medium text-sm !text-gray-600">
				{subtitle}
			</ThemedText>
		</Pressable>
	);
}

export function QuickSearches() {
	const searches = [
		{
			id: "1",
			type: "Acquisto rapido",
			route: "Milano Centrale - Cesena",
			subtitle: "Acquista in pochi click",
			typeColor: "#ffe4e6",
			typeLabelColor: "#c1152c",
		},
		{
			id: "2",
			type: "Ultima ricerca",
			route: "Roma Termini - Firenze S.M.N.",
			subtitle: "Riprendi da dove eri rimasto",
			typeColor: "#f0fdf4",
			typeLabelColor: "#166534",
		},
	];

	return (
		<View className="gap-4">
			<ThemedText className="text-md font-plus-jakarta-bold !text-[#262626]">
				Ricerche veloci
			</ThemedText>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="-mx-5"
				contentContainerStyle={{ paddingHorizontal: 20 }}
			>
				{searches.map((search) => (
					<QuickSearchCard key={search.id} {...search} />
				))}
			</ScrollView>
		</View>
	);
}
