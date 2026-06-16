import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

interface TicketBottomActionsProps {
	onGestisci: () => void;
}

export function TicketBottomActions({ onGestisci }: TicketBottomActionsProps) {
	return (
		<View className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-16 pt-4 border-t border-gray-100">
			<Pressable className="mb-2 !h-14 flex-row items-center justify-center rounded-lg bg-[#1c1c1e] active:opacity-80">
				<Icon name="wallet" size={24} color="white" className="mr-2" />
				<ThemedText className="text-[16px] font-plus-jakarta-bold !text-white">
					Aggiungi a Wallet
				</ThemedText>
			</Pressable>

			<Pressable 
				className="!h-14 flex-row items-center justify-center rounded-lg bg-teal-900 active:opacity-80"
				onPress={onGestisci}
			>
				<ThemedText className="text-[16px] font-plus-jakarta-bold !text-white">
					Gestisci
				</ThemedText>
			</Pressable>
		</View>
	);
}
