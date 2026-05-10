import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA, getInitials } from "@/constants/user";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LoyaltyMenuProps {
	isVisible: boolean;
	onClose: () => void;
}

const MENU_ITEMS = [
	{ label: "Account", icon: "person_outline" },
	{ label: "Profilo", icon: "crop_free" },
	{ label: "Punti CartaFRECCIA", icon: "star_outline" },
	{ label: "Richiedi Premio", icon: "emoji_events" },
	{ label: "I vantaggi dei partner", icon: "rocket_launch" },
	{ label: "FrecciaFun", icon: "videogame_asset" },
	{ label: "Assistenza CartaFRECCIA", icon: "help_outline" },
	{ label: "Le mie promozioni", icon: "loyalty" },
	{ label: "Assistenza", icon: "headset_mic" },
	{ label: "Logout", icon: "logout", isDestructive: true },
];

export function LoyaltyMenu({ isVisible, onClose }: LoyaltyMenuProps) {
	const insets = useSafeAreaInsets();
	const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scrollY = useRef(new Animated.Value(0)).current;
	const useNativeDriver = Platform.OS !== "web";

	useEffect(() => {
		if (isVisible) {
			Animated.parallel([
				Animated.timing(slideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver,
				}),
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver,
				}),
			]).start();
		} else {
			slideAnim.setValue(SCREEN_WIDTH);
			fadeAnim.setValue(0);
		}
	}, [isVisible]);

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: SCREEN_WIDTH,
				duration: 250,
				useNativeDriver,
			}),
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 250,
				useNativeDriver,
			}),
		]).start(() => {
			onClose();
		});
	};

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

	return (
		<Modal
			visible={isVisible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
		>
			<View className="flex-1">
				{/* Background Overlay */}
				<TouchableWithoutFeedback onPress={handleClose}>
					<Animated.View
						style={[
							StyleSheet.absoluteFill,
							{
								backgroundColor: "rgba(0,0,0,0.5)",
								opacity: fadeAnim,
							},
						]}
					/>
				</TouchableWithoutFeedback>

				<Animated.View
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						width: "100%",
						height: "100%",
						transform: [{ translateX: slideAnim }],
						zIndex: 10,
						backgroundColor: "white",
						flex: 1,
					}}
				>
					<View
						style={{
							flex: 1,
							paddingTop: insets.top,
							backgroundColor: "#f3f4f6",
						}}
					>
						{/* Header */}
						<View className="h-14 flex-row items-center justify-between px-4 bg-[#f3f4f6]">
							<Pressable onPress={handleClose} className="p-1">
								<Icon
									name="arrow_back"
									size={26}
									className="!text-gray-900"
									weight={300}
								/>
							</Pressable>
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
								backgroundColor: "#f3f4f6",
								flexDirection: "row",
								alignItems: "center",
								paddingHorizontal: 20,
								zIndex: 20,
								opacity: headerOpacity,
								borderBottomWidth: 1,
								borderBottomColor: "#e5e7eb",
							}}
						>
							<View className="h-20 w-32 rounded-md bg-rose-600" />
							<View className="ml-4 flex-col gap-1">
								<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-700">
									Numero CartaFRECCIA
								</ThemedText>
								<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
									123456789
								</ThemedText>
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
								style={{
									position: "absolute",
									top: -1000,
									left: 0,
									right: 0,
									height: 1000,
									backgroundColor: "#f3f4f6",
								}}
							/>

							<View className="bg-[#f3f4f6] pb-6">
								{/* Card Section */}
								<View className="p-5 items-center">
									<Animated.View
										className="w-full h-[200px] bg-rose-600 rounded-xl p-5 justify-end shadow-lg"
										style={{
											transform: [{ scale: cardScale }],
										}}
									>
										{/* Placeholder for Card Content */}
										<ThemedText className="!text-white text-[12px] font-plus-jakarta-medium opacity-80 mb-1">
											CARTA FRECCIA
										</ThemedText>
										<ThemedText className="!text-white text-[20px] font-plus-jakarta-bold">
											123456789
										</ThemedText>
									</Animated.View>

									{/* Page Indicator */}
									<View className="flex-row mt-4 gap-2">
										<View className="h-1.5 w-4 rounded-full bg-teal-900" />
										<View className="h-1.5 w-1.5 rounded-full bg-gray-300" />
									</View>
								</View>

								{/* Stats Section: Punti Premio */}
								<View className="px-5">
									<View className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
										<View className="flex-row items-center">
											<View className="h-10 w-10 items-center justify-center rounded-full bg-pink-100">
												<Icon
													name="emoji_events"
													size={22}
													className="!text-red-500"
												/>
											</View>
											<View className="ml-4">
												<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
													Punti premio
												</ThemedText>
												<ThemedText className="text-[18px] font-plus-jakarta-bold !text-gray-950">
													71,68 pt
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
								<View className="px-5 py-6">
									<View className="flex-row items-center p-4 bg-white rounded-lg border border-gray-200">
										<View className="h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
											<Icon
												name="savings"
												size={22}
												className="!text-cyan-600"
											/>
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
									{MENU_ITEMS.map((item) => (
										<Pressable
											key={item.label}
											className="flex-row items-center px-5 py-3.5 border-b border-gray-50"
										>
											<Icon
												name={item.icon}
												size={28}
												weight={300}
												className={
													item.isDestructive
														? "!text-red-500"
														: "!text-gray-700"
												}
											/>
											<ThemedText
												className={`ml-4 flex-1 text-[15px] font-plus-jakarta-medium ${
													item.isDestructive
														? "!text-red-500"
														: "!text-gray-800"
												}`}
											>
												{item.label}
											</ThemedText>
											<Icon
												name="chevron_right"
												size={28}
												weight={200}
												className={
													item.isDestructive
														? "!text-red-500"
														: "!text-gray-400"
												}
											/>
										</Pressable>
									))}
								</View>
							</View>
						</Animated.ScrollView>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}
