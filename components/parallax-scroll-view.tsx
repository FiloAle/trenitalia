import React, { type PropsWithChildren, type ReactElement } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
import { SideMenu } from "@/components/modals/side-menu";
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
	const [isMenuVisible, setIsMenuVisible] = React.useState(false);
	const backgroundColor = useThemeColor({}, "background");
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollOffset(scrollRef);
	const topInset = insets.top ?? 0;

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const isOverscrolling = scrollOffset.value < 0;

		return {
			transform: [
				{
					translateY: isOverscrolling
						? scrollOffset.value / 2
						: interpolate(
								scrollOffset.value,
								[0, HEADER_HEIGHT],
								[0, HEADER_HEIGHT * 0.75],
								Extrapolation.CLAMP,
							),
				},
				{
					scale: isOverscrolling
						? (HEADER_HEIGHT - scrollOffset.value) / HEADER_HEIGHT
						: 1,
				},
			],
		};
	});

	const stickyHeaderStyle = useAnimatedStyle(() => {
		const progress = interpolate(
			scrollOffset.value,
			[HEADER_HEIGHT - topInset - 60, HEADER_HEIGHT - topInset],
			[0, 1],
			Extrapolation.CLAMP,
		);

		return {
			backgroundColor: interpolateColor(
				progress,
				[0, 1],
				["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
			),
			borderBottomWidth: interpolate(
				progress,
				[0, 1],
				[0, 1],
				Extrapolation.CLAMP,
			),
			borderBottomColor: interpolateColor(
				progress,
				[0, 1],
				["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.05)"],
			),
		};
	});

	const iconColorStyle = useAnimatedStyle(() => {
		const progress = interpolate(
			scrollOffset.value,
			[HEADER_HEIGHT - topInset - 60, HEADER_HEIGHT - topInset],
			[0, 1],
			Extrapolation.CLAMP,
		);

		return {
			color: interpolateColor(progress, [0, 1], ["#FFFFFF", "#262626"]),
		};
	});

	const logoWhiteStyle = useAnimatedStyle(() => {
		const progress = interpolate(
			scrollOffset.value,
			[HEADER_HEIGHT - topInset - 60, HEADER_HEIGHT - topInset],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return {
			opacity: 1 - progress,
		};
	});

	const logoColorStyle = useAnimatedStyle(() => {
		const progress = interpolate(
			scrollOffset.value,
			[HEADER_HEIGHT - topInset - 60, HEADER_HEIGHT - topInset],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return {
			opacity: progress,
		};
	});

	const AnimatedIcon = Animated.createAnimatedComponent(Icon);

	return (
		<View className="flex-1">
			<Animated.View
				style={[
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 10,
						paddingTop: topInset,
						height: topInset + 56,
					},
					stickyHeaderStyle,
				]}
			>
				<View className="flex-1 flex-row items-center justify-between px-6">
					<Pressable onPress={() => setIsMenuVisible(true)}>
						<AnimatedIcon name="menu" size={24} style={iconColorStyle} />
					</Pressable>
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
					<View className="flex-row items-center gap-4">
						<AnimatedIcon
							name="notifications"
							size={24}
							style={iconColorStyle}
						/>
						<AnimatedIcon
							name="account_circle"
							size={24}
							style={iconColorStyle}
						/>
					</View>
				</View>
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
				<ThemedView className="flex-1 gap-4 px-5 py-8 rounded-t-[18px] -mt-4">
					{children}
				</ThemedView>
			</Animated.ScrollView>

			<SideMenu
				isVisible={isMenuVisible}
				onClose={() => setIsMenuVisible(false)}
			/>
		</View>
	);
}
