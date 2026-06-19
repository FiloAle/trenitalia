import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable, View } from "react-native";

export interface SelectionCardProps {
	isSelected: boolean;
	onPress: () => void;
	title: string;
	price: number;
	badge?: string;
	showInfo?: boolean;
	variant: "class" | "offer";
}

export function SelectionCard({
	isSelected,
	onPress,
	title,
	price,
	badge,
	showInfo,
	variant,
}: SelectionCardProps) {
	const isClass = variant === "class";
	const priceStr = price > 0 ? `${price.toFixed(2).replace(".", ",")} €` : "--";

	return (
		<Pressable
			onPress={onPress}
			className={`rounded-2xl border p-4 flex-col justify-between ${
				isClass ? "w-60 h-20" : "w-56 h-32"
			} ${
				isSelected
					? "border-primary-600 bg-primary-100/30"
					: "border-gray-200 bg-white"
			}`}
		>
			{isClass ? (
				<>
					<View className="flex-row justify-between items-start mb-2">
						<ThemedText
							className="text-[14px] font-google-sans-semibold !text-gray-950 flex-1"
							numberOfLines={1}
						>
							{title}
						</ThemedText>
						{showInfo && (
							<Icon name="info" size={18} className="!text-gray-600 ml-2" />
						)}
					</View>
					<ThemedText className="text-[11px] font-google-sans-semibold !text-gray-600 -mt-1">
						da {priceStr}
					</ThemedText>
				</>
			) : (
				<>
					<View>
						<ThemedText
							className="text-[13px] font-google-sans-semibold uppercase !text-gray-950 mb-1"
							numberOfLines={1}
						>
							{title}
						</ThemedText>
						<ThemedText className="text-[17px] font-google-sans-bold !text-gray-950">
							{priceStr}
						</ThemedText>
					</View>
					<View className="flex-row justify-between items-end">
						{badge ? (
							<View className="bg-primary-600/10 px-2 py-1 rounded">
								<ThemedText className="text-[13px] font-google-sans-semibold !text-primary-600">
									{badge}
								</ThemedText>
							</View>
						) : (
							<View />
						)}
						{showInfo && (
							<Icon name="info" size={18} className="!text-gray-600" />
						)}
					</View>
				</>
			)}
		</Pressable>
	);
}
