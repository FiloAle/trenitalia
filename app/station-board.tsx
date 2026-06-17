import { getStationBoardApi } from "@/api/station-board";
import {
	StationBoardTrainRow,
	TrainData,
} from "@/components/station-board/station-board-train-row";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StationBoardScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams<{ station?: string }>();
	const [activeTab, setActiveTab] = useState("Partenze");
	const [isLoading, setIsLoading] = useState(false);
	const [displayTrains, setDisplayTrains] = useState<TrainData[]>([]);
	const [lastUpdate, setLastUpdate] = useState<string>("");

	const stationName =
		typeof params.station === "string" ? params.station : "Stazione";

	useEffect(() => {
		let isMounted = true;
		setIsLoading(true);

		getStationBoardApi(stationName, activeTab === "Arrivi").then((data) => {
			if (isMounted) {
				setDisplayTrains(data.trains);
				setLastUpdate(data.lastUpdate);
				setIsLoading(false);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [stationName, activeTab]);

	return (
		<View className="flex-1 bg-white">
			{/* Top Bar */}
			<View
				className="flex-row items-center justify-between px-5 pt-1 pb-2 bg-white"
				style={{ paddingTop: insets.top + 16 }}
			>
				<View className="w-10" />
				<ThemedText className="flex-1 text-center text-[15px] font-plus-jakarta-bold !text-gray-950">
					{stationName}
				</ThemedText>
				<Pressable onPress={() => router.back()} className="p-2 -mr-2">
					<Icon
						name="close"
						size={28}
						className="!text-gray-800"
						weight={300}
					/>
				</Pressable>
			</View>

			{/* Tabs */}
			<View className="px-5 mb-4 mt-2">
				<View className="flex-row rounded-full bg-[#f3f4f6] p-1">
					<Pressable
						className={`flex-1 rounded-full items-center py-2 ${activeTab === "Partenze" ? "bg-white" : ""}`}
						style={
							activeTab === "Partenze"
								? {
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.05,
										shadowRadius: 2,
										elevation: 1,
									}
								: undefined
						}
						onPress={() => setActiveTab("Partenze")}
					>
						<ThemedText
							className={`text-[15px] ${activeTab === "Partenze" ? "font-plus-jakarta-bold !text-gray-950" : "font-plus-jakarta-medium !text-gray-600"}`}
						>
							Partenze
						</ThemedText>
					</Pressable>
					<Pressable
						className={`flex-1 rounded-full items-center py-2 ${activeTab === "Arrivi" ? "bg-white" : ""}`}
						style={
							activeTab === "Arrivi"
								? {
										shadowColor: "#000",
										shadowOffset: { width: 0, height: 1 },
										shadowOpacity: 0.05,
										shadowRadius: 2,
										elevation: 1,
									}
								: undefined
						}
						onPress={() => setActiveTab("Arrivi")}
					>
						<ThemedText
							className={`text-[15px] ${activeTab === "Arrivi" ? "font-plus-jakarta-bold !text-gray-950" : "font-plus-jakarta-medium !text-gray-600"}`}
						>
							Arrivi
						</ThemedText>
					</Pressable>
				</View>
			</View>

			{/* Banner */}
			{lastUpdate ? (
				<View className="px-5 mb-4 mt-2">
					<View className="bg-[#eef2ff] rounded-2xl p-3">
						<ThemedText className="text-sm font-plus-jakarta-medium !text-gray-900">
							{lastUpdate}
						</ThemedText>
					</View>
				</View>
			) : null}

			{/* Table Headers */}
			<View className="flex-row px-5 py-2 bg-gray-50 mb-2">
				<View className="w-[15%]">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">
						Orario
					</ThemedText>
				</View>
				<View className="w-[35%] pl-2">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">
						Destinazione
					</ThemedText>
				</View>
				<View className="w-[25%] items-center">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">
						Stato
					</ThemedText>
				</View>
				<View className="w-[20%] items-center">
					<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-950">
						Binario
					</ThemedText>
				</View>
			</View>

			<ScrollView
				className="flex-1 px-5"
				contentContainerStyle={{ paddingBottom: 40 }}
			>
				{isLoading ? (
					<View className="py-10 items-center justify-center">
						<ActivityIndicator size="large" color="#005045" />
					</View>
				) : (
					displayTrains.map((train, index) => (
						<StationBoardTrainRow key={index} train={train} />
					))
				)}
			</ScrollView>
		</View>
	);
}
