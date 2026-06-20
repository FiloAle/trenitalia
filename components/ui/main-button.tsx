import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { ActivityIndicator, Pressable, View, ViewStyle } from "react-native";

interface MainButtonProps {
	title: string;
	onPress: () => void;
	iconName?: string;
	className?: string;
	style?: ViewStyle;
	disabled?: boolean;
	isLoading?: boolean;
}

export const MainButton = ({
	title,
	onPress,
	iconName,
	className = "",
	style,
	disabled = false,
	isLoading = false,
}: MainButtonProps) => {
	const isDisabled = disabled || isLoading;
	return (
		<Pressable
			onPress={onPress}
			disabled={isDisabled}
			className={`h-14 w-full flex-row items-center justify-center px-6 rounded-2xl bg-primary-500 ${className} ${
				isDisabled ? "opacity-60" : ""
			}`}
			style={style}
		>
			<View className="flex-row items-center justify-center">
				{isLoading ? (
					<ActivityIndicator color="white" size="small" className="mr-2" />
				) : iconName ? (
					<Icon
						name={iconName}
						size={18}
						weight={600}
						className="!text-white mr-2"
					/>
				) : null}
				<ThemedText className="text-[16px] font-google-sans-bold !text-white text-center">
					{title}
				</ThemedText>
			</View>
		</Pressable>
	);
};
