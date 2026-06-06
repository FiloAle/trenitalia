import { InfoBanner } from "@/components/home/info-banner";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { RECENT_SEARCHES, RECENT_STATIONS, STATIONS } from "@/constants/stations";
import React, { useState } from "react";
import { Pressable, ScrollView, View, TextInput, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { useEffect } from "react";
import { Image } from "react-native";

const CHIPS = ["N. Treno", "Tabellone", "Da/a", "Treni seguiti"];

export default function InfoScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams<{ followed?: string }>();
	const [activeChip, setActiveChip] = useState("N. Treno");
	const [trainNumber, setTrainNumber] = useState("");
	const [stationSearch, setStationSearch] = useState("");
	const [hasFollowedTrain, setHasFollowedTrain] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

	const handleSearch = (from?: string, to?: string) => {
		router.push({
			pathname: "/search",
			params: { initialFrom: from, initialTo: to, initialStep: to ? "details" : "searching" },
		});
	};

	useEffect(() => {
		if (params.followed === "true") {
			setHasFollowedTrain(true);
			setActiveChip("Treni seguiti");
			// Clear param to avoid triggering again on re-render, though not strictly needed here
			router.setParams({ followed: "" });
		}
	}, [params.followed]);

	const renderContent = () => {
		switch (activeChip) {
			case "N. Treno":
				return (
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 200 }}
						keyboardShouldPersistTaps="handled"
					>
						<View className="px-5 pt-6 gap-6">
							{/* Search Box */}
							<View className="rounded-lg border border-gray-200 bg-white px-4 py-1">
								<TextInput
									className="font-plus-jakarta-medium text-gray-900 h-12"
									placeholder="N. Treno"
									placeholderTextColor="#9ca3af"
									keyboardType="numeric"
									maxLength={4}
									value={trainNumber}
									onChangeText={setTrainNumber}
								/>
							</View>

							{/* Recent Searches */}
							<View className="gap-2">
								<ThemedText className="mb-2 text-xs font-plus-jakarta-bold !text-gray-500">
									ULTIME RICERCHE
								</ThemedText>
								{RECENT_SEARCHES.map((search, idx) => (
									<Pressable 
										key={idx} 
										className="flex-row items-center py-2"
										onPress={() => router.navigate("/train-details")}
									>
										<Icon
											name="schedule"
											size={20}
											color="#1f2937"
											weight={400}
										/>
										<ThemedText className="ml-3 font-plus-jakarta-semibold !text-gray-950">
											{8807 - idx} {search.from} - {search.to}
										</ThemedText>
									</Pressable>
								))}
							</View>
						</View>
					</ScrollView>
				);
			case "Tabellone": {
				const isSearching = stationSearch.length > 0;
				const filteredStations = isSearching
					? STATIONS.filter((s) => s.name.toLowerCase().includes(stationSearch.toLowerCase())
						)
					: RECENT_STATIONS;

				return (
					<FlatList
						className="flex-1 px-5 pt-6"
						contentContainerStyle={{ paddingBottom: 200 }}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						data={filteredStations}
						keyExtractor={(item) => item.name}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						windowSize={5}
						ListHeaderComponent={
							<View className="gap-6 pb-6">
								{/* Search Box */}
								<View className="rounded-lg border border-gray-200 bg-white px-4 py-1">
									<TextInput
										className="font-plus-jakarta-medium text-gray-900 h-12"
										placeholder="Ricerca stazione"
										placeholderTextColor="#9ca3af"
										value={stationSearch}
										onChangeText={setStationSearch}
									/>
								</View>

								{/* Current Station */}
								{!isSearching && (
									<Pressable 
										className="flex-row items-center"
										onPress={() => router.navigate({ pathname: "/station-board", params: { station: "Milano Bovisa Politecnico" } })}
									>
										<Icon name="near_me" size={20} color="#1f2937" />
										<ThemedText className="ml-2 font-plus-jakarta-bold !text-gray-950">
											Milano Bovisa Politecnico
										</ThemedText>
									</Pressable>
								)}

								<ThemedText className="text-xs font-plus-jakarta-bold !text-gray-500">
									{isSearching ? "RISULTATI" : "RECENTI"}
								</ThemedText>
							</View>
						}
						renderItem={({ item }) => (
							<Pressable 
								className="flex-row items-center py-2"
								onPress={() => router.navigate({ pathname: "/station-board", params: { station: item.name } })}
							>
								<Icon
									name={isSearching ? "train" : "history"}
									size={20}
									color="#1f2937"
									weight={isSearching ? 300 : 400}
								/>
								<ThemedText className="ml-3 font-plus-jakarta-semibold !text-gray-950">
									{item.name}
								</ThemedText>
							</Pressable>
						)}
					/>
				);
			}
			case "Da/a":
				return (
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 200 }}
						keyboardShouldPersistTaps="handled"
					>
						<View className="mt-20 items-center justify-center px-10">
							<Icon name="visibility" size={64} color="#d1d5db" />
							<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
								Ricerca inserendo origine e destinazione
							</ThemedText>
							<ThemedText className="mt-2 text-center font-plus-jakarta-medium !text-gray-500">
								Avvia la ricerca per visualizzare tutte le informazioni del tuo
								treno
							</ThemedText>
							<View className="w-full mt-8">
								<MainButton 
									title="Ricerca treno"
									onPress={() => handleSearch()}
								/>
							</View>
						</View>
					</ScrollView>
				);
			case "Treni seguiti":
				return hasFollowedTrain ? (
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 200 }}
						keyboardShouldPersistTaps="handled"
					>
						<View className="px-5 pt-6 gap-4 pb-10">
							<Pressable 
								onPress={() => router.navigate("/train-details")}
								className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
							>
								{/* Header */}
								<View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
									<View className="flex-row items-center">
										<Image
											source={require('../../assets/logos/frecciarossa.png')}
											style={{ width: 80, height: 12, marginRight: 8 }}
											resizeMode="contain"
										/>
										<ThemedText className="text-sm font-plus-jakarta-bold !text-gray-900">
											8807
										</ThemedText>
									</View>
									<Pressable 
										onPress={(e) => {
											e.stopPropagation();
											setIsDeleteModalVisible(true);
										}}
										className="p-1"
									>
										<Icon name="delete_outline" size={24} color="#6b7280" />
									</Pressable>
								</View>
								
								{/* Content */}
								<View className="p-4">
									<View className="flex-row justify-between mb-2">
										<ThemedText className="text-sm font-plus-jakarta-semibold !text-gray-900">Milano Centrale</ThemedText>
										<ThemedText className="text-sm font-plus-jakarta-semibold !text-gray-900">Taranto</ThemedText>
									</View>
									
									<View className="flex-row items-center justify-between mb-4">
										<ThemedText className="text-2xl font-plus-jakarta-bold !text-gray-950">11:35</ThemedText>
										<View className="flex-row items-center flex-1 mx-4">
											<View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
											<View className="flex-1 h-[1px] bg-gray-300 mx-2" />
											<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-500">8h 13min</ThemedText>
											<View className="flex-1 h-[1px] bg-gray-300 mx-2" />
											<View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
										</View>
										<ThemedText className="text-2xl font-plus-jakarta-bold !text-gray-950">19:48</ThemedText>
									</View>

									<View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
										<Pressable 
											className="flex-row items-center"
											onPress={(e) => {
												e.stopPropagation();
												setIsFollowModalVisible(true);
											}}
										>
											<Icon name="notifications_active" size={16} color="#005045" className="mr-2" />
											<ThemedText className="text-sm font-plus-jakarta-bold !text-[#005045]">Modifica notifica</ThemedText>
										</Pressable>
										<View className="flex-row items-center gap-2">
											<View className="border border-gray-200 px-2 py-1 rounded">
												<ThemedText className="text-xs font-plus-jakarta-semibold !text-gray-600">BIN 17</ThemedText>
											</View>
											<View className="bg-red-50 px-2 py-1 rounded">
												<ThemedText className="text-xs font-plus-jakarta-bold !text-red-500">+35 MIN</ThemedText>
											</View>
										</View>
									</View>
								</View>
							</Pressable>
						</View>
					</ScrollView>
				) : (
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 200 }}
						keyboardShouldPersistTaps="handled"
					>
						<View className="mt-20 items-center justify-center px-10">
							<Icon name="frame_inspect" size={64} color="#d1d5db" />
							<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
								Non ci sono treni seguiti
							</ThemedText>
							<ThemedText className="mt-4 text-center font-plus-jakarta-medium !text-gray-500">
								Una volta che avrai seguito uno o più treni li potrai vedere qui
							</ThemedText>
						</View>
					</ScrollView>
				);
			default:
				return null;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View className="flex-1 bg-white">
				{/* Header Section */}
				<View className="bg-teal-900 pb-6" style={{ paddingTop: insets.top + 4 }}>
					<View className="h-14 flex-row items-center justify-between px-6 mb-2">
						<ThemedText className="text-3xl font-plus-jakarta-bold !text-white">
							Infomobilità
						</ThemedText>
						<View className="flex-row items-center gap-4">
							<Icon name="notifications" size={24} color="white" />
							<Icon name="info" size={24} color="white" />
						</View>
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="px-5"
					>
						{CHIPS.map((chip) => (
							<Pressable
								key={chip}
								onPress={() => setActiveChip(chip)}
								className={`mr-3 rounded-full px-5 py-2.5 ${
									activeChip === chip ? "bg-[#1f2937]" : "bg-[#ffffff20]"
								}`}
							>
								<ThemedText className="font-plus-jakarta-semibold !text-white">
									{chip}
								</ThemedText>
							</Pressable>
						))}
					</ScrollView>
				</View>

				{/* Main Content Area */}
				<View className="flex-1">
					{renderContent()}
				</View>

				{/* Fixed Banner for Tabellone */}
				{activeChip === "Tabellone" && (
					<View 
						className="absolute left-0 right-0 px-5 z-10 bottom-6"
						pointerEvents="box-none"
					>
						<View className="bg-white/90 pt-2 rounded-lg">
							<InfoBanner />
						</View>
					</View>
				)}

				{/* Search Button & Banner - Moves with keyboard */}
				{activeChip === "N. Treno" && (
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
						pointerEvents="box-none"
					>
						<View className="flex-1 justify-end px-5 pb-6" pointerEvents="box-none">
							<View className="bg-white/90 pt-2 rounded-lg mb-2">
								<InfoBanner />
							</View>
							<MainButton title="Ricerca" onPress={() => router.navigate("/train-details")} />
						</View>
					</KeyboardAvoidingView>
				)}
			</View>



			<TopDownModal 
				isVisible={isDeleteModalVisible}
				title="Attenzione"
				description="Vuoi rimuovere questo viaggio dalla lista dei treni seguiti?"
				iconName="warning_amber"
				iconColor="#f59e0b"
				iconBgColor="#fef3c7"
				buttons={[
					{
						label: "Annulla",
						onPress: () => setIsDeleteModalVisible(false),
						variant: "secondary"
					},
					{
						label: "Rimuovi",
						onPress: () => {
							setIsDeleteModalVisible(false);
							setTimeout(() => setHasFollowedTrain(false), 300);
						}
					}
				]}
			/>

			<FollowTrainModal 
				isVisible={isFollowModalVisible}
				onClose={() => setIsFollowModalVisible(false)}
				onConfirm={() => {
					setIsFollowModalVisible(false);
					setTimeout(() => setIsSuccessModalVisible(true), 400);
				}}
				stations={["Reggio Emilia Av", "Bologna Centrale", "Cesena"]}
				initialDays={[0]}
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
					}
				}]}
			/>
		</View>
	);
}
