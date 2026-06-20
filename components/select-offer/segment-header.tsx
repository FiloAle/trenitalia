import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Image } from "expo-image";
import { ImageSourcePropType, Pressable, View } from "react-native";

export interface SegmentHeaderProps {
	logoSource?: ImageSourcePropType;
	logoRatio?: number;
	normalizedType: string;
	type: string;
	number: string;
	origin: string;
	destination: string;
	formattedDate: string;
	timeStr: string;
	passengerText: string;
	isExpanded?: boolean;
	onToggle?: () => void;
}

export function SegmentHeader({
	logoSource,
	logoRatio = 1,
	normalizedType,
	type,
	number,
	origin,
	destination,
	formattedDate,
	timeStr,
	passengerText,
	isExpanded = true,
	onToggle,
}: SegmentHeaderProps) {
	// Map to readable names
	let readableType = type;
	if (normalizedType.includes("freccia") || normalizedType === "frrossa") {
		readableType = "FRECCIAROSSA";
	} else if (
		normalizedType.includes("intercity") ||
		normalizedType === "icnotte" ||
		normalizedType === "ic"
	) {
		readableType = "InterCity";
	} else if (normalizedType.includes("tper")) {
		readableType = "Trenitalia TPER";
	} else if (
		normalizedType.includes("reg") ||
		normalizedType === "rv" ||
		normalizedType === "re"
	) {
		readableType = "Regionale";
	}

	return (
		<Pressable
			onPress={onToggle}
			className={`px-5 pb-4 ${isExpanded ? "mb-4 border-b border-neutral-100" : ""}`}
		>
			<View className="flex-row items-center justify-between mt-[-2px]">
				<View className="flex-row items-center">
					{logoSource ? (
						<Image
							source={logoSource}
							style={{
								height: 16,
								width: 16 * logoRatio,
								marginTop: -4,
							}}
							contentFit="contain"
						/>
					) : (
						<ThemedText className="text-[14px] font-google-sans-bold !text-primary-600">
							{type}
						</ThemedText>
					)}
					<ThemedText className="ml-2 text-[12px] font-google-sans-bold !text-neutral-900">
						{readableType}
					</ThemedText>
					<ThemedText className="ml-1 text-[12px] font-google-sans-regular !text-neutral-900">
						{number}
					</ThemedText>
					<Icon name="info" size={13} className="ml-1 !text-neutral-500" />
				</View>
				<Icon
					name={isExpanded ? "expand_less" : "expand_more"}
					size={24}
					className="!text-neutral-600"
				/>
			</View>

			<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-950 -mt-0.5 mb-1">
				{origin} - {destination}
			</ThemedText>
			<View className="flex-row items-center flex-wrap">
				<Icon
					name="calendar_today"
					size={14}
					className="mr-1.5 !text-neutral-600"
				/>
				<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-600 mr-1.5">
					{formattedDate}, {timeStr} ·
				</ThemedText>
				<Icon name="person" size={14} className="mr-1 !text-neutral-600" />
				<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-600">
					{passengerText}
				</ThemedText>
			</View>
		</Pressable>
	);
}
