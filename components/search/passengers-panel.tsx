import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { getInitials } from "@/constants/user";
import { SelectionItem } from "@/utils/selection-store";
import { useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
						onFocus={() => setFocusedInputId(inputId)}
						onBlur={() => setFocusedInputId(null)}
						className={`w-full text-[14px] text-neutral-950 p-0 m-0 ${
							hasText ? "font-google-sans-semibold" : "font-google-sans-medium"
						} ${!isFocused && hasText ? "opacity-0" : "opacity-100"}`}
						placeholder={isActive ? "" : label}
						placeholderTextColor="#6b7280"
						keyboardType={keyboardType}
						autoCapitalize={autoCapitalize}
					/>
					{!isFocused && hasText && (
						<View
							pointerEvents="none"
							className="absolute inset-0 justify-center"
						>
							<ThemedText
								numberOfLines={1}
								className="text-[14px] font-google-sans-semibold !text-neutral-950"
							>
								{value}
							</ThemedText>
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
};

export function PassengersPanel({
	isVisible,
	onClose,
	passengersList,
	setPassengersList,
}: {
	isVisible: boolean;
	onClose: () => void;
	passengersList: SelectionItem[];
	setPassengersList: React.Dispatch<React.SetStateAction<SelectionItem[]>>;
}) {
	const insets = useSafeAreaInsets();
	const [expandedPassengerId, setExpandedPassengerId] = useState<string | null>(
		null,
	);
	const [showAddPassengerSheet, setShowAddPassengerSheet] = useState(false);
	const [newAdults, setNewAdults] = useState(0);
	const [newYouths, setNewYouths] = useState(0);
	const [newChildren, setNewChildren] = useState(0);
	const [focusedPassengerInputId, setFocusedPassengerInputId] = useState<
		string | null
	>(null);

	const adults = passengersList.filter((p) => p.type === "Adulto").length;
	const youths = passengersList.filter((p) => p.type === "Ragazzo").length;
	const children = passengersList.filter((p) => p.type === "Bambino").length;
	const bikes = passengersList.filter((p) => p.type === "Bicicletta").length;
	const animals = passengersList.filter((p) => p.type === "Animale").length;

	const formatName = (str: string) =>
		str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

	const addPassenger = () => {
		setNewAdults(0);
		setNewYouths(0);
		setNewChildren(0);
		setShowAddPassengerSheet(true);
	};

	const addBike = () => {
		setPassengersList((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				itemType: "service",
				type: "Bicicletta",
				name: "Bicicletta",
			},
		]);
	};

	const addAnimal = () => {
		setPassengersList((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				itemType: "service",
				type: "Animale",
				name: "Animale",
			},
		]);
	};

	return (
		<>
			{/* Passengers Full Screen Modal */}
			<Modal
				visible={isVisible}
				animationType="slide"
				presentationStyle="fullScreen"
				onRequestClose={onClose}
			>
				<View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
					{/* Header */}
					<View className="bg-white px-4 pb-3 pt-2 flex-row items-center justify-between">
						<View className="flex-1 items-start justify-center">
							<Pressable onPress={onClose} className="p-1 -ml-1">
								<Icon name="close" size={26} className="!text-neutral-900" />
							</Pressable>
						</View>
						<View className="flex-[2] items-center justify-center">
							<ThemedText className="text-[18px] font-google-sans-bold !text-primary-500 text-center">
								Passeggeri
							</ThemedText>
						</View>
						<View className="flex-1" />
					</View>

					<KeyboardAvoidingView
						className="flex-1 bg-white"
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						keyboardVerticalOffset={0} /* force reload */
					>
						<ScrollView
							className="flex-1"
							contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
						>
							{/* Aggiungi */}
							<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500 mb-2">
								Aggiungi
							</ThemedText>

							<Pressable
								onPress={addPassenger}
								className="flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 mb-3 active:opacity-70"
							>
								<View className="flex-row items-start justify-between">
									<Icon
										name="person_outline"
										size={24}
										className="!text-primary-500 -ml-0.5"
									/>
									<Icon name="add" size={24} className="!text-primary-500" />
								</View>
								<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
									Persona
								</ThemedText>
							</Pressable>

							<View className="flex-row gap-3 mb-8">
								<Pressable
									onPress={addBike}
									className="flex-1 flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 active:opacity-70"
								>
									<View className="flex-row items-start justify-between">
										<Icon
											name="pedal_bike"
											size={24}
											className="!text-primary-500 ml-0.5"
										/>
										<Icon name="add" size={24} className="!text-primary-500" />
									</View>
									<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
										Bicicletta
									</ThemedText>
								</Pressable>
								<Pressable
									onPress={addAnimal}
									className="flex-1 flex-col bg-[#F0F7F7] border border-[#DCEBEB] rounded-xl p-4 active:opacity-70"
								>
									<View className="flex-row items-start justify-between">
										<Icon
											name="pet_supplies"
											size={24}
											className="!text-primary-500"
										/>
										<Icon name="add" size={24} className="!text-primary-500" />
									</View>
									<ThemedText className="text-[16px] font-google-sans-semibold !text-primary-500">
										Animale
									</ThemedText>
								</Pressable>
							</View>

							{/* Riepilogo */}
							<View className="flex-row items-center justify-between mb-2 mt-4">
								<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
									Riepilogo
								</ThemedText>
								<View className="flex-row items-center gap-3">
									{passengersList.filter((p) => p.itemType === "passenger")
										.length > 0 && (
										<View className="flex-row items-center gap-1">
											<Icon
												name="person_outline"
												size={18}
												className="!text-neutral-600"
											/>
											<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-700">
												{
													passengersList.filter(
														(p) => p.itemType === "passenger",
													).length
												}
											</ThemedText>
										</View>
									)}
									{passengersList.filter((p) => p.type === "Bicicletta")
										.length > 0 && (
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
												{
													passengersList.filter((p) => p.type === "Animale")
														.length
												}
											</ThemedText>
										</View>
									)}
								</View>
							</View>

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
											onPress={() =>
												setExpandedPassengerId(isExpanded ? null : item.id)
											}
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
																	: "pet_supplies"
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
																: item.name}
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
														transform: [
															{ rotate: isExpanded ? "180deg" : "0deg" },
														],
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
										{isExpanded && (
											<View className="mt-4">
												{item.itemType === "passenger" && (
													<>
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
																			p.id === item.id
																				? { ...p, firstName: text }
																				: p,
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
																			p.id === item.id
																				? { ...p, lastName: text }
																				: p,
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
																			p.id === item.id
																				? { ...p, birthDate: text }
																				: p,
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
																			p.id === item.id
																				? { ...p, phone: text }
																				: p,
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
																			p.id === item.id
																				? { ...p, email: text }
																				: p,
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
													</>
												)}

												<View
													className={`flex-row justify-end items-center gap-2`}
												>
													{!item.isMock && (
														<Pressable
															className="flex-row items-center bg-rose-50 px-3 py-2 rounded-lg"
															onPress={() => {
																setPassengersList((prev) =>
																	prev.filter((p) => p.id !== item.id),
																);
																setExpandedPassengerId(null);
															}}
														>
															<Icon
																name="delete"
																size={18}
																className="!text-rose-500 mr-1"
															/>
															<ThemedText className="text-[14px] font-google-sans-medium !text-rose-500">
																Rimuovi
															</ThemedText>
														</Pressable>
													)}
													{item.itemType === "passenger" && (
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
													)}
													{item.itemType === "passenger" && (
														<Pressable
															className="flex-row items-center bg-[#E0F2F1] px-4 py-2 rounded-lg"
															onPress={() => setExpandedPassengerId(null)}
														>
															<Icon
																name="bookmark"
																size={18}
																className="!text-primary-600 mr-1"
															/>
															<ThemedText className="text-[14px] font-google-sans-medium !text-primary-600">
																Salva
															</ThemedText>
														</Pressable>
													)}
												</View>
											</View>
										)}
									</View>
								);
							})}
						</ScrollView>
					</KeyboardAvoidingView>

					<View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 pb-10">
						<MainButton title="Conferma" onPress={onClose} />
					</View>
				</View>
				<BottomSheet
					isVisible={showAddPassengerSheet}
					onClose={() => setShowAddPassengerSheet(false)}
					title="Passeggeri"
				>
					{/* Passengers Rows */}
					<View className="mb-8">
						<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
							<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
								Adulti
							</ThemedText>
							<View className="flex-row items-center gap-4">
								<Pressable
									onPress={() => setNewAdults(Math.max(0, newAdults - 1))}
									className={`h-10 w-10 items-center justify-center rounded-full ${
										newAdults <= 0 ? "bg-neutral-200" : "bg-primary-500"
									}`}
								>
									<Icon name="remove" size={24} className="!text-white" />
								</Pressable>
								<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
									{newAdults}
								</ThemedText>
								<Pressable
									onPress={() => setNewAdults(newAdults + 1)}
									className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
								>
									<Icon name="add" size={24} className="!text-white" />
								</Pressable>
							</View>
						</View>

						<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
							<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
								Ragazzi
							</ThemedText>
							<View className="flex-row items-center gap-4">
								<Pressable
									onPress={() => setNewYouths(Math.max(0, newYouths - 1))}
									className={`h-10 w-10 items-center justify-center rounded-full ${
										newYouths <= 0 ? "bg-neutral-200" : "bg-primary-500"
									}`}
								>
									<Icon name="remove" size={24} className="!text-white" />
								</Pressable>
								<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
									{newYouths}
								</ThemedText>
								<Pressable
									onPress={() => setNewYouths(newYouths + 1)}
									className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
								>
									<Icon name="add" size={24} className="!text-white" />
								</Pressable>
							</View>
						</View>

						<View className="flex-row items-center justify-between py-7 border-b border-neutral-100">
							<View className="flex-row items-center">
								<ThemedText className="text-[16px] font-google-sans-medium !text-neutral-950">
									Bambini
								</ThemedText>
								<ThemedText className="ml-2 text-[14px] font-google-sans-medium !text-neutral-500">
									(0-4 anni non compiuti)
								</ThemedText>
							</View>
							<View className="flex-row items-center gap-4">
								<Pressable
									onPress={() => setNewChildren(Math.max(0, newChildren - 1))}
									className={`h-10 w-10 items-center justify-center rounded-full ${
										newChildren <= 0 ? "bg-neutral-200" : "bg-primary-500"
									}`}
								>
									<Icon name="remove" size={24} className="!text-white" />
								</Pressable>
								<ThemedText className="text-[16px] font-google-sans-bold w-4 text-center">
									{newChildren}
								</ThemedText>
								<Pressable
									onPress={() => setNewChildren(newChildren + 1)}
									className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
								>
									<Icon name="add" size={24} className="!text-white" />
								</Pressable>
							</View>
						</View>
					</View>

					<MainButton
						title={`Aggiungi ${newAdults + newYouths + newChildren} ${
							newAdults + newYouths + newChildren === 1
								? "passeggero"
								: "passeggeri"
						}`}
						onPress={() => {
							if (newAdults + newYouths + newChildren > 0) {
								setPassengersList((prev) => {
									const newItems: SelectionItem[] = [];
									const currentPassCount = prev.filter(
										(p) => p.itemType === "passenger",
									).length;
									let nextIndex = currentPassCount + 1;

									for (let i = 0; i < newAdults; i++) {
										newItems.push({
											id: Math.random().toString(),
											itemType: "passenger",
											type: "Adulto",
											name: `Passeggero ${nextIndex++}`,
										});
									}
									for (let i = 0; i < newYouths; i++) {
										newItems.push({
											id: Math.random().toString(),
											itemType: "passenger",
											type: "Ragazzo",
											name: `Passeggero ${nextIndex++}`,
										});
									}
									for (let i = 0; i < newChildren; i++) {
										newItems.push({
											id: Math.random().toString(),
											itemType: "passenger",
											type: "Bambino",
											name: `Passeggero ${nextIndex++}`,
										});
									}

									return [...prev, ...newItems];
								});
								setShowAddPassengerSheet(false);
							}
						}}
						disabled={newAdults + newYouths + newChildren === 0}
						className="mb-8"
					/>
				</BottomSheet>
			</Modal>
		</>
	);
}
