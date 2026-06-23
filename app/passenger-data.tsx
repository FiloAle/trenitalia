import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { getInitials } from "@/constants/user";
import {
	getGlobalSelectionList,
	setGlobalSelectionList,
} from "@/utils/selection-store";
import { setPendingPassengers } from "@/utils/trips-store";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";

const PassengerInput = ({
	label,
	value,
	onChangeText,
	keyboardType = "default",
	autoCapitalize = "sentences",
	focusedInputId,
	setFocusedInputId,
	inputId,
}: {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	focusedInputId: string | null;
	setFocusedInputId: (id: string | null) => void;
	inputId: string;
}) => {
	const isFocused = focusedInputId === inputId;
	const hasText = value.length > 0;
	const isActive = isFocused || hasText;
	const inputRef = useRef<TextInput>(null);

	return (
		<View className="flex-1 h-[56px] rounded-2xl border border-neutral-200 px-4 bg-white justify-center overflow-visible">
			<Pressable
				className="w-full flex-1 justify-center"
				onPress={() => {
					setFocusedInputId(inputId);
					inputRef.current?.focus();
				}}
			>
				{isActive && (
					<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-500">
						{label}
					</ThemedText>
				)}
				<View className={`relative w-full ${isActive ? "mt-0.5" : ""}`}>
					<TextInput
						ref={inputRef}
						value={value}
						onChangeText={onChangeText}
						keyboardType={keyboardType}
						autoCapitalize={autoCapitalize}
						onFocus={() => setFocusedInputId(inputId)}
						onBlur={() => setFocusedInputId(null)}
						placeholder={!isActive ? label : ""}
						placeholderTextColor="#9ca3af"
						className={`text-[16px] font-google-sans-medium !text-neutral-950 p-0 m-0 ${
							Platform.OS === "web" ? "outline-none" : ""
						}`}
						style={{ includeFontPadding: false, height: 20 }}
					/>
				</View>
			</Pressable>
		</View>
	);
};

export default function PassengerDataScreen() {
	const params = useLocalSearchParams();
	const totalPrice = parseFloat((params.totalPrice as string) || "15");
	const basePrice = parseFloat((params.basePrice as string) || "15");

	const [endTime] = useState(() => Date.now() + 600 * 1000); // 10 minutes from now

	const [passengersList, setPassengersList] = useState(
		getGlobalSelectionList(),
	);
	const [expandedPassengerId, setExpandedPassengerId] = useState<string | null>(
		null,
	);
	const [focusedPassengerInputId, setFocusedPassengerInputId] = useState<
		string | null
	>(null);

	// Sync back to global store on change
	useEffect(() => {
		setGlobalSelectionList(passengersList);
	}, [passengersList]);

	// Update list when returning from add-services
	useFocusEffect(
		useCallback(() => {
			setPassengersList([...getGlobalSelectionList()]);
		}, []),
	);

	return (
		<View className="flex-1 bg-white">
			<PageHeader title="Dati passeggeri" showBackButton={true} />

			<ScrollView
				className="flex-1 bg-white"
				contentContainerStyle={{ paddingBottom: 160 }}
			>
				{/* Pulsante Aggiungi Servizi */}
				<View className="bg-white px-5 py-6">
					<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500 mb-2">
						Aggiungi
					</ThemedText>
					<Pressable
						onPress={() => {
							router.push({
								pathname: "/add-services" as any,
								params: {
									endTime: endTime,
									price: basePrice,
								},
							});
						}}
						className="flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 mb-3 active:opacity-70"
					>
						<View className="flex-row items-start justify-between">
							<Icon
								name="widgets"
								size={24}
								className="!text-primary-500 -ml-0.5"
							/>
							<Icon name="add" size={24} className="!text-primary-500" />
						</View>
						<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500 mt-2">
							Servizi aggiuntivi
						</ThemedText>
					</Pressable>
				</View>

				{/* Passeggeri Section */}
				<View className="bg-white pb-6 px-5">
					{/* Riepilogo Header */}
					<View className="flex-row items-center justify-between mb-4 mt-2">
						<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
							Riepilogo
						</ThemedText>
						<View className="flex-row items-center gap-3">
							{passengersList.filter((p) => p.itemType === "passenger").length >
								0 && (
								<View className="flex-row items-center gap-1">
									<Icon
										name="person_outline"
										size={18}
										className="!text-neutral-600"
									/>
									<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
										{
											passengersList.filter((p) => p.itemType === "passenger")
												.length
										}
									</ThemedText>
								</View>
							)}
							{passengersList.filter((p) => p.type === "Bicicletta").length >
								0 && (
								<View className="flex-row items-center gap-1">
									<Icon
										name="pedal_bike"
										size={18}
										className="!text-neutral-600"
									/>
									<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
										{
											passengersList.filter((p) => p.type === "Bicicletta")
												.length
										}
									</ThemedText>
								</View>
							)}
							{passengersList.filter((p) => p.type === "Animale").length >
								0 && (
								<View className="flex-row items-center gap-1">
									<Icon
										name="pet_supplies"
										size={18}
										className="!text-neutral-600"
									/>
									<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
										{passengersList.filter((p) => p.type === "Animale").length}
									</ThemedText>
								</View>
							)}
							{passengersList.filter(
								(p) =>
									p.itemType === "service" &&
									p.type !== "Animale" &&
									p.type !== "Bicicletta",
							).length > 0 && (
								<View className="flex-row items-center gap-1">
									<Icon name="scene" size={18} className="!text-neutral-600" />
									<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
										{
											passengersList.filter(
												(p) =>
													p.itemType === "service" &&
													p.type !== "Animale" &&
													p.type !== "Bicicletta",
											).length
										}
									</ThemedText>
								</View>
							)}
						</View>
					</View>

					{/* List Rendering */}
					{passengersList.map((item, idx) => {
						const isExpanded = expandedPassengerId === item.id;
						const hasName = !!(item.firstName || item.lastName);
						const passengerIndex =
							passengersList
								.filter((p) => p.itemType === "passenger")
								.findIndex((p) => p.id === item.id) + 1;

						return (
							<View
								key={item.id}
								className="flex-col py-4 border-b border-neutral-100"
							>
								<Pressable
									className="flex-row items-center justify-between"
									onPress={() => {
										if (item.itemType === "passenger") {
											setExpandedPassengerId(isExpanded ? null : item.id);
										}
									}}
								>
									<View className="flex-row items-center flex-1">
										{item.itemType === "passenger" ? (
											item.isMock && hasName ? (
												<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-4">
													<ThemedText className="!text-white font-google-sans-bold text-[16px]">
														{getInitials(
															item.firstName || "",
															item.lastName || "",
														)}
													</ThemedText>
												</View>
											) : (
												<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-4">
													<Icon
														name="person_outline"
														size={24}
														className="!text-white"
													/>
												</View>
											)
										) : (
											<View className="h-12 w-12 rounded-full border border-[#008888] items-center justify-center mr-4 bg-white">
												<Icon
													name={
														item.type === "Bicicletta"
															? "pedal_bike"
															: item.type === "Animale"
																? "pet_supplies"
																: "scene"
													}
													size={24}
													className="!text-[#008888]"
												/>
											</View>
										)}
										<View>
											<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-950">
												{hasName
													? `${item.firstName || ""} ${item.lastName || ""}`.trim()
													: item.itemType === "passenger"
														? `Passeggero ${passengerIndex}`
														: item.name || item.type}
											</ThemedText>
											<ThemedText className="text-[13px] font-google-sans-regular !text-neutral-500">
												{item.itemType === "service"
													? "Servizio aggiuntivo"
													: item.type}
											</ThemedText>
										</View>
									</View>
									{item.itemType === "passenger" ? (
										<Animated.View
											style={{
												transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
											}}
										>
											<Icon
												name="expand_more"
												size={24}
												className="!text-neutral-800"
											/>
										</Animated.View>
									) : (
										<Pressable
											onPress={(e) => {
												e.stopPropagation();
												setPassengersList((prev) =>
													prev.filter((p) => p.id !== item.id),
												);
											}}
											className="p-2 -mr-2"
										>
											<Icon
												name="delete"
												size={24}
												className="!text-[#c1152c]"
											/>
										</Pressable>
									)}
								</Pressable>
								{isExpanded && item.itemType === "passenger" && (
									<View className="mt-4">
										<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-950 mb-3">
											Dettagli passeggero
										</ThemedText>
										<View className="flex-row gap-2 mb-2">
											<PassengerInput
												label="Nome"
												value={item.firstName || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id ? { ...p, firstName: text } : p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-firstName`}
												autoCapitalize="words"
											/>
											<PassengerInput
												label="Cognome"
												value={item.lastName || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id ? { ...p, lastName: text } : p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-lastName`}
												autoCapitalize="words"
											/>
										</View>

										<View className="flex-row gap-2 mb-2">
											<PassengerInput
												label="Data di nascita"
												value={item.birthDate || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id ? { ...p, birthDate: text } : p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-birthDate`}
											/>
											<PassengerInput
												label="CartaFRECCIA"
												value={item.loyaltyCode || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id
																? { ...p, loyaltyCode: text }
																: p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-loyaltyCode`}
												keyboardType="numeric"
											/>
										</View>

										<View className="flex-row gap-2 mb-4">
											<PassengerInput
												label="Numero di telefono"
												value={item.phone || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id ? { ...p, phone: text } : p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-phone`}
												keyboardType="phone-pad"
											/>
											<PassengerInput
												label="Email"
												value={item.email || ""}
												onChangeText={(text) =>
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id ? { ...p, email: text } : p,
														),
													)
												}
												focusedInputId={focusedPassengerInputId}
												setFocusedInputId={setFocusedPassengerInputId}
												inputId={`${item.id}-email`}
												keyboardType="email-address"
												autoCapitalize="none"
											/>
										</View>

										<View className="flex-row justify-end items-center gap-2">
											<Pressable
												className="flex-row items-center bg-neutral-100 px-3 py-2 rounded-lg"
												onPress={() => {
													setPassengersList((prev) =>
														prev.map((p) =>
															p.id === item.id
																? {
																		...p,
																		firstName: "",
																		lastName: "",
																		birthDate: "",
																		loyaltyCode: "",
																		phone: "",
																		email: "",
																	}
																: p,
														),
													);
												}}
											>
												<Icon
													name="clear_all"
													size={18}
													className="!text-neutral-700 mr-1"
												/>
												<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-700">
													Svuota
												</ThemedText>
											</Pressable>
											<Pressable
												className="flex-row items-center bg-[#E0F2F1] px-4 py-2 rounded-lg"
												onPress={() => setExpandedPassengerId(null)}
											>
												<Icon
													name="bookmark_border"
													size={18}
													className="!text-primary-600 mr-1"
												/>
												<ThemedText className="text-[14px] font-google-sans-medium !text-primary-600">
													Salva
												</ThemedText>
											</Pressable>
										</View>
									</View>
								)}
							</View>
						);
					})}
				</View>
			</ScrollView>

			<StickyFooter
				totalPrice={
					totalPrice +
					passengersList.reduce((acc, p) => acc + (p.price || 0), 0)
				}
				basePrice={basePrice}
				buttonTitle="Conferma"
				hideSeatSelection={true}
				buttonClassName="w-[160px]"
				onPress={() => {
					const passengerNames = passengersList
						.filter((p) => p.itemType === "passenger")
						.map((p) => `${p.firstName || ""} ${p.lastName || ""}`.trim())
						.filter(Boolean);
					setPendingPassengers(passengerNames);
					router.push({
						pathname: "/payment" as any,
						params: {
							endTime: endTime,
							price:
								totalPrice +
								passengersList.reduce((acc, p) => acc + (p.price || 0), 0),
						},
					});
				}}
			/>
		</View>
	);
}
