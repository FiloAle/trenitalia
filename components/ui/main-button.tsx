import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

interface MainButtonProps {
	title: string;
	onPress: () => void;
	iconName?: string;
	className?: string;
	style?: ViewStyle;
	disabled?: boolean;
}

export const MainButton = ({
	title,
	onPress,
	iconName,
	className = "",
	style,
	disabled = false,
}: MainButtonProps) => {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className={`h-14 w-full overflow-hidden rounded-lg ${className} ${
				disabled ? "opacity-60" : ""
			}`}
			style={[
				style,
			]}
		>
			<LinearGradient
				colors={["#8a052b", "#f73d3d"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={{ flex: 1, width: "100%", height: "100%" }}
			>
				<View className="flex-1 flex-row items-center justify-center px-4">
					<View className="flex-row items-center justify-center">
						{iconName && (
							<Icon
								name={iconName}
								size={18}
								weight={600}
								className="!text-white mr-2"
							/>
						)}
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-white text-center">
							{title}
						</ThemedText>
					</View>
				</View>
			</LinearGradient>
		</Pressable>
	);
};
