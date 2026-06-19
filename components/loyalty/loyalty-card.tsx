import { ThemedText } from "@/components/themed-text";
import { Animated, Dimensions, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LoyaltyCardProps {
	title: string;
	code: string;
	bgClass: string;
	borderClass: string;
	animatedStyle: any;
	isLast?: boolean;
}

export function LoyaltyCard({
	title,
	code,
	bgClass,
	borderClass,
	animatedStyle,
	isLast = false,
}: LoyaltyCardProps) {
	return (
		<View
			style={{ width: SCREEN_WIDTH - 40 }}
			className={`${isLast ? "" : "mr-5"} py-2`}
		>
			<Animated.View
				className={`w-full h-[200px] rounded-2xl p-5 justify-end border-2 ${bgClass} ${borderClass}`}
				style={[animatedStyle]}
			>
				<ThemedText className="!text-white text-[12px] font-google-sans-medium opacity-80 mb-1">
					{title}
				</ThemedText>
				<ThemedText className="!text-white text-[20px] font-google-sans-bold">
					{code}
				</ThemedText>
			</Animated.View>
		</View>
	);
}
