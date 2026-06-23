import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

export interface TabSelectorProps {
	tabs: string[];
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const AnimatedTabLabel = ({
	chip,
	isActive,
}: {
	chip: string;
	isActive: boolean;
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			color: withTiming(isActive ? "#ffffff" : "#006666", { duration: 250 }),
		};
	}, [isActive]);

	return (
		<Animated.Text
			className="text-[14px] font-google-sans-semibold"
			style={animatedStyle}
		>
			{chip}
		</Animated.Text>
	);
};

export function TabSelector({
	tabs,
	activeTab,
	onTabChange,
}: TabSelectorProps) {
	const [tabWidth, setTabWidth] = useState(0);

	const activeTabIndex = tabs.indexOf(activeTab);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(activeTabIndex * (tabWidth / tabs.length), {
						duration: 250,
					}),
				},
			],
		};
	}, [activeTabIndex, tabWidth, tabs.length]);

	if (Platform.OS === "web") {
		return (
			<View className="bg-primary-500/10 rounded-xl p-1 flex-row relative w-full">
				<View
					className="absolute top-1 bottom-1 bg-primary-500 rounded-lg transition-all duration-300"
					style={{
						left: `calc(4px + ${activeTabIndex} * ((100% - 8px) / ${tabs.length}))` as any,
						width: `calc((100% - 8px) / ${tabs.length})` as any,
					}}
				/>
				{tabs.map((tab) => {
					const isActive = activeTab === tab;
					return (
						<Pressable
							key={tab}
							onPress={() => onTabChange(tab)}
							className="flex-1 items-center justify-center py-2.5 z-10 cursor-pointer"
							style={{ flexBasis: "0%" }}
						>
							<Text
								className={`text-[14px] font-google-sans-semibold transition-colors duration-300 ${
									isActive ? "text-white" : "text-[#006666]"
								}`}
							>
								{tab}
							</Text>
						</Pressable>
					);
				})}
			</View>
		);
	}

	return (
		<View
			className="bg-primary-500/10 rounded-xl p-1 flex-row relative w-full"
			onLayout={(e) => setTabWidth(e.nativeEvent.layout.width - 8)}
		>
			{tabWidth > 0 && (
				<Animated.View
					className="absolute top-1 bottom-1 bg-primary-500 rounded-lg"
					style={[{ left: 4, width: tabWidth / tabs.length }, animatedStyle]}
				/>
			)}
			{tabs.map((tab) => (
				<Pressable
					key={tab}
					onPress={() => onTabChange(tab)}
					className="flex-1 items-center justify-center py-2.5 z-10"
				>
					<AnimatedTabLabel chip={tab} isActive={activeTab === tab} />
				</Pressable>
			))}
		</View>
	);
}
