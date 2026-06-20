import { ThemedText } from "@/components/themed-text";
import { MainButton } from "@/components/ui/main-button";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface StickyFooterProps {
	totalPrice?: number;
	basePrice?: number;
	buttonTitle?: string;
	onPress?: () => void;
	hideSeatSelection?: boolean;
	subtitle?: string;
	disabled?: boolean;
	isLoading?: boolean;
	buttonClassName?: string;
	leftContent?: React.ReactNode;
}

export function StickyFooter({
	totalPrice,
	basePrice,
	buttonTitle = "Continua",
	onPress,
	subtitle = "Totale",
	disabled = false,
	isLoading = false,
	buttonClassName = "w-auto min-w-[160px]",
	leftContent,
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
			<View className="px-5 pt-4 pb-12 flex-row items-center justify-between">
				{leftContent ? (
					leftContent
				) : (
					<View>
						<ThemedText
							className={`text-[13px] font-google-sans-medium mb-0.5 ${subtitle === "Totale" ? "!text-neutral-500" : "!text-neutral-900"}`}
						>
							{subtitle}
						</ThemedText>
						<ThemedText className="text-[22px] font-google-sans-bold !text-neutral-950">
							{totalPrice !== undefined ? totalPrice.toFixed(2).replace(".", ",") : "0,00"} €
						</ThemedText>
					</View>
				)}
				<View className={buttonClassName}>
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
