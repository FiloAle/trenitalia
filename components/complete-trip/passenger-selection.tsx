import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA, getInitials } from "@/constants/user";
import React from "react";
import { Pressable, View } from "react-native";

interface PassengerSelectionProps {
	price: number;
	acceptedTerms: boolean;
	onToggleTerms: () => void;
}

export function PassengerSelection({
	price,
	acceptedTerms,
	onToggleTerms,
}: PassengerSelectionProps) {
	return (
		<View className="px-5 py-6">
			<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-600 mb-6">
				Seleziona i passeggeri che viaggiano con il cane
			</ThemedText>

			<View className="flex-row items-center justify-between mb-6">
				<View className="flex-row items-center">
					<View className="h-12 w-12 rounded-full bg-[#005045]/10 items-center justify-center mr-3">
						<ThemedText className="font-plus-jakarta-bold text-[#005045]">
							{getInitials(USER_DATA.firstName, USER_DATA.lastName)}
						</ThemedText>
					</View>
					<View>
						<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 uppercase">
							{USER_DATA.firstName} {USER_DATA.lastName}
						</ThemedText>
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-600">
							Adulto
						</ThemedText>
					</View>
				</View>

				<View className="flex-row items-center">
					<ThemedText className="text-base font-plus-jakarta-medium !text-gray-600 mr-3">
						{price.toFixed(2).replace(".", ",")}€
					</ThemedText>
					{/* Mock Checkbox */}
					<View className="h-5 w-5 rounded bg-[#005045] items-center justify-center">
						<Icon name="check" size={16} color="white" weight={600} />
					</View>
				</View>
			</View>

			{/* Tipologia Box */}
			<View className="border border-gray-200 rounded-lg p-3 mb-8">
				<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500 mb-1">
					Tipologia
				</ThemedText>
				<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-400">
					Viaggia con il tuo cane
				</ThemedText>
			</View>

			{/* Terms */}
			<Pressable
				className="flex-row items-center"
				onPress={onToggleTerms}
			>
				<View
					className={`h-5 w-5 rounded items-center justify-center mr-3 border ${
						acceptedTerms ? "bg-[#005045] border-[#005045]" : "border-gray-400"
					}`}
				>
					{acceptedTerms && <Icon name="check" size={16} color="white" weight={600} />}
				</View>
				<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-700">
					Ho letto le <ThemedText className="!text-[#8a052b] underline">condizioni di utilizzo</ThemedText>
				</ThemedText>
			</Pressable>
		</View>
	);
}
