import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StationBoardScreen() {
	const insets = useSafeAreaInsets();
	const [activeTab, setActiveTab] = useState("Partenze");

	const partenzeTrains = [
		{
			time: "12:07",
			destination: "Reggio Di Calabria...",
			trainName: "FR 9623",
			status: "In orario",
			bin: "18 AV",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:10",
			destination: "Brennero Brenner",
			trainName: "REG 3850",
			status: "Partito con\n+1 MIN",
			bin: "8",
			binType: "Effettivo",
			hasMenu: true,
		},
		{
			time: "12:10",
			destination: "Venezia S. Lucia",
			trainName: "REG 3974",
			status: "Partito con\n+1 MIN",
			bin: "10",
			binType: "Effettivo",
			hasMenu: true,
		},
		{
			time: "12:12",
			destination: "Rimini",
			trainName: "REG 2499",
			status: "Partito con\n+3 MIN",
			bin: "4",
			binType: "Effettivo",
			hasMenu: true,
		},
		{
			time: "12:16",
			destination: "Brescia",
			trainName: "FR 8508",
			status: "Partito con\n+3 MIN",
			bin: "17 AV",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:17",
			destination: "Porretta Terme",
			trainName: "REG 17721",
			status: "Partito con\n+5 MIN",
			bin: "11-PO",
			binType: "Effettivo",
			hasMenu: true,
		},
		{
			time: "12:18",
			destination: "Milano Centrale",
			trainName: "FR 9806",
			status: "In orario",
			bin: "6",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:25",
			destination: "Lecce",
			trainName: "IC 1545",
			status: "+45 MIN",
			bin: "4",
			binType: "Programmato",
			hasMenu: false,
		},
		{
			time: "12:26",
			destination: "Milano Centrale",
			trainName: "FR 9624",
			status: "In orario",
			bin: "AV",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:27",
			destination: "Reggio Di Calabria...",
			trainName: "FR 9607",
			status: "+17 MIN",
			bin: "AV",
			binType: "Effettivo",
			hasMenu: true,
		},
	];

	const arriviTrains = [
		{
			time: "12:05",
			destination: "Milano Centrale",
			trainName: "FR 9623",
			status: "In orario",
			bin: "17 AV",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:12",
			destination: "Venezia S. Lucia",
			trainName: "REG 3850",
			status: "In arrivo con\n+2 MIN",
			bin: "9",
			binType: "Effettivo",
			hasMenu: true,
		},
		{
			time: "12:15",
			destination: "Roma Termini",
			trainName: "FR 9540",
			status: "In orario",
			bin: "16 AV",
			binType: "Effettivo",
			hasMenu: false,
		},
		{
			time: "12:20",
			destination: "Firenze S. M. N.",
			trainName: "IC 1545",
			status: "+5 MIN",
			bin: "5",
			binType: "Effettivo",
			hasMenu: true,
		},
	];

	const displayTrains = activeTab === "Partenze" ? partenzeTrains : arriviTrains;

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
					<View key={index} className="flex-row items-center py-3 border-b border-gray-100">
						<View className="w-[15%]">
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-950">
								{train.time}
							</ThemedText>
						</View>
						<View className="w-[45%] pl-2 pr-2">
							<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-950" numberOfLines={1}>
								{train.destination}
							</ThemedText>
							<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500">
								{train.trainName}
							</ThemedText>
						</View>
						<View className="w-[20%] pr-2">
							<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">
								{train.status}
							</ThemedText>
						</View>
						<View className="w-[20%] flex-row items-center justify-between">
							<View>
								<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-950">
									{train.bin}
								</ThemedText>
								<ThemedText className="text-[10px] font-plus-jakarta-medium !text-gray-500">
									{train.binType}
								</ThemedText>
							</View>
							{train.hasMenu && (
								<Pressable className="ml-1">
									<Icon name="more_vert" size={20} color="#9ca3af" />
								</Pressable>
							)}
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}
