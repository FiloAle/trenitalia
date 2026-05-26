import TrenitaliaLogo from "@/assets/logos/trenitalia_color.svg";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchModal } from "@/components/modals/search-modal";

import { USER_DATA, getInitials } from "@/constants/user";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MENU_DATA = [
	{
		id: "RICERCA E ACQUISTO",
		items: [
			{ label: "Biglietti", icon: "confirmation_number", action: "open_search" },
			{ label: "Abbonamenti", icon: "credit_card" },
			{ label: "Carnet", icon: "view_day" },
			{ label: "Promo e Servizi", icon: "local_mall" },
			{ label: "Carte regalo", icon: "card_giftcard" },
			{ label: "Acquisto rapido", icon: "bolt", route: "/purchase" },
			{ label: "Completa il tuo viaggio", icon: "add_circle" },
		],
	},
	{
		id: "IN VIAGGIO",
		items: [
			{ label: "Infomobilità", icon: "train", route: "/info" },
			{ label: "In caso di sciopero", icon: "campaign" },
			{ label: "Notizie in tempo reale", icon: "feed" },
			{ label: "Tabellone partenze/arrivi", icon: "view_list", route: "/station-board" },
			{ label: "FrecciaPlay", icon: "play_circle" },
		],
	},
	{
		id: "LE MIE INFORMAZIONI",
		items: [
			{ label: "I miei viaggi", icon: "confirmation_number", route: "/trips" },
			{ label: "Recupera biglietto", icon: "search" },
			{ label: "CartaFreccia", icon: "credit_card", action: "open_loyalty" },
			{ label: "X-GO", icon: "credit_card" },
			{ label: "Le mie promo", icon: "loyalty" },
			{ label: "Richiedi premio CartaFreccia", icon: "emoji_events" },
			{ label: "Salvanaio Elettronico", icon: "savings" },
		],
	},
	{
		id: "INFO E ASSISTENZA",
		items: [
			{ label: "Assistenza", icon: "headset_mic" },
			{ label: "Assistenza CartaFreccia", icon: "help" },
			{ label: "Assistenza X-GO", icon: "help" },
			{ label: "Su quest'app", icon: "smartphone" },
		],
	},
];

interface SubMenuItemProps {
	label: string;
	icon: string;
	onItemPress?: () => void;
}

function SubMenuItem({ label, icon, onItemPress }: SubMenuItemProps) {
	return (
		<Pressable 
			onPress={onItemPress}
			className="flex-row items-center border-b border-gray-100/50 py-3 ps-2 pe-4"
		>
			<Icon name={icon} size={28} className="!text-gray-700" weight={300} />
			<ThemedText className="ml-4 flex-1 text-[14px] font-plus-jakarta-medium !text-gray-700">
				{label}
			</ThemedText>
			<Icon
				name="chevron_right"
				size={28}
				weight={200}
				className="!text-gray-400"
			/>
		</Pressable>
	);
}

interface MenuItemProps {
	label: string;
	isOpen?: boolean;
	onToggle?: () => void;
	children?: React.ReactNode;
}

function MenuItem({ label, isOpen, onToggle, children }: MenuItemProps) {
	return (
		<View className="border-b border-gray-100">
			<Pressable
				onPress={onToggle}
				className="flex-row items-center justify-between py-1 bg-gray-100 ps-5 pe-4"
			>
				<ThemedText className="text-[13px] font-plus-jakarta-bold uppercase tracking-wider !text-slate-600">
					{label}
				</ThemedText>
				<Icon
					name={isOpen ? "expand_less" : "expand_more"}
					size={28}
					weight={200}
					className="!text-gray-700"
				/>
			</Pressable>
			{isOpen && <View className="pl-2">{children}</View>}
		</View>
	);
}

interface SideMenuProps {
	isVisible: boolean;
	onClose: () => void;
	onProfilePress?: () => void;
}

export function SideMenu({ isVisible, onClose, onProfilePress }: SideMenuProps) {
	const insets = useSafeAreaInsets();
	const [openSection, setOpenSection] = React.useState<string | null>(
		"RICERCA E ACQUISTO",
	);
	const [isSearchModalVisible, setIsSearchModalVisible] = React.useState(false);
	const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
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
			slideAnim.setValue(-SCREEN_WIDTH);
			fadeAnim.setValue(0);
		}
	}, [isVisible]);

	const handleClose = (callback?: () => void) => {
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: -SCREEN_WIDTH,
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
			if (callback) callback();
		});
	};

	if (!isVisible) return null;

	return (
		<View style={[StyleSheet.absoluteFill, { zIndex: 900 }]}>
			<View className="flex-1">
				{/* Background Overlay */}
				<TouchableWithoutFeedback onPress={() => handleClose()}>
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
						left: 0,
						width: "100%",
						height: "100%",
						transform: [{ translateX: slideAnim }],
						zIndex: 10,
						backgroundColor: "white",
						flex: 1,
					}}
				>
					<View style={{ flex: 1, paddingTop: insets.top }}>
						{/* Header */}
						<View className="h-14 flex-row items-center justify-between px-5">
							<TrenitaliaLogo width={100} height={25} />
							<View className="flex-row items-center gap-5">
								<Icon
									name="share"
									size={16}
									className="!text-gray-900"
									weight={400}
								/>
								<Pressable onPress={() => handleClose()}>
									<Icon
										name="close"
										size={26}
										className="!text-gray-900"
										weight={300}
									/>
								</Pressable>
							</View>
						</View>

						<ScrollView
							className="flex-1"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
						>
							{/* User Profile */}
							<Pressable
								onPress={onProfilePress}
								className="flex-row items-center border-b border-gray-100 ps-5 pe-4 py-4"
							>
								<View className="h-10 w-10 items-center justify-center rounded-full bg-teal-900">
									<ThemedText className="text-sm font-plus-jakarta-bold !text-white">
										{getInitials(USER_DATA.firstName, USER_DATA.lastName)}
									</ThemedText>
								</View>
								<View className="ml-4 flex-1">
									<ThemedText className="text-[13px] font-plus-jakarta-bold uppercase !text-gray-950">
										{USER_DATA.firstName} {USER_DATA.lastName}
									</ThemedText>
									<ThemedText className="text-[13px] font-plus-jakarta-medium uppercase !text-gray-500">
										{USER_DATA.email}
									</ThemedText>
								</View>
								<Icon
									name="chevron_right"
									size={28}
									weight={200}
									className="!text-gray-400"
								/>
							</Pressable>

							{/* Menu Items */}
							<View>
								{MENU_DATA.map((section) => (
									<MenuItem
										key={section.id}
										label={section.id}
										isOpen={openSection === section.id}
										onToggle={() =>
											setOpenSection(
												openSection === section.id ? null : section.id,
											)
										}
									>
										{section.items.map((item) => (
											<SubMenuItem
												key={item.label}
												label={item.label}
												icon={item.icon}
												onItemPress={() => {
													if (item.action === "open_loyalty") {
														handleClose(() => {
															if (onProfilePress) onProfilePress();
														});
													} else if (item.action === "open_search") {
														setIsSearchModalVisible(true);
													} else if (item.route) {
														handleClose(() => router.navigate(item.route as any));
													}
												}}
											/>
										))}
									</MenuItem>
								))}
								<Pressable className="border-b border-gray-100 py-3 px-5 bg-gray-100">
									<ThemedText className="text-[13px] font-plus-jakarta-bold uppercase tracking-wider !text-slate-600">
										Accesso
									</ThemedText>
								</Pressable>
							</View>

							{/* Footer Links */}
							<View className="gap-8 p-5">
								<Pressable>
									<ThemedText className="text-[15px] font-plus-jakarta-medium !text-teal-900">
										Account Trenitalia for Business
									</ThemedText>
								</Pressable>
								<Pressable>
									<ThemedText className="text-[15px] font-plus-jakarta-medium !text-red-500">
										Logout
									</ThemedText>
								</Pressable>
								<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500">
									Versione App 13.200.4.647
								</ThemedText>
							</View>
						</ScrollView>
					</View>
				</Animated.View>
			</View>

			<SearchModal 
				isVisible={isSearchModalVisible}
				onClose={() => setIsSearchModalVisible(false)}
			/>
		</View>
	);
}
