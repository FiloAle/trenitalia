import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	interpolateColor,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TrenitaliaLogo from "@/assets/images/trenitalia.svg";
import TrenitaliaColorLogo from "@/assets/images/trenitalia_color.svg";
import { ThemedView } from "@/components/themed-view";
import { Icon } from "@/components/ui/icon";
import { useThemeColor } from "@/hooks/use-theme-color";

const HEADER_HEIGHT = 360;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
}: Props) {
	const insets = useSafeAreaInsets();
	const backgroundColor = useThemeColor({}, "background");
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollOffset(scrollRef);

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
						Extrapolation.CLAMP,
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[2, 1, 1],
						Extrapolation.CLAMP,
					),
				},
			],
		};
	});

	const stickyHeaderStyle = useAnimatedStyle(() => {
		const bgColor = interpolateColor(
			scrollOffset.value,
			[HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top],
			["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
		);
		return {
			backgroundColor: bgColor,
			borderBottomWidth: interpolate(
				scrollOffset.value,
				[HEADER_HEIGHT - insets.top - 10, HEADER_HEIGHT - insets.top],
				[0, 1],
				Extrapolation.CLAMP,
			),
			borderBottomColor: "rgba(0, 0, 0, 0.05)",
		};
	});

	const iconColorStyle = useAnimatedStyle(() => {
		const color = interpolateColor(
			scrollOffset.value,
			[HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top],
			["#FFFFFF", "#262626"],
		);
		return {
			color: color,
		};
	});

	const logoWhiteStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				scrollOffset.value,
				[HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top],
				[1, 0],
				Extrapolation.CLAMP,
			),
		};
	});

	const logoColorStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				scrollOffset.value,
				[HEADER_HEIGHT - insets.top - 60, HEADER_HEIGHT - insets.top],
				[0, 1],
				Extrapolation.CLAMP,
			),
		};
	});

	const AnimatedIcon = Animated.createAnimatedComponent(Icon);

	return (
		<View className="flex-1">
			<Animated.View
				style={[
					{
						paddingTop: insets.top,
						height: insets.top + 56,
					},
					stickyHeaderStyle,
				]}
				className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-6"
			>
				<AnimatedIcon name="menu" size={24} style={iconColorStyle} />
				<View className="items-center justify-center">
					<View style={{ width: 100, height: 25 }}>
						<Animated.View style={[StyleSheet.absoluteFill, logoWhiteStyle]}>
							<TrenitaliaLogo width={100} height={25} />
						</Animated.View>
						<Animated.View style={[StyleSheet.absoluteFill, logoColorStyle]}>
							<TrenitaliaColorLogo width={100} height={25} />
						</Animated.View>
					</View>
				</View>
				<AnimatedIcon name="notifications" size={24} style={iconColorStyle} />
			</Animated.View>

			<Animated.ScrollView
				ref={scrollRef}
				className="flex-1"
				style={{ backgroundColor }}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					style={[
						{ height: HEADER_HEIGHT, overflow: "hidden" },
						{ backgroundColor: headerBackgroundColor.light },
						headerAnimatedStyle,
					]}
				>
					{headerImage}
				</Animated.View>
				<ThemedView className="flex-1 gap-4 overflow-hidden px-5 py-8">
					{children}
				</ThemedView>
			</Animated.ScrollView>
		</View>
	);
}
