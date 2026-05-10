import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable } from "react-native";

interface SearchListItemProps {
	text: string;
	iconName?: string;
	onPress?: () => void;
	className?: string;
	showBorder?: boolean;
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

export function SearchListItem({
	text,
	iconName = "history",
	onPress,
	className = "",
	showBorder = false,
	weight = 400,
}: SearchListItemProps) {
	return (
		<Pressable
			onPress={onPress}
			className={`flex-row items-center py-2.5 px-2 ${
				showBorder ? "border-b border-gray-100" : ""
			} ${className}`}
		>
			<Icon
				name={iconName}
				size={20}
				className="!text-gray-950"
				weight={weight}
				useFont
			/>
			<ThemedText className="ml-3 text-[13px] font-plus-jakarta-medium !text-gray-950">
				{text}
			</ThemedText>
		</Pressable>
	);
}
