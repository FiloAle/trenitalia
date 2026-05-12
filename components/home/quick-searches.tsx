import { RECENT_SEARCHES, SAVED_SEARCHES } from "@/constants/stations";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

interface SearchCardProps {
	type: string;
	from: string;
	to: string;
	subtitle: string;
	typeColor: string;
	typeLabelColor: string;
	onPress: () => void;
}

function QuickSearchCard({
	type,
	from,
	to,
	subtitle,
	typeColor,
	typeLabelColor,
	onPress,
}: SearchCardProps) {
	return (
		<Pressable
			onPress={onPress}
			className="mr-4 w-72 rounded-lg border border-gray-200 bg-white p-4"
		>
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
				{from} - {to}
			</ThemedText>
			<ThemedText className="font-plus-jakarta-medium text-sm !text-gray-600">
				{subtitle}
			</ThemedText>
		</Pressable>
	);
}

interface QuickSearchesProps {
	onSelectRoute: (from: string, to: string) => void;
}

export function QuickSearches({ onSelectRoute }: QuickSearchesProps) {
	// We pick the first saved search and the first recent search for the home cards
	const quickCards = [
		{
			...SAVED_SEARCHES[0],
			type: "Acquisto rapido",
			subtitle: "Acquista in pochi click",
			typeColor: "#ffe4e6",
			typeLabelColor: "#c1152c",
		},
		{
			...RECENT_SEARCHES[1], // Roma - Firenze
			type: "Ultima ricerca",
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
				{quickCards.map((card, index) => (
					<QuickSearchCard
						key={index}
						{...card}
						onPress={() => onSelectRoute(card.from, card.to)}
					/>
				))}
			</ScrollView>
		</View>
	);
}
