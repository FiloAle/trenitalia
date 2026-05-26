import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { StationBoardTrainRow } from "@/components/station-board/station-board-train-row";
import { PARTENZE_TRAINS, ARRIVI_TRAINS } from "@/constants/station-board-mock";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StationBoardScreen() {
	const insets = useSafeAreaInsets();
	const [activeTab, setActiveTab] = useState("Partenze");

	const displayTrains = activeTab === "Partenze" ? PARTENZE_TRAINS : ARRIVI_TRAINS;

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View className="flex-row items-center justify-between px-5 pt-1 pb-2 bg-white" style={{ paddingTop: insets.top + 16 }}>
				<View className="w-10" />
				<ThemedText className="flex-1 text-center text-[15px] font-plus-jakarta-bold !text-gray-950">
					Bologna Centrale
				</ThemedText>
				<Pressable onPress={() => router.back()} className="p-2 -mr-2">
					<Icon name="close" size={28} className="!text-gray-800" weight={300} />
				</Pressable>
			</View>

			{/* Tabs */}
			<View className="px-5 mb-4 mt-2">
				<View className="flex-row rounded-full bg-[#f3f4f6] p-1">
					<Pressable 
						className={`flex-1 rounded-full items-center py-2 ${activeTab === 'Partenze' ? 'bg-white shadow-sm' : ''}`}
						onPress={() => setActiveTab('Partenze')}
					>
						<ThemedText className={`text-[15px] ${activeTab === 'Partenze' ? 'font-plus-jakarta-bold !text-gray-950' : 'font-plus-jakarta-medium !text-gray-600'}`}>
							Partenze
						</ThemedText>
					</Pressable>
					<Pressable 
						className={`flex-1 rounded-full items-center py-2 ${activeTab === 'Arrivi' ? 'bg-white shadow-sm' : ''}`}
						onPress={() => setActiveTab('Arrivi')}
					>
						<ThemedText className={`text-[15px] ${activeTab === 'Arrivi' ? 'font-plus-jakarta-bold !text-gray-950' : 'font-plus-jakarta-medium !text-gray-600'}`}>
							Arrivi
						</ThemedText>
					</Pressable>
				</View>
			</View>

			{/* Banner */}
			<View className="px-5 mb-4">
				<View className="bg-[#eef2ff] rounded-lg p-3">
					<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
						Aggiornato al 25/04/2026 - 12:26:07
					</ThemedText>
				</View>
			</View>

			{/* Table Headers */}
			<View className="flex-row px-5 py-2 bg-gray-50 mb-2">
				<View className="w-[15%]">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">Orario</ThemedText>
				</View>
				<View className="w-[45%] pl-2">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">Destinazione</ThemedText>
				</View>
				<View className="w-[20%]">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">Stato</ThemedText>
				</View>
				<View className="w-[20%]">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">Binario</ThemedText>
				</View>
			</View>

			<ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
				{displayTrains.map((train, index) => (
					<StationBoardTrainRow key={index} train={train} />
				))}
			</ScrollView>
		</View>
	);
}
