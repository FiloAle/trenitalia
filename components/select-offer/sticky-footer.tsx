import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface StickyFooterProps {
	totalPrice: number;
	basePrice: number;
	buttonTitle?: string;
	onPress?: () => void;
	hideSeatSelection?: boolean;
	subtitle?: string;
	disabled?: boolean;
	isLoading?: boolean;
}

export function StickyFooter({ 
	totalPrice, 
	basePrice,
	buttonTitle = "Continua",
	onPress,
	hideSeatSelection = false,
	subtitle = "Vedi carrello",
	disabled = false,
	isLoading = false,
}: StickyFooterProps) {
	const insets = useSafeAreaInsets();

	return (
		<View
			className="absolute bottom-0 left-0 right-0 bg-white"
			style={{
				shadowColor: "#000",
				shadowOffset: { width: 0, height: -2 },
				shadowOpacity: 0.05,
				shadowRadius: 6,
				elevation: 6,
			}}
		>
			{!hideSeatSelection && (
				<View className="px-5 py-3 border-b border-gray-100 flex-row items-center">
					<Icon name="event_seat" size={20} className="!text-gray-600 mr-3" />
					<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-800 flex-1">
						La scelta del posto è disponibile nei passaggi successivi
					</ThemedText>
				</View>
			)}
			<View
				className="px-5 py-4 flex-row items-center justify-between"
				style={{ paddingBottom: insets.bottom + 16 }}
			>
				<View>
					<ThemedText className="text-[22px] font-plus-jakarta-bold !text-gray-950">
						{totalPrice.toFixed(2).replace(".", ",")} €
					</ThemedText>
					<ThemedText className={`text-[13px] font-plus-jakarta-medium mt-0.5 ${subtitle === 'Vedi carrello' ? '!text-[#c1152c]' : '!text-gray-900'}`}>
						{subtitle}
					</ThemedText>
				</View>
				<View className="w-auto min-w-[160px]">
					<MainButton
						title={buttonTitle}
						isLoading={isLoading}
						onPress={() => {
							if (onPress) {
								onPress();
							} else {
								router.push({
									pathname: "/complete-trip" as any,
									params: {
										endTime: Date.now() + 10 * 60 * 1000,
										price: basePrice,
									},
								});
							}
						}}
						disabled={disabled}
					/>
				</View>
			</View>
		</View>
	);
}
