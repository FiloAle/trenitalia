import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

interface PurchaseOptionProps {
	icon: string;
	label: string;
	onPress?: () => void;
}

function PurchaseOption({ icon, label, onPress }: PurchaseOptionProps) {
	return (
		<Pressable
			onPress={onPress}
			className="w-[22%] items-center justify-start gap-3"
		>
			<View className="h-[4.5em] w-[4.5em] items-center justify-center rounded-lg border border-gray-100 bg-white">
				<Icon name={icon} size={32} color="#c1152c" weight={300} />
			</View>
			<ThemedText className="text-center text-[11px] font-plus-jakarta-semibold !leading-tight !text-gray-600">
				{label}
			</ThemedText>
		</Pressable>
	);
}

interface PurchaseModalProps {
	isVisible: boolean;
	onClose: () => void;
}

export function PurchaseModal({ isVisible, onClose }: PurchaseModalProps) {
	return (
		<BottomSheet isVisible={isVisible} onClose={onClose} title="Acquista">
			<View className="flex-row justify-between mb-4">
				<PurchaseOption
					icon="confirmation_number"
					label="Biglietti"
					onPress={onClose}
				/>
				<PurchaseOption icon="view_day" label="Carnet" onPress={onClose} />
				<PurchaseOption
					icon="credit_card"
					label="Abbonamenti"
					onPress={onClose}
				/>
				<PurchaseOption
					icon="local_mall"
					label="Promo e servizi"
					onPress={onClose}
				/>
			</View>
		</BottomSheet>
	);
}
