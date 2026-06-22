import { getStationBoardApi } from "@/api/station-board";
import {
	StationBoardTrainRow,
	TrainData,
} from "@/components/station-board/station-board-train-row";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { TabSelector } from "@/components/ui/tab-selector";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StationBoardScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams<{ station?: string }>();
	const [activeTab, setActiveTab] = useState("Partenze");
	const [isLoading, setIsLoading] = useState(false);
	const [displayTrains, setDisplayTrains] = useState<TrainData[]>([]);
	const [lastUpdate, setLastUpdate] = useState<string>("Aggiornato ora");

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
			{/* Header */}
			<PageHeader title="Stazione" />

			{/* Station Info Panel */}
			<View className="bg-primary-600 px-5 pb-6 pt-2">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center flex-1 pr-2">
						<Icon
							name="subway"
							size={22}
							color="white"
							weight={500}
							style={{ marginRight: 6, marginTop: -3 }}
						/>
						<ThemedText className="text-[20px] font-google-sans-semibold !text-white flex-shrink">
							{stationName}
						</ThemedText>
					</View>
					<View className="flex-row items-center">
						<Icon name="bookmark_border" size={20} className="!text-white" />
					</View>
				</View>
				{lastUpdate ? (
					<ThemedText className="text-[13px] font-google-sans-regular !text-white/80 mt-1">
						{lastUpdate}
					</ThemedText>
				) : null}
			</View>

			{/* Tabs */}
			<View className="px-5 py-5 z-50">
				<TabSelector
					tabs={["Partenze", "Arrivi"]}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
			</View>

			{/* Table Headers */}
			<View className="flex-row px-5 py-2 bg-neutral-50">
				<View className="w-[18%]">
					<ThemedText className="text-sm font-google-sans-bold !text-neutral-950">
						Orario
					</ThemedText>
				</View>
				<View className="flex-1 pl-1">
					<ThemedText className="text-sm font-google-sans-bold !text-neutral-950">
						Destinazione
					</ThemedText>
				</View>
				<View className="w-[28%] items-center">
					<ThemedText className="text-sm font-google-sans-bold !text-neutral-950">
						Stato
					</ThemedText>
				</View>
				<View className="w-[18%] items-center">
					<ThemedText className="text-sm font-google-sans-bold !text-neutral-950">
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
						<ActivityIndicator size="large" color="#004141" />
					</View>
				) : (
					displayTrains.map((train, index) => (
						<StationBoardTrainRow
							key={index}
							train={train}
							onPress={() => {
								router.navigate({
									pathname: "/train-details",
									params: { trainNumber: train.trainName },
								});
							}}
						/>
					))
				)}
			</ScrollView>
		</View>
	);
}
