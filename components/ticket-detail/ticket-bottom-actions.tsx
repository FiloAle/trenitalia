import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TicketBottomActionsProps {
	onGestisci: () => void;
}

export function TicketBottomActions({ onGestisci }: TicketBottomActionsProps) {
	const insets = useSafeAreaInsets();
	
	return (
		<View 
			className="absolute bottom-0 left-0 right-0 bg-white px-5"
			style={{ paddingBottom: Math.max(insets.bottom, 24) }}
		>
			<Pressable className="mb-2 h-14 flex-row items-center justify-center rounded-2xl bg-[#1c1c1e] active:opacity-80">
				{/* Wallet Icon approximation using SVG or generic Icon */}
				<Icon name="wallet" size={20} color="white" className="mr-2" />
				<ThemedText className="text-[16px] font-google-sans-bold !text-white text-center">
					Aggiungi a Wallet
				</ThemedText>
			</Pressable>

			<MainButton title="Gestisci" onPress={onGestisci} />
		</View>
	);
}
