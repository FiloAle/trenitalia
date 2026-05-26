import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";

export default function TrainDetailsScreen() {
	const insets = useSafeAreaInsets();
	const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

	const timelineStations = [
		{
			id: "milano",
			name: "Milano Centrale",
			bin: "17",
			events: [
				{ label: "Partenza Programmata", time: "11:35" },
				{ label: "Partenza Effettiva", time: "11:47", isActual: true },
			],
		},
		{
			id: "reggio",
			name: "Reggio Emilia Av",
			bin: "4",
			events: [
				{ label: "Arrivo Programmato", time: "12:18" },
				{ label: "Arrivo Stimato", time: "12:30", isActual: true },
				{ label: "Partenza Programmata", time: "12:20" },
				{ label: "Partenza Stimata", time: "12:32", isActual: true },
			],
		},
		{
			id: "bologna",
			name: "Bologna Centrale",
			bin: "6",
			events: [
				{ label: "Arrivo Programmato", time: "12:42" },
				{ label: "Arrivo Stimato", time: "12:54", isActual: true },
				{ label: "Partenza Programmata", time: "12:45" },
				{ label: "Partenza Stimata", time: "12:57", isActual: true },
			],
		},
		{
			id: "cesena",
			name: "Cesena",
			bin: "2",
			events: [
				{ label: "Arrivo Programmato", time: "13:22" },
				{ label: "Arrivo Stimato", time: "13:34", isActual: true },
			],
		},
	];

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View className="flex-row items-center justify-between px-5 pt-1 pb-2 bg-white" style={{ paddingTop: insets.top + 16 }}>
				<View className="w-10" />
				<ThemedText className="flex-1 text-center text-[15px] font-plus-jakarta-bold !text-gray-950">
					Infomobilità
				</ThemedText>
				<Pressable onPress={() => router.back()} className="p-2 -mr-2">
					<Icon name="close" size={28} className="!text-gray-800" weight={300} />
				</Pressable>
			</View>

			<ScrollView className="flex-1 px-5 pt-4 pb-20">
				{/* Header Info */}
				<View className="flex-row items-center justify-between mb-6">
					<View>
						<View className="flex-row items-center mb-1">
							<Image
								source={require('../assets/logos/frecciarossa.png')}
								style={{ width: 80, height: 12 }}
								resizeMode="contain"
							/>
							<ThemedText className="ml-2 text-sm font-plus-jakarta-bold !text-gray-900">
								8807
							</ThemedText>
						</View>
						<View className="flex-row items-center mt-1">
							<Icon name="calendar_today" size={14} color="#4b5563" className="mr-1" />
							<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-700">
								25/04/2026
							</ThemedText>
						</View>
					</View>
					
					<Pressable 
						className="bg-[#f3f4f6] flex-row items-center px-4 py-2 rounded-lg"
						onPress={() => setIsFollowModalVisible(true)}
					>
						<Icon name="notifications_none" size={20} color="#005045" className="mr-2" />
						<ThemedText className="font-plus-jakarta-bold !text-[#005045]">
							Attiva notifiche
						</ThemedText>
					</Pressable>
				</View>

				{/* Delay Card */}
				<View className="border border-gray-200 rounded-lg p-4 mb-8">
					<View className="flex-row items-start justify-between">
						<View>
							<ThemedText className="font-plus-jakarta-bold !text-gray-950 mb-1">
								Pm Reggio Emilia
							</ThemedText>
							<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500">
								Ultimo rilevamento: 25/04/2026 - 12:27
							</ThemedText>
						</View>
						<View className="flex-row items-center">
							<View className="bg-red-50 px-2 py-1 rounded border border-red-200 mr-2">
								<ThemedText className="text-sm font-plus-jakarta-bold !text-red-500">
									+12 MIN
								</ThemedText>
							</View>
							<Icon name="info_outline" size={20} color="#4b5563" />
						</View>
					</View>
				</View>

				{/* Timeline */}
				<View className="pl-4">
					{timelineStations.map((station, index) => (
						<View key={station.id} className="flex-row relative">
							{/* Left Column: Table Icon & Line/Circle */}
							<View className="flex-row items-start mr-3">
								<Pressable 
									onPress={() => router.navigate("/station-board")}
									className="mr-2"
								>
									<Icon name="table_chart" size={24} color="#4b5563" />
								</Pressable>
								<View className="w-8 items-center relative">
									{/* The line connecting nodes (don't draw after last node) */}
									{index !== timelineStations.length - 1 && (
										<View 
											className="absolute w-[2px] bg-gray-200"
											style={{ top: 12, bottom: -24 }}
										/>
									)}
									{/* Active line portion */}
									{index === 0 && (
										<View 
											className="absolute w-[4px] bg-[#005045]"
											style={{ top: 12, height: '150%' }}
										/>
									)}
									
									{/* Station node dot */}
									<View 
										className="w-3 h-3 rounded-full bg-white border-2 border-[#005045] mt-[6px] z-10"
									/>
								</View>
							</View>

							{/* Right Column: Station Details */}
							<View className="flex-1 pb-8">
								<View className="flex-row items-center justify-between mb-2">
									<View className="flex-row items-center flex-1">
										<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mr-2">
											{station.name}
										</ThemedText>
									</View>
									<View className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
										<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-600">
											BIN {station.bin}
										</ThemedText>
									</View>
								</View>
								
								<View className="bg-gray-100 self-start px-2 py-1 rounded mb-2">
									<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-700">
										Executive in testa
									</ThemedText>
								</View>

								<View className="gap-1 mt-1">
									{station.events.map((ev, idx) => (
										<View key={idx} className="flex-row items-center justify-between">
											<ThemedText 
												className={`text-sm ${
													ev.isActual 
														? "font-plus-jakarta-bold !text-[#005045]" 
														: "font-plus-jakarta-medium !text-gray-500"
												}`}
											>
												{ev.label}
											</ThemedText>
											<ThemedText 
												className={`text-sm ${
													ev.isActual 
														? "font-plus-jakarta-bold !text-[#005045]" 
														: "font-plus-jakarta-medium !text-gray-500"
												}`}
											>
												{ev.time}
											</ThemedText>
										</View>
									))}
								</View>
							</View>
						</View>
					))}
				</View>
			</ScrollView>

			<FollowTrainModal 
				isVisible={isFollowModalVisible}
				onClose={() => setIsFollowModalVisible(false)}
				onConfirm={() => {
					setIsFollowModalVisible(false);
					setTimeout(() => setIsSuccessModalVisible(true), 400);
				}}
				stations={timelineStations.map(s => s.name)}
			/>

			<TopDownModal 
				isVisible={isSuccessModalVisible}
				title="Notifica registrata"
				description="Adesso riceverai le informazioni in tempo reale del treno seguito"
				iconName="check"
				buttons={[{
					label: "OK",
					onPress: () => {
						setIsSuccessModalVisible(false);
						router.navigate({ pathname: "/(tabs)/info", params: { followed: "true" } });
					}
				}]}
			/>
		</View>
	);
}
