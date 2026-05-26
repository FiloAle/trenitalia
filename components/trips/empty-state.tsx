import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { View } from "react-native";

interface EmptyStateProps {
	activeChip: string;
}

export function EmptyState({ activeChip }: EmptyStateProps) {
	const getIconName = () => {
		switch (activeChip) {
			case "Abbonamenti":
				return "card_membership";
			case "Carnet":
				return "view_day";
			case "TPL":
				return "directions_bus";
			default:
				return "archive";
		}
	};

	const lowercaseChip = activeChip.toLowerCase();

	return (
		<View className="mt-20 items-center justify-center px-10">
			<Icon
				name={getIconName()}
				size={64}
				color="#d1d5db"
			/>
			<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
				Nessun {lowercaseChip} trovato
			</ThemedText>
			<ThemedText className="mt-2 text-center font-plus-jakarta-medium !text-gray-500">
				Una volta acquistato un {lowercaseChip} lo potrai
				vedere qui
			</ThemedText>
		</View>
	);
}
