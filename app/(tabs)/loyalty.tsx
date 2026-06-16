import React, { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoyaltyCard } from "@/components/loyalty/loyalty-card";
import { USER_DATA } from "@/constants/user";
import { router } from "expo-router";

const CHIPS = ["Account", "CartaFreccia"];

export default function LoyaltyScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Account");

	return (
		<View className="flex-1 bg-white relative">
			{/* Header Section */}
			<View className="bg-teal-900 pb-6 z-30" style={{ paddingTop: insets.top + 4 }}>
				<View className="h-14 flex-row items-center px-6 mb-2">
					<ThemedText className="text-3xl font-plus-jakarta-bold !text-white">
						Profilo
					</ThemedText>
				</View>

				<View className="flex-row px-5 gap-3">
					{CHIPS.map((chip) => (
						<Pressable
							key={chip}
							onPress={() => setActiveChip(chip)}
							className={`rounded-full px-5 py-2.5 ${
								activeChip === chip ? "bg-[#1f2937]" : "bg-[#ffffff20]"
							}`}
						>
							<ThemedText
								className={`font-plus-jakarta-semibold ${
									activeChip === chip ? "!text-white" : "!text-white"
								}`}
							>
								{chip}
							</ThemedText>
						</Pressable>
					))}
				</View>
			</View>

			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
				{activeChip === "Account" ? (
					<View className="px-5 pt-6 gap-6">
						{/* Dati Personali Sempre in Vista */}
						<Pressable 
							className="bg-white rounded-xl p-5 border border-gray-200 flex-row items-center justify-between active:bg-gray-50"
							onPress={() => router.push("/profile-details")}
						>
							<View>
								<ThemedText className="font-plus-jakarta-bold text-[18px] !text-gray-900">
									{USER_DATA.firstName} {USER_DATA.lastName}
								</ThemedText>
								<ThemedText className="font-plus-jakarta text-[14px] !text-gray-500 mt-1">
									{USER_DATA.email}
								</ThemedText>
							</View>
							<Icon name="chevron_right" size={24} color="#9ca3af" />
						</Pressable>

						<View className="gap-2">
							<MenuItem title="Metodi di pagamento" icon="payment" />
							<MenuItem title="Le mie promozioni" icon="local_offer" />
							<MenuItem title="Account Trenitalia for Business" icon="business_center" />
							<MenuItem title="Assistenza" icon="help_outline" />
							<MenuItem title="Impostazioni" icon="settings" />
						</View>

						<Pressable className="mt-4 border border-red-600 bg-white rounded-lg p-4 flex-row justify-center items-center active:bg-red-50">
							<ThemedText className="font-plus-jakarta-bold !text-red-600 text-center w-full">
								Logout
							</ThemedText>
						</Pressable>
					</View>
				) : (
					<View className="bg-gray-100 flex-1 pt-6">
						<View className="px-5 mb-4">
							<LoyaltyCard
								title="CARTA FRECCIA"
								code={USER_DATA.loyaltyCode}
								bgClass="bg-rose-500"
								borderClass="border-rose-600"
							/>
							<Pressable className="mt-4 flex-row items-center justify-center py-3 bg-gray-900 rounded-lg active:bg-gray-800">
								<Icon name="account_balance_wallet" size={20} color="white" />
								<ThemedText className="ml-2 !text-white font-plus-jakarta-bold">
									Aggiungi a Google Wallet
								</ThemedText>
							</Pressable>
						</View>

						{/* Stats Section: Punti Premio */}
						<View className="px-5 mb-4">
							<View className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
								<View className="flex-row items-center">
									<View className="h-10 w-10 items-center justify-center rounded-full bg-pink-100">
										<Icon name="emoji_events" size={22} className="!text-red-500" />
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
										Richiedi Premio
									</ThemedText>
									<Icon name="chevron_right" size={20} className="!text-gray-400" />
								</View>
							</View>
						</View>

						{/* Salvadanaio */}
						<View className="px-5 mb-4">
							<View className="flex-row items-center p-4 bg-white rounded-lg border border-gray-200">
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
								<Icon name="chevron_right" size={20} className="!text-gray-400" />
							</View>
						</View>
						
						<View className="px-5 bg-white pt-2 border-t border-gray-200">
							<MenuItem title="I vantaggi del partner" icon="handshake" />
							<MenuItem title="Assistenza CartaFreccia" icon="help_outline" />
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

function MenuItem({ title, icon, color = "#1f2937" }: { title: string; icon: string; color?: string }) {
	return (
		<Pressable className="flex-row items-center justify-between py-4 border-b border-gray-100 active:opacity-50">
			<View className="flex-row items-center gap-4">
				<Icon name={icon} size={24} color={color} />
				<ThemedText className="font-plus-jakarta-semibold text-[16px]" style={{ color }}>
					{title}
				</ThemedText>
			</View>
			<Icon name="chevron_right" size={24} color="#9ca3af" />
		</Pressable>
	);
}
