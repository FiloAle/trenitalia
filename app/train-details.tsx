import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { TIMELINE_STATIONS } from "@/constants/train-details-mock";
import { TimelineEventRow } from "@/components/train-details/timeline-event-row";

export default function TrainDetailsScreen() {
	const insets = useSafeAreaInsets();
	const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
					{TIMELINE_STATIONS.map((station, index) => (
						<TimelineEventRow
							key={station.id}
							station={station}
							isFirst={index === 0}
							isLast={index === TIMELINE_STATIONS.length - 1}
						/>
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
				stations={TIMELINE_STATIONS.map(s => s.name)}
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
