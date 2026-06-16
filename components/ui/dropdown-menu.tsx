import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

interface DropdownMenuProps {
	isVisible: boolean;
	children: React.ReactNode;
	maxHeight?: number;
	className?: string;
	style?: StyleProp<ViewStyle>;
}

export function DropdownMenu({
	isVisible,
	children,
	maxHeight = 230,
	className = "",
	style,
}: DropdownMenuProps) {
	const animationValue = useSharedValue(0);

	useEffect(() => {
		animationValue.value = withTiming(isVisible ? 1 : 0, {
			duration: 200,
		});
	}, [isVisible]);

	const animatedDropdownStyle = useAnimatedStyle(() => {
		return {
			opacity: animationValue.value,
			transform: [
				{
					translateY: -10 + 10 * animationValue.value,
				},
				{
					scale: 0.95 + 0.05 * animationValue.value,
				},
			],
		};
	});

	return (
		<Animated.View
			style={[
				animatedDropdownStyle,
				{
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 8 },
					shadowOpacity: 0.12,
					shadowRadius: 12,
				},
				style,
			]}
			pointerEvents={isVisible ? "auto" : "none"}
			className={`absolute z-50 rounded-lg ${className}`}
		>
			<View
				className="bg-white rounded-lg border border-gray-200 elevation-3 overflow-hidden"
				style={{ maxHeight }}
			>
				{children}
			</View>
		</Animated.View>
	);
}
