import { InfoBanner } from "@/components/home/info-banner";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { SearchModal } from "@/components/modals/search-modal";
import { RECENT_SEARCHES, STATIONS } from "@/constants/stations";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, FlatList, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["N. Treno", "Tabellone", "Da/a", "Treni seguiti"];

export default function InfoScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("N. Treno");
	const [searchVisible, setSearchVisible] = useState(false);
	const [searchParams, setSearchParams] = useState<{
		from?: string;
		to?: string;
		step?: "searching" | "details";
	}>({});

	const handleSearch = (from?: string, to?: string) => {
		setSearchParams({ from, to, step: to ? "details" : "searching" });
		setSearchVisible(true);
	};

	const renderContent = () => {
		switch (activeChip) {
			case "N. Treno":
				return (
					<ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ gap: 24, paddingBottom: 200 }}>
						{/* Search Box */}
						<View className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
							<TextInput
								className="font-plus-jakarta-medium text-gray-950 text-[15px] p-0"
								placeholder="N. Treno"
								placeholderTextColor="#9ca3af"
								keyboardType="numeric"
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
									onPress={() => handleSearch(search.from, search.to)}
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
					</ScrollView>
				);
			case "Tabellone":
				return (
					<FlatList
						className="flex-1 px-5 pt-6"
						contentContainerStyle={{ paddingBottom: 200 }}
						showsVerticalScrollIndicator={false}
						data={STATIONS}
						keyExtractor={(item) => item}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						windowSize={5}
						ListHeaderComponent={
							<View className="gap-6 pb-6">
								{/* Search Box */}
								<View className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
									<TextInput
										className="font-plus-jakarta-medium text-gray-950 text-[15px] p-0"
										placeholder="Ricerca stazione"
										placeholderTextColor="#9ca3af"
									/>
								</View>

								{/* Current Station */}
								<View className="flex-row items-center">
									<Icon name="near_me" size={20} color="#1f2937" />
									<ThemedText className="ml-2 font-plus-jakarta-bold !text-gray-950">
										Milano Bovisa Politecnico
									</ThemedText>
								</View>

								<ThemedText className="mb-2 text-xs font-plus-jakarta-bold !text-gray-500">
									STAZIONI
								</ThemedText>
							</View>
						}
						renderItem={({ item }) => (
							<View className="flex-row items-center py-2">
								<Icon name="history" size={20} color="#1f2937" />
								<ThemedText className="ml-3 font-plus-jakarta-semibold !text-gray-950">
									{item}
								</ThemedText>
							</View>
						)}
					/>
				);
			case "Da/a":
				return (
					<View className="mt-20 items-center justify-center px-10">
						<Icon name="visibility" size={64} color="#d1d5db" />
						<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
							Ricerca inserendo origine e destinazione
						</ThemedText>
						<ThemedText className="mt-2 text-center font-plus-jakarta-medium !text-gray-500">
							Avvia la ricerca per visualizzare tutte le informazioni del tuo
							treno
						</ThemedText>
						<Pressable 
							className="mt-8 rounded-lg bg-teal-900 px-8 py-3"
							onPress={() => handleSearch()}
						>
							<ThemedText className="font-plus-jakarta-bold !text-white">
								Ricerca treno
							</ThemedText>
						</Pressable>
					</View>
				);
			case "Treni seguiti":
				return (
					<View className="mt-20 items-center justify-center px-10">
						<Icon name="frame_inspect" size={64} color="#d1d5db" />
						<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
							Non ci sono treni seguiti
						</ThemedText>
						<ThemedText className="mt-4 text-center font-plus-jakarta-medium !text-gray-500">
							Una volta che avrai seguito uno o più treni li potrai vedere qui
						</ThemedText>
					</View>
				);
			default:
				return null;
		}
	};

	return (
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

			{/* Main Content */}
			<View className="flex-1">
				{renderContent()}
			</View>

			{/* Fixed Footer Section - Banner and Search Button */}
			{(activeChip === "N. Treno" || activeChip === "Tabellone") && (
				<View className="absolute bottom-6 left-0 right-0 px-5 gap-4">
					{/* Banner */}
					<View>
						<InfoBanner />
					</View>

					{/* Search Button (only for N. Treno) */}
					{activeChip === "N. Treno" && (
						<MainButton title="Ricerca" onPress={() => handleSearch()} />
					)}
				</View>
			)}

			<SearchModal
				isVisible={searchVisible}
				onClose={() => setSearchVisible(false)}
				initialFrom={searchParams.from}
				initialTo={searchParams.to}
				initialStep={searchParams.step}
			/>
		</View>
	);
}
