import { BottomSheet } from "@/components/modals/bottom-sheet";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { SearchListItem } from "@/components/search/search-list-item";
import { SectionHeader } from "@/components/search/section-header";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { PageHeader } from "@/components/ui/page-header";
import { TabSelector } from "@/components/ui/tab-selector";
import { RECENT_STATIONS, STATIONS } from "@/constants/stations";
import {
	getRecentTrains,
	RecentTrainSearch,
} from "@/utils/recent-trains-store";
import { getViaggiatrenoUrl } from "@/api/proxy-helper";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	DeviceEventEmitter,
	Dimensions,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Stazione", "Da/a", "N. Treno"];

export default function InfoScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams<{
		followed?: string;
		openNews?: string;
	}>();
	const [activeChip, setActiveChip] = useState("Stazione");
	const [trainNumber, setTrainNumber] = useState("");
	const [stationSearch, setStationSearch] = useState("");
	const [hasFollowedTrain, setHasFollowedTrain] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isFollowModalVisible, setIsFollowModalVisible] = useState(false);
	const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

	const [isNotizieOpen, setIsNotizieOpen] = useState(false);
	const [notizie, setNotizie] = useState<{ title: string; content: string }[]>(
		[],
	);
	const [isLoadingNotizie, setIsLoadingNotizie] = useState(false);
	const [expandedNewsIndex, setExpandedNewsIndex] = useState<number | null>(
		null,
	);

	useEffect(() => {
		const subscription = DeviceEventEmitter.addListener("openInfoNews", () => {
			fetchNotizie();
		});
		return () => subscription.remove();
	}, []);

	const fetchNotizie = async () => {
		setIsNotizieOpen(true);
		setExpandedNewsIndex(null);
		setIsLoadingNotizie(true);
		try {
			const targetUrl = "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/infomobilitaRSS/false";
			const response = await fetch(getViaggiatrenoUrl("/infomobilitaRSS/false"));
			const html = await response.text();
			const regex =
				/<li[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<div class="boxAcc"[^>]*>[\s\S]*?<div class="info-text[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

			let match;
			const results: { title: string; content: string }[] = [];
			while ((match = regex.exec(html)) !== null) {
				const title = match[1].trim();
				let newsContent = match[2].trim();

				// Strip HTML and fix spacing
				newsContent = newsContent
					.replace(/<p[^>]*>/gi, "\n")
					.replace(/<\/p>/gi, "\n")
					.replace(/<br\s*\/?>/gi, "\n")
					.replace(/&nbsp;/gi, " ")
					.replace(/<[^>]*>/g, "")
					.replace(/\r/g, "")
					.replace(/[ \t]+/g, " ")
					.replace(/ \n/g, "\n")
					.replace(/\n /g, "\n")
					.replace(/\n{2,}/g, "\n\n")
					.trim();

				if (title) results.push({ title, content: newsContent });
			}

			results.sort((a, b) => {
				const isAUpper = a.title === a.title.toUpperCase();
				const isBUpper = b.title === b.title.toUpperCase();
				if (isAUpper && !isBUpper) return -1;
				if (!isAUpper && isBUpper) return 1;
				return 0;
			});

			setNotizie(results);
		} catch (e) {
			console.warn("Failed to fetch notizie", e);
		} finally {
			setIsLoadingNotizie(false);
		}
	};

	const [recentTrains, setRecentTrains] = useState<RecentTrainSearch[]>([]);

	useFocusEffect(
		useCallback(() => {
			setRecentTrains(getRecentTrains());
		}, []),
	);

	const handleSearch = (from?: string, to?: string) => {
		router.push({
			pathname: "/search",
			params: {
				initialFrom: from,
				initialTo: to,
				initialStep: to ? "details" : "searching",
			},
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
						<View className="px-5 pt-6">
							{/* Search Box */}
							<View className="rounded-2xl border border-neutral-200 bg-white px-4 py-1 mb-6">
								<TextInput
									className="font-google-sans-medium text-neutral-900 h-12"
									placeholder="N. Treno"
									placeholderTextColor="#9ca3af"
									keyboardType="numeric"
									maxLength={4}
									value={trainNumber}
									onChangeText={setTrainNumber}
								/>
							</View>

							{/* Recent Searches */}
							{recentTrains.length > 0 && (
								<View>
									<SectionHeader title="ULTIME RICERCHE" />
									{recentTrains.map((search, idx) => (
										<SearchListItem
											key={idx}
											text={`${search.trainNumber} ${search.origin} - ${search.destination}`}
											iconName="schedule"
											weight={300}
											onPress={() =>
												router.navigate({
													pathname: "/train-details",
													params: { trainNumber: search.trainNumber },
												})
											}
										/>
									))}
								</View>
							)}
						</View>
					</ScrollView>
				);
			case "Stazione": {
				const isSearching = stationSearch.length > 0;
				const filteredStations = isSearching
					? STATIONS.filter((s) =>
							s.name.toLowerCase().includes(stationSearch.toLowerCase()),
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
							<View className="pb-2">
								{/* Search Box */}
								<View className="rounded-2xl border border-neutral-200 bg-white px-4 py-1 mb-6">
									<TextInput
										className="font-google-sans-medium text-neutral-900 h-12"
										placeholder="Ricerca stazione"
										placeholderTextColor="#9ca3af"
										value={stationSearch}
										onChangeText={setStationSearch}
									/>
								</View>

								{/* Current Station */}
								{!isSearching && (
									<View className="mb-4 -mt-2.5">
										<SearchListItem
											iconName="my_location"
											text="Milano Centrale"
											className="!px-0"
											weight={300}
											onPress={() =>
												router.navigate({
													pathname: "/station-board",
													params: { station: "Milano Centrale" },
												})
											}
										/>
									</View>
								)}

								<SectionHeader
									title={isSearching ? "RISULTATI" : "ULTIME RICERCHE"}
								/>
							</View>
						}
						renderItem={({ item }) => (
							<SearchListItem
								text={item.name}
								iconName={isSearching ? "train" : "schedule"}
								weight={300}
								onPress={() =>
									router.navigate({
										pathname: "/station-board",
										params: { station: item.name },
									})
								}
							/>
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
							<ThemedText className="mt-6 text-center text-xl font-google-sans-bold !text-neutral-950">
								Ricerca inserendo origine e destinazione
							</ThemedText>
							<ThemedText className="mt-2 text-center font-google-sans-medium !text-neutral-500">
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
								className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
							>
								{/* Header */}
								<View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-100">
									<View className="flex-row items-center">
										<Image
											source={require("../../assets/logos/frecciarossa.png")}
											style={{ width: 80, height: 12, marginRight: 8 }}
											resizeMode="contain"
										/>
										<ThemedText className="text-sm font-google-sans-bold !text-neutral-900">
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
										<ThemedText className="text-sm font-google-sans-semibold !text-neutral-900">
											Milano Centrale
										</ThemedText>
										<ThemedText className="text-sm font-google-sans-semibold !text-neutral-900">
											Taranto
										</ThemedText>
									</View>

									<View className="flex-row items-center justify-between mb-4">
										<ThemedText className="text-2xl font-google-sans-bold !text-neutral-950">
											11:35
										</ThemedText>
										<View className="flex-row items-center flex-1 mx-4">
											<View className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
											<View className="flex-1 h-[1px] bg-neutral-300 mx-2" />
											<ThemedText className="text-xs font-google-sans-medium !text-neutral-500">
												8h 13min
											</ThemedText>
											<View className="flex-1 h-[1px] bg-neutral-300 mx-2" />
											<View className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
										</View>
										<ThemedText className="text-2xl font-google-sans-bold !text-neutral-950">
											19:48
										</ThemedText>
									</View>

									<View className="flex-row items-center justify-between pt-2 border-t border-neutral-50">
										<Pressable
											className="flex-row items-center"
											onPress={(e) => {
												e.stopPropagation();
												setIsFollowModalVisible(true);
											}}
										>
											<Icon
												name="notifications_active"
												size={16}
												color="#005045"
												className="mr-2"
											/>
											<ThemedText className="text-sm font-google-sans-bold !text-[#005045]">
												Modifica notifica
											</ThemedText>
										</Pressable>
										<View className="flex-row items-center gap-2">
											<View className="border border-neutral-200 px-2 py-1 rounded">
												<ThemedText className="text-xs font-google-sans-semibold !text-neutral-600">
													BIN 17
												</ThemedText>
											</View>
											<View className="bg-rose-50 px-2 py-1 rounded">
												<ThemedText className="text-xs font-google-sans-bold !text-rose-500">
													+35 MIN
												</ThemedText>
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
							<ThemedText className="mt-6 text-center text-xl font-google-sans-bold !text-neutral-950">
								Non ci sono treni seguiti
							</ThemedText>
							<ThemedText className="mt-4 text-center font-google-sans-medium !text-neutral-500">
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
				<PageHeader
					title="Infomobilità"
					showBackButton={false}
					rightElement={
						<Pressable onPress={fetchNotizie}>
							<Icon name="release_alert" size={24} color="white" />
						</Pressable>
					}
				/>

				{/* Tab Selector */}
				<View className="px-5 pt-5 z-50">
					<TabSelector
						tabs={CHIPS}
						activeTab={activeChip}
						onTabChange={setActiveChip}
					/>
				</View>

				{/* Main Content Area */}
				<View className="flex-1">{renderContent()}</View>

				{/* Search Button & Banner - Moves with keyboard */}
				{activeChip === "N. Treno" && (
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
						pointerEvents="box-none"
					>
						<View
							className="flex-1 justify-end px-5 pb-6"
							pointerEvents="box-none"
						>
							<MainButton
								title="Ricerca"
								onPress={() => {
									if (trainNumber.trim().length > 0) {
										router.navigate({
											pathname: "/train-details",
											params: { trainNumber: trainNumber.trim() },
										});
									}
								}}
							/>
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
						variant: "secondary",
					},
					{
						label: "Rimuovi",
						onPress: () => {
							setIsDeleteModalVisible(false);
							setTimeout(() => setHasFollowedTrain(false), 300);
						},
					},
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
				buttons={[
					{
						label: "OK",
						onPress: () => {
							setIsSuccessModalVisible(false);
						},
					},
				]}
			/>

			<BottomSheet
				isVisible={isNotizieOpen}
				onClose={() => setIsNotizieOpen(false)}
				title="Notizie di Infomobilità"
				contentPaddingBottom={-insets.bottom}
			>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
					style={{ height: Dimensions.get("window").height * 0.7 }}
				>
					<View className="py-4">
						{isLoadingNotizie ? (
							<View className="flex-1 justify-center items-center">
								<ActivityIndicator size="large" color="#004141" />
							</View>
						) : (
							<View className="gap-4">
								{notizie.length > 0 ? (
									notizie.map((news, index) => (
										<Pressable
											key={index}
											onPress={() =>
												setExpandedNewsIndex(
													expandedNewsIndex === index ? null : index,
												)
											}
											className="p-4 bg-white rounded-2xl border border-neutral-200"
										>
											<View className="flex-row justify-between items-center gap-3">
												<Icon name="info" size={20} color="#eab308" />
												<ThemedText
													numberOfLines={2}
													className="flex-1 text-[15px] font-google-sans-bold !text-neutral-900 leading-snug"
												>
													{news.title}
												</ThemedText>
												<Icon
													name={
														expandedNewsIndex === index
															? "expand_less"
															: "expand_more"
													}
													size={24}
													color="#9ca3af"
												/>
											</View>
											{expandedNewsIndex === index && (
												<View className="px-8 pt-7 pb-5">
													<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-700 leading-snug">
														{news.content}
													</ThemedText>
												</View>
											)}
										</Pressable>
									))
								) : (
									<ThemedText className="text-center font-google-sans-medium !text-neutral-500 mt-4">
										Nessuna notizia disponibile
									</ThemedText>
								)}
							</View>
						)}
					</View>
				</ScrollView>
			</BottomSheet>
		</View>
	);
}
