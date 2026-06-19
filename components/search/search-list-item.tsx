import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "react-native";

interface SearchListItemProps {
	text: string;
	iconName?: string;
	secondaryIconName?: string;
	onPress?: () => void;
	className?: string;
	showBorder?: boolean;
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

export function SearchListItem({
	text,
	iconName = "history",
	secondaryIconName = "",
	onPress,
	className = "",
	showBorder = false,
}: SearchListItemProps) {
	return (
		<Pressable
			onPress={onPress}
			className={`flex-row items-center py-2.5 px-2 ${
				showBorder ? "border-b border-gray-100" : ""
			} ${className}`}
		>
			<Icon name={iconName} size={16} className="!text-gray-950" weight={400} />
			<ThemedText className="ml-2 text-[13px] font-google-sans-medium !text-gray-950">
				{text}
			</ThemedText>
			{secondaryIconName && (
				<Icon
					name={secondaryIconName}
					size={20}
					className="!text-gray-950 ml-auto -my-4"
					weight={300}
				/>
			)}
		</Pressable>
	);
}
