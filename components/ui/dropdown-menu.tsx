import React, { useEffect } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";
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
	maxHeight = 270,
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

	const innerContent = (
		<View
			className="bg-white rounded-2xl border border-gray-200 elevation-3 overflow-hidden"
			style={{ maxHeight }}
		>
			{children}
		</View>
	);

	// On web, Reanimated's Animated.View doesn't fully remove itself from the CSS
	// layout flow even with position: absolute + opacity: 0. Use simple conditional
	// rendering instead (no animation) to avoid pushing content around.
	if (Platform.OS === "web") {
		if (!isVisible) return null;
		return (
			<View
				className={`absolute z-50 rounded-2xl ${className}`}
				style={[
					{
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 8 },
						shadowOpacity: 0.12,
						shadowRadius: 12,
					},
					style,
				]}
			>
				{innerContent}
			</View>
		);
	}

	// On native: keep the smooth animation
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
			className={`absolute z-50 rounded-2xl ${className}`}
		>
			{innerContent}
		</Animated.View>
	);
}
