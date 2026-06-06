import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Image, ImageSourcePropType, Pressable, View } from "react-native";

export interface SegmentHeaderProps {
	logoSource?: ImageSourcePropType;
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
	const isFrecciarossa =
		normalizedType.includes("frecciarossa") || normalizedType === "frrossa";

	return (
		<Pressable 
			onPress={onToggle} 
			className={`px-5 pb-4 ${isExpanded ? "mb-4 border-b border-gray-100" : ""}`}
		>
			<View className="flex-row items-center justify-between -mt-0.5">
				<View className="flex-row items-center">
					{logoSource ? (
						<Image
							source={logoSource}
							style={{
								height: 14,
								width: isFrecciarossa ? 75 : 55,
							}}
							resizeMode="contain"
						/>
					) : (
						<ThemedText className="text-[14px] font-plus-jakarta-bold !text-[#004a4d]">
							{type}
						</ThemedText>
					)}
					<ThemedText className="ml-2 text-[12px] font-plus-jakarta-semibold !text-gray-900">
						{number}
					</ThemedText>
					<Icon name="info" size={13} className="ml-1 !text-gray-500" />
				</View>
				<Icon name={isExpanded ? "expand_less" : "expand_more"} size={24} className="!text-gray-600" />
			</View>

			<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-950 -mt-0.5 mb-1">
				{origin} - {destination}
			</ThemedText>
			<View className="flex-row items-center flex-wrap">
				<Icon name="calendar_today" size={14} className="mr-1.5 !text-gray-600" />
				<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-600 mr-1.5">
					{formattedDate}, {timeStr} ·
				</ThemedText>
				<Icon name="person" size={14} className="mr-1 !text-gray-600" />
				<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-600">
					{passengerText}
				</ThemedText>
			</View>
		</Pressable>
	);
}
