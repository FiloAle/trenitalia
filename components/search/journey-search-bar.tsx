import { SectionHeader } from "@/components/search/section-header";
import { SearchListItem } from "@/components/search/search-list-item";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { RECENT_SEARCHES, SAVED_SEARCHES, STATIONS } from "@/constants/stations";
import React, { useRef, useState, useMemo } from "react";
import { FlatList, Pressable, TextInput, View, Platform } from "react-native";

export interface JourneySearchBarProps {
	fromText: string;
	setFromText: (text: string) => void;
	toText: string;
	setToText: (text: string) => void;
	activeInput: "from" | "to" | null;
	setActiveInput: (input: "from" | "to" | null) => void;
	onSearchComplete?: (from: string, to: string) => void;
}

export function JourneySearchBar({
	fromText,
	setFromText,
	toText,
	setToText,
	activeInput,
	setActiveInput,
	onSearchComplete,
}: JourneySearchBarProps) {
	const [lastActiveInput, setLastActiveInput] = useState<"from" | "to">("from");
	const fromInputRef = useRef<TextInput>(null);
	const toInputRef = useRef<TextInput>(null);

	const handleStationSelect = (stationName: string) => {
		if (activeInput === "from") {
			setFromText(stationName);
			setActiveInput("to");
			toInputRef.current?.focus();
		} else if (activeInput === "to") {
			setToText(stationName);
			setActiveInput(null);
			if (fromText && stationName && onSearchComplete) {
				onSearchComplete(fromText, stationName);
			}
		} else if (lastActiveInput === "from") {
			setFromText(stationName);
			if (onSearchComplete && stationName && toText) {
				onSearchComplete(stationName, toText);
			}
		} else {
			setToText(stationName);
			if (onSearchComplete && fromText && stationName) {
				onSearchComplete(fromText, stationName);
			}
		}
	};

	const handleRouteSelect = (from: string, to: string) => {
		setFromText(from);
		setToText(to);
		setActiveInput(null);
		if (onSearchComplete) {
			onSearchComplete(from, to);
		}
	};

	const showSuggestions =
		(activeInput === "from" && fromText.length >= 2) ||
		(activeInput === "to" && toText.length >= 2);

	const filteredStations = useMemo(() => {
		const query = activeInput === "from" ? fromText : toText;
		if (!query || query.length < 2) return [];

		const exactMatches: typeof STATIONS = [];
		const startsWithMatches: typeof STATIONS = [];
		const containsMatches: typeof STATIONS = [];

		const searchLower = query.toLowerCase();

		STATIONS.forEach((station) => {
			const stationLower = station.name.toLowerCase();
			if (stationLower === searchLower) {
				exactMatches.push(station);
			} else if (stationLower.startsWith(searchLower)) {
				startsWithMatches.push(station);
			} else if (stationLower.includes(searchLower)) {
				containsMatches.push(station);
			}
		});

		const combined = [
			...exactMatches,
			...startsWithMatches,
			...containsMatches,
		];
		return Array.from(new Set(combined));
	}, [activeInput, fromText, toText]);

	return (
		<View className="relative flex-col gap-2" style={{ zIndex: 200 }}>
			<View className={`${Platform.OS === "web" ? "relative " : ""}flex-col gap-2`}>
				<View className="rounded-2xl border border-neutral-200 bg-white flex-row items-center px-4 h-[56px] overflow-visible">
					<Pressable
						className="flex-1 justify-center"
						onPress={() => {
							setActiveInput("from");
							fromInputRef.current?.focus();
						}}
					>
						{(activeInput === "from" || fromText.length > 0) && (
							<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
								Partenza
							</ThemedText>
						)}
						<View
							className={`relative w-full ${
								activeInput === "from" || fromText.length > 0 ? "mt-1" : ""
							}`}
						>
							<TextInput
								ref={fromInputRef}
								className={`w-full text-[14px] text-neutral-950 p-0 m-0 ${
									fromText
										? "font-google-sans-semibold"
										: "font-google-sans-medium"
								} ${activeInput !== "from" && fromText ? "opacity-0" : "opacity-100"}`}
								placeholder={
									activeInput === "from" || fromText.length > 0 ? "" : "Partenza"
								}
								placeholderTextColor="#6b7280"
								value={fromText}
								onChangeText={(val) => {
									setFromText(val);
									setActiveInput("from");
									setLastActiveInput("from");
								}}
								onFocus={() => {
									setActiveInput("from");
									setLastActiveInput("from");
								}}
							/>
							{activeInput !== "from" && fromText ? (
								<View
									pointerEvents="none"
									className="absolute inset-0 justify-center"
								>
									<ThemedText
										numberOfLines={1}
										className="text-[14px] font-google-sans-semibold !text-neutral-950"
									>
										{fromText}
									</ThemedText>
								</View>
							) : null}
						</View>
					</Pressable>

					<Pressable
						onPress={() => {
							const temp = fromText;
							setFromText(toText);
							setToText(temp);
							if (onSearchComplete && temp && toText) {
								onSearchComplete(toText, temp);
							}
						}}
						className="h-10 w-10 bg-[#F0F7F7] border border-[#DCEBEB] rounded-full items-center justify-center mx-2 z-50"
					>
						<Icon name="swap_horiz" size={24} className="!text-primary-500" />
					</Pressable>

					<Pressable
						className="flex-1 justify-center ml-2"
						onPress={() => {
							setActiveInput("to");
							toInputRef.current?.focus();
						}}
					>
						{(activeInput === "to" || toText.length > 0) && (
							<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
								Arrivo
							</ThemedText>
						)}
						<View
							className={`relative w-full ${
								activeInput === "to" || toText.length > 0 ? "mt-1" : ""
							}`}
						>
							<TextInput
								ref={toInputRef}
								className={`w-full text-[14px] text-left text-neutral-950 p-0 m-0 ${
									toText
										? "font-google-sans-semibold"
										: "font-google-sans-medium"
								} ${activeInput !== "to" && toText ? "opacity-0" : "opacity-100"}`}
								placeholder={
									activeInput === "to" || toText.length > 0 ? "" : "Arrivo"
								}
								placeholderTextColor="#6b7280"
								value={toText}
								onChangeText={(val) => {
									setToText(val);
									setActiveInput("to");
									setLastActiveInput("to");
								}}
								onFocus={() => {
									setActiveInput("to");
									setLastActiveInput("to");
								}}
							/>
							{activeInput !== "to" && toText ? (
								<View
									pointerEvents="none"
									className="absolute inset-0 justify-center"
								>
									<ThemedText
										numberOfLines={1}
										className="text-[14px] font-google-sans-semibold !text-neutral-950"
									>
										{toText}
									</ThemedText>
								</View>
							) : null}
						</View>
					</Pressable>
				</View>
			</View>

			{/* Dropdown Suggestions */}
			<DropdownMenu isVisible={!!activeInput} className="top-[60px] left-0 right-0">
				{showSuggestions ? (
					<FlatList
						data={filteredStations}
						keyExtractor={(item, index) => `${item}-${index}`}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingTop: 12,
							paddingBottom: 4,
						}}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						windowSize={5}
						ListHeaderComponent={<SectionHeader title="SUGGERIMENTI" />}
						ListEmptyComponent={
							<View className="py-6 items-center justify-center">
								<ThemedText className="text-[14px] font-google-sans-regular !text-neutral-400 text-center">
									Nessuna stazione corrispondente
								</ThemedText>
							</View>
						}
						renderItem={({ item, index }) => (
							<SearchListItem
								iconName="train"
								text={item.name}
								showBorder={index < filteredStations.length - 1}
								weight={300}
								onPress={() => handleStationSelect(item.name)}
							/>
						)}
					/>
				) : (
					<FlatList
						data={STATIONS}
						keyExtractor={(item, index) => `${item.name}-${index}`}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingTop: 8,
							paddingBottom: 16,
						}}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						windowSize={5}
						ListHeaderComponent={
							<View className="pb-4">
								<SearchListItem
									iconName="my_location"
									text="Milano Centrale"
									className="!px-0"
									weight={300}
									onPress={() => handleStationSelect("Milano Centrale")}
								/>
								<View className="mt-4">
									<SectionHeader title="TRATTE SALVATE" />
									{SAVED_SEARCHES.map((item, index) => {
										const route = `${item.from} - ${item.to}`;
										return (
											<SearchListItem
												key={index}
												iconName="route"
												secondaryIconName="bookmark"
												text={route}
												weight={300}
												onPress={() => handleRouteSelect(item.from, item.to)}
											/>
										);
									})}
								</View>
								<View className="mt-4">
									<SectionHeader title="RICERCHE RECENTI" />
									{RECENT_SEARCHES.map((item, index) => {
										const route = `${item.from} - ${item.to}`;
										return (
											<SearchListItem
												key={index}
												iconName="schedule"
												secondaryIconName="arrow_forward"
												text={route}
												weight={300}
												onPress={() => handleRouteSelect(item.from, item.to)}
											/>
										);
									})}
								</View>
								<View className="mt-6 mb-2">
									<SectionHeader title="TUTTE LE STAZIONI" />
								</View>
							</View>
						}
						renderItem={({ item, index }) => (
							<SearchListItem
								iconName="train"
								text={item.name}
								showBorder={index < STATIONS.length - 1}
								weight={300}
								onPress={() => handleStationSelect(item.name)}
							/>
						)}
					/>
				)}
			</DropdownMenu>
		</View>
	);
}
