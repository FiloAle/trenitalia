import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
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

	const getSingular = (chip: string) => {
		switch (chip) {
			case "Biglietti":
				return "biglietto";
			case "Abbonamenti":
				return "abbonamento";
			default:
				return chip.toLowerCase();
		}
	};

	const itemName = getSingular(activeChip);

	return (
		<View className="mt-20 items-center justify-center px-10">
			<Icon name={getIconName()} size={64} color="#d1d5db" />
			<ThemedText className="mt-6 text-center text-xl font-google-sans-bold !text-neutral-950">
				Nessun {itemName} trovato
			</ThemedText>
			<ThemedText className="mt-2 text-center font-google-sans-medium !text-neutral-500">
				Una volta acquistato un {itemName} lo potrai vedere qui
			</ThemedText>
		</View>
	);
}
