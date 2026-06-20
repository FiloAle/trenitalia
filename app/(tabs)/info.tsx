import { InfoBanner } from "@/components/home/info-banner";
import { BottomSheet } from "@/components/modals/bottom-sheet";
import { FollowTrainModal } from "@/components/modals/follow-train-modal";
import { TopDownModal } from "@/components/modals/top-down-modal";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { RECENT_STATIONS, STATIONS } from "@/constants/stations";
import {
	getRecentTrains,
	RecentTrainSearch,
} from "@/utils/recent-trains-store";
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
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PageHeader } from "@/components/ui/page-header";

const CHIPS = ["Stazione", "Da/a", "N. Treno"];

const AnimatedTabLabel = ({
	chip,
	isActive,
}: {
	chip: string;
	isActive: boolean;
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			color: withTiming(isActive ? "#ffffff" : "#004141", { duration: 250 }),
		};
	}, [isActive]);

	return (
		<Animated.Text
			className="text-[14px] font-google-sans-semibold"
			style={animatedStyle}
		>
			{chip}
		</Animated.Text>
	);
};

export default function InfoScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams<{
		followed?: string;
		openNews?: string;
	}>();
	const [activeChip, setActiveChip] = useState("Stazione");
	const [tabWidth, setTabWidth] = useState(0);
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
			const response = await fetch(
				"http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/infomobilitaRSS/false",
			);
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

	const activeChipIndex =
		CHIPS.indexOf(activeChip) === -1 ? 0 : CHIPS.indexOf(activeChip);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(activeChipIndex * (tabWidth / CHIPS.length), {
						duration: 250,
					}),
				},
			],
		};
	}, [activeChipIndex, tabWidth]);

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
						<View className="px-5 pt-6 gap-6">
							{/* Search Box */}
							<View className="rounded-2xl border border-gray-200 bg-white px-4 py-1">
								<TextInput
									className="font-google-sans-medium text-gray-900 h-12"
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
								<View className="gap-2">
									<ThemedText className="mb-2 text-xs font-google-sans-bold !text-gray-500">
										ULTIME RICERCHE
									</ThemedText>
									{recentTrains.map((search, idx) => (
										<Pressable
											key={idx}
											className="flex-row items-center py-2"
											onPress={() =>
												router.navigate({
													pathname: "/train-details",
													params: { trainNumber: search.trainNumber },
												})
											}
										>
											<Icon
												name="schedule"
												size={20}
												color="#1f2937"
												weight={400}
											/>
											<ThemedText className="ml-3 font-google-sans-semibold !text-gray-950">
												{search.trainNumber} {search.origin} -{" "}
												{search.destination}
											</ThemedText>
										</Pressable>
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
							<View className="gap-6 pb-6">
								{/* Search Box */}
								<View className="rounded-2xl border border-gray-200 bg-white px-4 py-1">
									<TextInput
										className="font-google-sans-medium text-gray-900 h-12"
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
										onPress={() =>
											router.navigate({
												pathname: "/station-board",
												params: { station: "Milano Bovisa Politecnico" },
											})
										}
									>
										<Icon name="near_me" size={20} color="#1f2937" />
										<ThemedText className="ml-2 font-google-sans-bold !text-gray-950">
											Milano Bovisa Politecnico
										</ThemedText>
									</Pressable>
								)}

								<ThemedText className="text-xs font-google-sans-bold !text-gray-500">
									{isSearching ? "RISULTATI" : "RECENTI"}
								</ThemedText>
							</View>
						}
						renderItem={({ item }) => (
							<Pressable
								className="flex-row items-center py-2"
								onPress={() =>
									router.navigate({
										pathname: "/station-board",
										params: { station: item.name },
									})
								}
							>
								<Icon
									name={isSearching ? "train" : "history"}
									size={20}
									color="#1f2937"
									weight={isSearching ? 300 : 400}
								/>
								<ThemedText className="ml-3 font-google-sans-semibold !text-gray-950">
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
							<ThemedText className="mt-6 text-center text-xl font-google-sans-bold !text-gray-950">
								Ricerca inserendo origine e destinazione
							</ThemedText>
							<ThemedText className="mt-2 text-center font-google-sans-medium !text-gray-500">
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
								className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
							>
								{/* Header */}
								<View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
									<View className="flex-row items-center">
										<Image
											source={require("../../assets/logos/frecciarossa.png")}
											style={{ width: 80, height: 12, marginRight: 8 }}
											resizeMode="contain"
										/>
										<ThemedText className="text-sm font-google-sans-bold !text-gray-900">
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
										<ThemedText className="text-sm font-google-sans-semibold !text-gray-900">
											Milano Centrale
										</ThemedText>
										<ThemedText className="text-sm font-google-sans-semibold !text-gray-900">
											Taranto
										</ThemedText>
									</View>

									<View className="flex-row items-center justify-between mb-4">
										<ThemedText className="text-2xl font-google-sans-bold !text-gray-950">
											11:35
										</ThemedText>
										<View className="flex-row items-center flex-1 mx-4">
											<View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
											<View className="flex-1 h-[1px] bg-gray-300 mx-2" />
											<ThemedText className="text-xs font-google-sans-medium !text-gray-500">
												8h 13min
											</ThemedText>
											<View className="flex-1 h-[1px] bg-gray-300 mx-2" />
											<View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
										</View>
										<ThemedText className="text-2xl font-google-sans-bold !text-gray-950">
											19:48
										</ThemedText>
									</View>

									<View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
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
											<View className="border border-gray-200 px-2 py-1 rounded">
												<ThemedText className="text-xs font-google-sans-semibold !text-gray-600">
													BIN 17
												</ThemedText>
											</View>
											<View className="bg-red-50 px-2 py-1 rounded">
												<ThemedText className="text-xs font-google-sans-bold !text-red-500">
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
							<ThemedText className="mt-6 text-center text-xl font-google-sans-bold !text-gray-950">
								Non ci sono treni seguiti
							</ThemedText>
							<ThemedText className="mt-4 text-center font-google-sans-medium !text-gray-500">
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
					<View
						className="bg-primary-500/10 rounded-xl p-1 flex-row relative"
						onLayout={(e) => setTabWidth(e.nativeEvent.layout.width - 8)}
					>
						{tabWidth > 0 && (
							<Animated.View
								className="absolute top-1 bottom-1 bg-primary-600 rounded-lg"
								style={[
									{ left: 4, width: tabWidth / CHIPS.length },
									animatedStyle,
								]}
							/>
						)}
						{CHIPS.map((chip) => (
							<Pressable
								key={chip}
								onPress={() => setActiveChip(chip)}
								className="flex-1 items-center justify-center py-2.5 z-10"
							>
								<AnimatedTabLabel chip={chip} isActive={activeChip === chip} />
							</Pressable>
						))}
					</View>
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
							<View className="bg-white/90 pt-2 rounded-2xl mb-2">
								<InfoBanner />
							</View>
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
											className="p-4 bg-white rounded-2xl border border-gray-200"
										>
											<View className="flex-row justify-between items-center gap-3">
												<Icon name="info" size={20} color="#eab308" />
												<ThemedText
													numberOfLines={2}
													className="flex-1 text-[15px] font-google-sans-bold !text-gray-900 leading-snug"
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
												<View className="pl-8">
													<ThemedText className="text-[14px] font-google-sans-medium !text-gray-600 leading-snug mt-3">
														{news.content}
													</ThemedText>
												</View>
											)}
										</Pressable>
									))
								) : (
									<ThemedText className="text-center font-google-sans-medium !text-gray-500 mt-4">
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
