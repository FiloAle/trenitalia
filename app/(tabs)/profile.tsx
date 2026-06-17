import { LoyaltyCard } from "@/components/loyalty/loyalty-card";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA, getInitials } from "@/constants/user";
import { useRef, useState } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const POINTS_FRECCIA = "71,68 pt";
const POINTS_XGO = "42,50 pt";

const MENU_ITEMS = [
	{ label: "Account", icon: "person_outline" },
	{ label: "Profilo", icon: "frame_person" },
	{ label: "Punti CartaFRECCIA", icon: "star_outline" },
	{ label: "Richiedi Premio", icon: "emoji_events" },
	{ label: "I vantaggi dei partner", icon: "rocket_launch" },
	{ label: "FrecciaFun", icon: "stadia_controller" },
	{ label: "Assistenza CartaFRECCIA", icon: "help_outline" },
	{ label: "Le mie promozioni", icon: "percent_discount" },
	{ label: "Assistenza", icon: "headset_mic" },
	{ label: "Logout", icon: "logout", isDestructive: true },
];

export default function LoyaltyScreen() {
	const insets = useSafeAreaInsets();
	const scrollY = useRef(new Animated.Value(0)).current;
	const cardScrollX = useRef(new Animated.Value(0)).current;
	const [activeCardIndex, setActiveCardIndex] = useState(0);

	// Sticky Header Interlopation
	const headerOpacity = scrollY.interpolate({
		inputRange: [150, 200],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const cardScale = scrollY.interpolate({
		inputRange: [-100, 0, 150],
		outputRange: [1.1, 1, 0.8],
		extrapolate: "clamp",
	});

	// Horizontal Scaling for Carousel
	const card1ScaleH = cardScrollX.interpolate({
		inputRange: [0, SCREEN_WIDTH],
		outputRange: [1, 0.8],
		extrapolate: "clamp",
	});

	const card2ScaleH = cardScrollX.interpolate({
		inputRange: [0, SCREEN_WIDTH],
		outputRange: [0.8, 1],
		extrapolate: "clamp",
	});

	return (
		<View className="flex-1 bg-white">
			<View
				className={`flex-1 transition-colors duration-500 ${
					activeCardIndex === 1 ? "bg-emerald-50" : "bg-gray-100"
				}`}
				style={{
					paddingTop: insets.top,
				}}
			>
				{/* Header */}
				<View
					className={`h-14 flex-row items-center justify-between px-4 transition-colors duration-500 ${
						activeCardIndex === 1 ? "bg-emerald-50" : "bg-gray-100"
					}`}
				>
					<View className="p-1 w-8" />
					<ThemedText className="text-[16px] font-plus-jakarta-bold uppercase !text-gray-950">
						{USER_DATA.firstName} {USER_DATA.lastName}
					</ThemedText>
					<View className="h-8 w-8 items-center justify-center rounded-full bg-teal-900">
						<ThemedText className="text-[11px] font-plus-jakarta-bold !text-white">
							{getInitials(USER_DATA.firstName, USER_DATA.lastName)}
						</ThemedText>
					</View>
				</View>

				{/* Sticky Header Panel (Small Card Number) */}
				<Animated.View
					style={{
						position: "absolute",
						top: insets.top + 48,
						left: 0,
						right: 0,
						height: 96,
						opacity: headerOpacity,
						zIndex: 20,
					}}
				>
					<View
						className={`flex-1 flex-row items-center px-5 transition-colors duration-500 border-b border-gray-200 ${
							activeCardIndex === 1 ? "bg-emerald-50" : "bg-gray-100"
						}`}
					>
						<View
							className={`h-14 w-24 rounded-md border ${
								activeCardIndex === 1
									? "bg-emerald-500 border-emerald-600"
									: "bg-rose-500 border-rose-600"
							}`}
						/>
						<View className="ml-4 flex-1">
							<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-700">
								Numero {activeCardIndex === 1 ? "X-GO" : "CartaFRECCIA"}
							</ThemedText>
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
								{USER_DATA.loyaltyCode}
							</ThemedText>
						</View>
					</View>
				</Animated.View>

				<Animated.ScrollView
					className="flex-1 bg-white"
					showsVerticalScrollIndicator={false}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: scrollY } } }],
						{ useNativeDriver: false },
					)}
					scrollEventThrottle={16}
				>
					{/* Top Overscroll Background Filler */}
					<View
						className={`transition-colors duration-500 ${
							activeCardIndex === 1 ? "bg-emerald-50" : "bg-gray-100"
						}`}
						style={{
							position: "absolute",
							top: -1000,
							left: 0,
							right: 0,
							height: 1000,
						}}
					/>

					<View
						className={`pb-6 transition-colors duration-500 ${
							activeCardIndex === 1 ? "bg-emerald-50" : "bg-gray-100"
						}`}
					>
						{/* Card Section: Carousel */}
						<View className="items-center">
							<Animated.ScrollView
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								onScroll={Animated.event(
									[{ nativeEvent: { contentOffset: { x: cardScrollX } } }],
									{
										useNativeDriver: false,
										listener: (event: any) => {
											const offsetX = event.nativeEvent.contentOffset.x;
											const index = Math.round(offsetX / (SCREEN_WIDTH - 20));
											if (index !== activeCardIndex) {
												setActiveCardIndex(index);
											}
										},
									},
								)}
								scrollEventThrottle={16}
								className="w-full"
								contentContainerStyle={{
									paddingHorizontal: 20,
								}}
							>
								{/* Carta FRECCIA */}
								<LoyaltyCard
									title="CARTA FRECCIA"
									code={USER_DATA.loyaltyCode}
									bgClass="bg-rose-500"
									borderClass="border-rose-600"
									animatedStyle={{
										transform: [{ scale: cardScale }, { scale: card1ScaleH }],
									}}
								/>

								{/* Carta X-GO */}
								<LoyaltyCard
									title="CARTA X-GO"
									code={USER_DATA.loyaltyCode}
									bgClass="bg-emerald-500"
									borderClass="border-emerald-600"
									isLast
									animatedStyle={{
										transform: [{ scale: cardScale }, { scale: card2ScaleH }],
									}}
								/>
							</Animated.ScrollView>

							{/* Page Indicator */}
							<View className="flex-row mt-0 gap-2 mb-4">
								{[0, 1].map((index) => {
									const indicatorWidth = cardScrollX.interpolate({
										inputRange: [
											(index - 1) * (SCREEN_WIDTH - 20),
											index * (SCREEN_WIDTH - 20),
											(index + 1) * (SCREEN_WIDTH - 20),
										],
										outputRange: [6, 16, 6],
										extrapolate: "clamp",
									});

									const indicatorOpacity = cardScrollX.interpolate({
										inputRange: [
											(index - 1) * (SCREEN_WIDTH - 20),
											index * (SCREEN_WIDTH - 20),
											(index + 1) * (SCREEN_WIDTH - 20),
										],
										outputRange: [0.3, 1, 0.3],
										extrapolate: "clamp",
									});

									return (
										<Animated.View
											key={index}
											style={{
												height: 6,
												width: indicatorWidth,
												opacity: indicatorOpacity,
												borderRadius: 3,
												backgroundColor: "#134e4a", // teal-900
											}}
										/>
									);
								})}
							</View>
						</View>

						{/* Stats Section: Punti Premio */}
						<View className="px-5">
							<View className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
								<View className="flex-row items-center">
									<View
										className={`h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
											activeCardIndex === 1 ? "bg-emerald-100" : "bg-pink-100"
										}`}
									>
										<Icon
											name="emoji_events"
											size={22}
											className={`transition-colors duration-300 ${
												activeCardIndex === 1
													? "!text-emerald-600"
													: "!text-red-500"
											}`}
										/>
									</View>
									<View className="ml-4">
										<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
											Punti premio
										</ThemedText>
										<ThemedText className="text-[18px] font-plus-jakarta-bold !text-gray-950">
											{activeCardIndex === 1 ? POINTS_XGO : POINTS_FRECCIA}
										</ThemedText>
									</View>
								</View>
								<View className="flex-row items-center">
									<ThemedText className="text-[14px] font-plus-jakarta-medium !text-gray-700">
										Mostra di più
									</ThemedText>
									<Icon
										name="expand_more"
										size={20}
										className="!text-gray-700"
									/>
								</View>
							</View>
						</View>
					</View>

					{/* White Background Section: Salvadanaio and Menu */}
					<View
						className="bg-white"
						style={{ paddingBottom: insets.bottom + 20 }}
					>
						<View className="px-5 py-4">
							<View className="flex-row items-center p-4 bg-white rounded-2xl border border-gray-200">
								<View className="h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
									<Icon name="savings" size={22} className="!text-cyan-600" />
								</View>
								<View className="ml-4 flex-1">
									<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
										Salvadanaio
									</ThemedText>
									<ThemedText className="text-[15px] font-plus-jakarta-bold !text-cyan-800">
										Ricarica
									</ThemedText>
								</View>
							</View>
						</View>
						{/* Menu Items */}
						<View>
							{MENU_ITEMS.filter((item) => {
								if (activeCardIndex === 1) {
									return (
										item.label !== "Richiedi Premio" &&
										item.label !== "FrecciaFun"
									);
								}
								return true;
							}).map((item) => {
								let displayLabel = item.label;
								if (activeCardIndex === 1) {
									displayLabel = displayLabel.replace("CartaFRECCIA", "X-GO");
								}

								return (
									<Pressable
										key={item.label}
										className="flex-row items-center px-5 py-3.5 border-b border-gray-50"
									>
										<Icon
											name={item.icon}
											size={28}
											weight={300}
											className={
												item.isDestructive ? "!text-red-500" : "!text-gray-700"
											}
										/>
										<ThemedText
											className={`ml-4 flex-1 text-[15px] font-plus-jakarta-medium ${
												item.isDestructive ? "!text-red-500" : "!text-gray-800"
											}`}
										>
											{displayLabel}
										</ThemedText>
										<Icon
											name="chevron_right"
											size={28}
											weight={200}
											className={
												item.isDestructive ? "!text-red-500" : "!text-gray-400"
											}
										/>
									</Pressable>
								);
							})}
						</View>
					</View>
				</Animated.ScrollView>
			</View>
		</View>
	);
}
