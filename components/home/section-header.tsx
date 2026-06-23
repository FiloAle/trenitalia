import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
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
			<ThemedText className="text-md font-google-sans-bold !text-[#262626]">
				{title}
			</ThemedText>
			{actionText && (
				<Pressable className="flex-row items-center" onPress={onActionPress}>
					<ThemedText className="text-md font-google-sans-semibold !text-primary-600">
						{actionText}
					</ThemedText>
					<Icon
						name="chevron_right"
						size={20}
						className="-mr-1 -mb-0.5 !text-primary-600"
					/>
				</Pressable>
			)}
		</View>
	);
}
