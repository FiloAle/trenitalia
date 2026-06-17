import { type PropsWithChildren, type ReactElement } from "react";
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

import TrenitaliaLogo from "@/assets/logos/trenitalia.svg";
import TrenitaliaColorLogo from "@/assets/logos/trenitalia_color.svg";
import { Icon } from "@/components/ui/icon";
import { useThemeColor } from "@/hooks/use-theme-color";

const HEADER_HEIGHT = 300;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	lightColor?: string;
	darkColor?: string;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	lightColor,
	darkColor,
}: Props) {
	const insets = useSafeAreaInsets();
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background",
	);
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollOffset(scrollRef);
	const topInset = insets.top ?? 0;

	const stickyHeaderStyle = useAnimatedStyle(() => {
		const progress = interpolate(
			scrollOffset.value,
			[HEADER_HEIGHT - topInset - 240, HEADER_HEIGHT - topInset - 180],
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
			[HEADER_HEIGHT - topInset - 240, HEADER_HEIGHT - topInset - 180],
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
			[HEADER_HEIGHT - topInset - 240, HEADER_HEIGHT - topInset - 180],
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
			[HEADER_HEIGHT - topInset - 240, HEADER_HEIGHT - topInset - 180],
			[0, 1],
			Extrapolation.CLAMP,
		);
		return {
			opacity: progress,
		};
	});

	const AnimatedIcon = Animated.createAnimatedComponent(Icon);

	return (
		<View className="flex-1" style={{ backgroundColor }}>
			{/* Sfondo per l'overscroll superiore */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "50%",
					backgroundColor: headerBackgroundColor.light,
				}}
			/>

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
					<View style={{ width: 24 }} />
					<View
						className="absolute left-0 right-0 items-center justify-center pointer-events-none"
						style={{ top: 0, bottom: 0 }}
					>
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
					</View>
				</View>
			</Animated.View>

			<Animated.ScrollView
				ref={scrollRef}
				className="flex-1"
				style={{ backgroundColor: "transparent" }}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={[
						{ height: HEADER_HEIGHT, overflow: "hidden" },
						{ backgroundColor: headerBackgroundColor.light },
					]}
				>
					{headerImage}
				</View>
				<View className="flex-1">{children}</View>
			</Animated.ScrollView>
		</View>
	);
}
