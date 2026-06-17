import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

interface SectionHeaderProps {
	title: string;
	actionText?: string;
	onActionPress?: () => void;
}

export function SectionHeader({
	title,
	actionText,
	onActionPress,
}: SectionHeaderProps) {
	return (
		<View className="flex-row items-center justify-between">
			<ThemedText className="text-md font-plus-jakarta-bold !text-[#262626]">
				{title}
			</ThemedText>
			{actionText && (
				<Pressable className="flex-row items-center" onPress={onActionPress}>
					<ThemedText className="text-md font-plus-jakarta-semibold !text-teal-800">
						{actionText}
					</ThemedText>
					<Icon
						name="chevron_right"
						size={20}
						className="-mr-1 -mb-0.5 !text-teal-800"
					/>
				</Pressable>
			)}
		</View>
	);
}
