import { selectedSolutionCache } from "@/api/search";
import AmazonPayLogo from "@/assets/logos/others/amazon_pay.svg";
import ApplePayLogo from "@/assets/logos/others/apple_pay.svg";
import MyBankLogo from "@/assets/logos/others/mybank.svg";
import PaypalLogo from "@/assets/logos/others/paypal.svg";
import SatispayLogo from "@/assets/logos/others/satispay.svg";
import { BottomSheet } from "@/components/modals/bottom-sheet";
import { TravelSolutionCard } from "@/components/search/travel-solution-card";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { USER_DATA } from "@/constants/user";
import { getGlobalSelectionList } from "@/utils/selection-store";
import { addPurchasedTrip, pendingPassengers } from "@/utils/trips-store";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Switch, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PaymentScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const totalPrice = parseFloat((params.price as string) || "61.60");

	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [invoiceRequested, setInvoiceRequested] = useState(false);
	const [isOtherMethodsOpen, setIsOtherMethodsOpen] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState("card");
	const [isProcessing, setIsProcessing] = useState(false);
	const [expandedTickets, setExpandedTickets] = useState<
		Record<number, boolean>
	>({});
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const globalSelectionList = getGlobalSelectionList();
	const passengers = globalSelectionList.filter(
		(p) => p.itemType === "passenger",
	);
	const passengerCount = Math.max(1, passengers.length);
	const animalCount = globalSelectionList.filter(
		(p) => p.itemType === "service" && p.type === "Animale",
	).length;
	const bikeCount = globalSelectionList.filter(
		(p) => p.itemType === "service" && p.type === "Bicicletta",
	).length;

	const toggleTicket = (idx: number) => {
		setExpandedTickets((prev) => ({
			...prev,
			[idx]: !prev[idx],
		}));
	};

	const calculateDuration = (start: string, end: string) => {
		const [sh, sm] = start.split(":").map(Number);
		const [eh, em] = end.split(":").map(Number);
		let diff = eh * 60 + em - (sh * 60 + sm);
		if (diff < 0) diff += 24 * 60;
		const h = Math.floor(diff / 60);
		const m = diff % 60;
		return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim();
	};

	const solution = selectedSolutionCache;
	const trains = solution?.trains || [];
	const dateStr = params.dateStr as string;
	const departureDate = dateStr ? new Date(dateStr) : new Date();
	const ddMMyyyy = `${String(departureDate.getDate()).padStart(2, "0")}/${String(departureDate.getMonth() + 1).padStart(2, "0")}/${departureDate.getFullYear()}`;

	const renderSelectedLogo = () => {
		switch (selectedMethod) {
			case "paypal":
				return (
					<PaypalLogo
						width={80}
						height={24}
						preserveAspectRatio="xMinYMid meet"
					/>
				);
			case "apple_pay":
				return (
					<ApplePayLogo
						width={64}
						height={20}
						preserveAspectRatio="xMinYMid meet"
					/>
				);
			case "satispay":
				return (
					<SatispayLogo
						width={80}
						height={24}
						preserveAspectRatio="xMinYMid meet"
					/>
				);
			case "amazon_pay":
				return (
					<AmazonPayLogo
						width={80}
						height={24}
						preserveAspectRatio="xMinYMid meet"
					/>
				);
			case "mybank":
				return (
					<MyBankLogo
						width={90}
						height={28}
						preserveAspectRatio="xMinYMid meet"
					/>
				);
			default:
				return (
					<ThemedText className="text-[15px] font-google-sans-semibold !text-gray-950">
						Altri metodi di pagamento
					</ThemedText>
				);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<Stack.Screen options={{ headerShown: false }} />
			<PageHeader title="Pagamento" showBackButton={true} />

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				{/* Riepilogo Section */}
				<View className="px-5 mt-6 mb-2">
					<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
						Riepilogo
					</ThemedText>
				</View>
				<View className="px-4 pb-4 bg-white">
					{trains.map((train: any, idx: number) => {
						const isExpanded = expandedTickets[idx];
						const unitPrice = (train.price || 0) / passengerCount;
						const ticketTotal =
							(train.price || 0) + bikeCount * 5.0 + animalCount * 5.0;

						return (
							<Animated.View
								key={idx}
								className="bg-transparent mb-4"
								layout={LinearTransition}
							>
								<View style={{ zIndex: 10, elevation: 10 }}>
									<TravelSolutionCard
										solution={{
											id: `ticket-${idx}`,
											departureTime:
												train.departureTime ||
												solution?.departureTime ||
												"00:00",
											arrivalTime:
												train.arrivalTime || solution?.arrivalTime || "00:00",
											duration: calculateDuration(
												train.departureTime ||
													solution?.departureTime ||
													"00:00",
												train.arrivalTime || solution?.arrivalTime || "00:00",
											),
											trains: [train],
											price: ticketTotal,
											serviceClass: train.selectedClass || "Standard",
											offerName: train.selectedOffer || "Base",
										}}
										route={{
											from: train.origin || solution?.origin,
											to: train.destination || solution?.destination,
										}}
										searchDate={departureDate}
										isSelectOfferMode={true}
										selectOfferModeProps={{
											dateStr: calculateDuration(
												train.departureTime ||
													solution?.departureTime ||
													"00:00",
												train.arrivalTime || solution?.arrivalTime || "00:00",
											),
											passengerName: ddMMyyyy,
											isExpanded,
										}}
										onPress={() => toggleTicket(idx)}
									/>
								</View>

								<Animated.View
									style={{
										zIndex: 1,
										elevation: 1,
										marginTop: -16,
										overflow: "hidden",
									}}
									className="bg-white rounded-b-2xl border-x border-b border-gray-200"
									layout={LinearTransition}
								>
									<View style={{ height: 16 }} />
									{isExpanded && (
										<Animated.View
											entering={FadeIn.duration(200)}
											exiting={FadeOut.duration(200)}
										>
											<View className="px-4 pb-4 pt-3 gap-3">
												<View className="flex-row items-center justify-between">
													<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
														{passengerCount === 1 ? "Passeggero" : "Passeggeri"}
													</ThemedText>
													<ThemedText className="text-[15px] font-google-sans-regular !text-gray-900">
														{passengerCount} x{" "}
														<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
															€ {unitPrice.toFixed(2).replace(".", ",")}
														</ThemedText>
													</ThemedText>
												</View>

												{bikeCount > 0 && (
													<View className="flex-row items-center justify-between">
														<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
															{bikeCount === 1 ? "Bicicletta" : "Biciclette"}
														</ThemedText>
														<ThemedText className="text-[15px] font-google-sans-regular !text-gray-900">
															{bikeCount} x{" "}
															<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
																€ 5,00
															</ThemedText>
														</ThemedText>
													</View>
												)}

												{animalCount > 0 && (
													<View className="flex-row items-center justify-between">
														<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
															{animalCount === 1 ? "Animale" : "Animali"}
														</ThemedText>
														<ThemedText className="text-[15px] font-google-sans-regular !text-gray-900">
															{animalCount} x{" "}
															<ThemedText className="text-[15px] font-google-sans-bold !text-gray-900">
																€ 5,00
															</ThemedText>
														</ThemedText>
													</View>
												)}
											</View>
										</Animated.View>
									)}
								</Animated.View>
							</Animated.View>
						);
					})}
				</View>

				<Animated.View
					layout={LinearTransition}
					className="bg-white flex-1 pt-2"
				>
					{/* Pagamento */}
					<View className="px-5 mt-4 mb-2">
						<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500">
							Metodo di pagamento
						</ThemedText>
					</View>

					{/* Metodi di pagamento Cards */}
					<View className="px-5 gap-4">
						<View className="gap-2">
							{/* Card 1: Carte di credito */}
							<Pressable
								className={`min-h-[60px] rounded-2xl border p-4 flex-row items-center justify-between ${selectedMethod === "card" ? "border-primary-500 bg-primary-500/10" : "border-gray-200 bg-white/5"}`}
								onPress={() => setSelectedMethod("card")}
							>
								<View className="flex-row items-center">
									<ThemedText className="text-[15px] font-google-sans-semibold !text-gray-950">
										Carta di debito o credito
									</ThemedText>
								</View>
								<View
									className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "card" ? "border-primary-500" : "border-gray-300"}`}
								>
									{selectedMethod === "card" && (
										<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
									)}
								</View>
							</Pressable>
						</View>

						{/* Card 2: Altri metodi */}
						<View className="gap-2">
							<AnimatedPressable
								layout={LinearTransition}
								className={`rounded-2xl border p-4 overflow-hidden ${selectedMethod !== "card" ? "border-primary-500" : "border-gray-200"} ${selectedMethod !== "card" && !isOtherMethodsOpen ? "bg-primary-500/10" : "bg-white/5"} transition-colors duration-300`}
								onPress={() => setIsOtherMethodsOpen(!isOtherMethodsOpen)}
							>
								<View
									className={`flex-row items-center justify-between min-h-[28px] ${isOtherMethodsOpen ? "mb-3" : ""}`}
								>
									{renderSelectedLogo()}
									<Icon
										name={isOtherMethodsOpen ? "expand_less" : "expand_more"}
										size={24}
										color="#4b5563"
									/>
								</View>

								{isOtherMethodsOpen && (
									<Animated.View
										entering={FadeIn}
										exiting={FadeOut}
										className="flex-col gap-5 mt-1 pt-4 border-t border-gray-100"
									>
										{/* PayPal */}
										<Pressable
											className="flex-row items-center justify-between"
											onPress={() => {
												setSelectedMethod("paypal");
												setIsOtherMethodsOpen(false);
											}}
										>
											<View className="flex-row items-center">
												<PaypalLogo
													width={80}
													height={24}
													preserveAspectRatio="xMinYMid meet"
												/>
											</View>
											<View
												className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "paypal" ? "border-primary-500" : "border-gray-300"}`}
											>
												{selectedMethod === "paypal" && (
													<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
												)}
											</View>
										</Pressable>

										{/* Apple Pay */}
										<Pressable
											className="flex-row items-center justify-between"
											onPress={() => {
												setSelectedMethod("apple_pay");
												setIsOtherMethodsOpen(false);
											}}
										>
											<View className="flex-row items-center">
												<ApplePayLogo
													width={64}
													height={20}
													preserveAspectRatio="xMinYMid meet"
												/>
											</View>
											<View
												className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "apple_pay" ? "border-primary-500" : "border-gray-300"}`}
											>
												{selectedMethod === "apple_pay" && (
													<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
												)}
											</View>
										</Pressable>

										{/* Satispay */}
										<Pressable
											className="flex-row items-center justify-between"
											onPress={() => {
												setSelectedMethod("satispay");
												setIsOtherMethodsOpen(false);
											}}
										>
											<View className="flex-row items-center">
												<SatispayLogo
													width={80}
													height={24}
													preserveAspectRatio="xMinYMid meet"
												/>
											</View>
											<View
												className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "satispay" ? "border-primary-500" : "border-gray-300"}`}
											>
												{selectedMethod === "satispay" && (
													<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
												)}
											</View>
										</Pressable>

										{/* Amazon Pay */}
										<Pressable
											className="flex-row items-center justify-between"
											onPress={() => {
												setSelectedMethod("amazon_pay");
												setIsOtherMethodsOpen(false);
											}}
										>
											<View className="flex-row items-center">
												<AmazonPayLogo
													width={80}
													height={24}
													preserveAspectRatio="xMinYMid meet"
												/>
											</View>
											<View
												className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "amazon_pay" ? "border-primary-500" : "border-gray-300"}`}
											>
												{selectedMethod === "amazon_pay" && (
													<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
												)}
											</View>
										</Pressable>

										{/* MyBank */}
										<Pressable
											className="flex-row items-center justify-between"
											onPress={() => {
												setSelectedMethod("mybank");
												setIsOtherMethodsOpen(false);
											}}
										>
											<View className="flex-row items-center">
												<MyBankLogo
													width={90}
													height={28}
													preserveAspectRatio="xMinYMid meet"
												/>
											</View>
											<View
												className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "mybank" ? "border-primary-500" : "border-gray-300"}`}
											>
												{selectedMethod === "mybank" && (
													<View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
												)}
											</View>
										</Pressable>
									</Animated.View>
								)}
							</AnimatedPressable>
						</View>
					</View>

					{/* Credito elettronico */}
					<View className="px-5 mt-4">
						<AnimatedPressable
							layout={LinearTransition}
							onPress={() =>
								router.push({
									pathname: "/electronic-credit" as any,
									params: { endTime },
								})
							}
							className="min-h-[60px] rounded-2xl border p-4 border-gray-200 bg-white/5 flex-row items-center justify-center"
						>
							<View className="flex-row items-center">
								<Icon
									name="featured_seasonal_and_gifts"
									size={24}
									color="#006666"
									className="mr-3"
									weight={300}
								/>
								<ThemedText className="text-[15px] font-google-sans-bold !text-primary-500">
									Aggiungi sconto o carta regalo
								</ThemedText>
							</View>
						</AnimatedPressable>
					</View>

					<Animated.View layout={LinearTransition}>
						{/* Fattura */}
						<View className="px-5 mt-8 mb-6 flex-row items-center justify-between">
							<View className="flex-row items-center">
								<ThemedText className="text-[15px] font-google-sans-medium !text-gray-950 mr-1.5">
									Voglio la fattura
								</ThemedText>
								<Icon name="info" size={16} color="#9ca3af" />
							</View>
							<View
								className={
									Platform.OS === "ios" ? "bg-gray-200 rounded-full" : ""
								}
							>
								<Switch
									value={invoiceRequested}
									onValueChange={setInvoiceRequested}
									trackColor={{ false: "#e5e7eb", true: "#006666" }}
									thumbColor={"#ffffff"}
									className={Platform.OS === "ios" ? "-mr-0.5" : ""}
								/>
							</View>
						</View>

						{/* Terms */}
						<View className="px-5 mb-8">
							<View className="flex-row items-start mb-3">
								<Pressable
									onPress={() => setAcceptedTerms(!acceptedTerms)}
									className={`h-5 w-5 rounded items-center justify-center border mt-0.5 mr-3 ${
										acceptedTerms
											? "bg-primary-500 border-primary-500"
											: "border-gray-400"
									}`}
								>
									{acceptedTerms && (
										<Icon
											name="check"
											size={16}
											color="white"
											weight={600}
											style={{ marginTop: -2 }}
										/>
									)}
								</Pressable>
								<ThemedText className="flex-1 text-[13px] font-google-sans-medium !text-gray-600 leading-tight">
									Accetto le{" "}
									<ThemedText className="!text-[#c1152c] underline">
										condizioni di trasporto
									</ThemedText>{" "}
									del vettore ed ho preso visione dell&apos;informativa per la{" "}
									<ThemedText className="!text-[#c1152c] underline">
										protezione dei dati personali
									</ThemedText>
									.
								</ThemedText>
							</View>

							<View className="ml-8 mb-2">
								<ThemedText className="text-[13px] font-google-sans-medium !text-gray-600">
									Stai acquistando un biglietto cumulativo.{"\n"}
									<ThemedText className="!text-[#c1152c] underline">
										Maggiori info
									</ThemedText>
								</ThemedText>
							</View>

							<View className="ml-8">
								<ThemedText className="text-[13px] font-google-sans-medium !text-gray-600">
									Consulta le modifiche alla circolazione.
								</ThemedText>
							</View>
						</View>
					</Animated.View>
				</Animated.View>
			</ScrollView>

			<StickyFooter
				totalPrice={totalPrice}
				basePrice={0}
				buttonTitle={isProcessing ? "Elaborazione" : "Paga ora"}
				isLoading={isProcessing}
				subtitle="Totale"
				hideSeatSelection={true}
				disabled={!acceptedTerms || isProcessing}
				onPress={() => {
					setIsProcessing(true);
					setTimeout(() => {
						setIsProcessing(false);

						if (selectedSolutionCache && params.isAddService !== "true") {
							const sol = selectedSolutionCache;
							const generateCode = (len: number) => {
								const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
								let res = "";
								for (let i = 0; i < len; i++)
									res += chars.charAt(Math.floor(Math.random() * chars.length));
								return res;
							};
							const generateNumCode = (len: number) => {
								const chars = "0123456789";
								let res = "";
								for (let i = 0; i < len; i++)
									res += chars.charAt(Math.floor(Math.random() * chars.length));
								return res;
							};

							const passengersList =
								pendingPassengers.length > 0
									? pendingPassengers
									: [`${USER_DATA.firstName} ${USER_DATA.lastName}`];

							const enrichedTrains: any[] = [];

							passengersList.forEach((passengerName) => {
								sol.trains.forEach((train: any) => {
									const isRegionale =
										train.type === "Regionale" ||
										train.type?.toLowerCase().includes("reg");
									enrichedTrains.push({
										...train,
										passengerName,
										pnr: generateCode(6),
										cp: isRegionale ? undefined : generateNumCode(6),
										coach: isRegionale
											? undefined
											: (Math.floor(Math.random() * 11) + 1).toString(),
										seat: isRegionale
											? undefined
											: `${Math.floor(Math.random() * 18) + 1}${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}`,
									});
								});
							});

							let finalDate = sol.date;
							if (sol.date && sol.departureTime) {
								const dateObj = new Date(sol.date);
								const [hh, mm] = sol.departureTime.split(":").map(Number);
								if (!isNaN(hh) && !isNaN(mm)) {
									dateObj.setHours(hh, mm, 0, 0);
									finalDate = dateObj.toISOString();
								}
							}

							addPurchasedTrip({
								id: Math.random().toString(36).substring(7),
								date: finalDate,
								departureTime: sol.departureTime,
								arrivalTime: sol.arrivalTime,
								duration: sol.duration,
								price: sol.price,
								offerName: sol.offerName,
								trains: enrichedTrains,
							});
						}

						setShowSuccessModal(true);
					}, 3500);
				}}
			/>

			<BottomSheet
				isVisible={showSuccessModal}
				onClose={() => {}}
				hideCloseButton={true}
			>
				<View className="items-center pb-8 pt-4">
					<Icon name="verified" size={80} color="#006666" />
					<ThemedText className="text-[24px] font-google-sans-bold !text-primary-500 mt-6 mb-2 text-center">
						Acquisto effettuato!
					</ThemedText>
					<ThemedText className="text-[16px] font-google-sans-regular !text-gray-600 text-center px-4 mb-8">
						A breve riceverai una mail con il tuo biglietto
					</ThemedText>

					<View className="flex-row items-center w-full gap-3 mt-4">
						<Pressable
							className="flex-1 py-3.5 rounded-xl border border-gray-300 items-center justify-center bg-white"
							onPress={() => {
								setShowSuccessModal(false);
								router.dismissAll();
							}}
						>
							<ThemedText className="text-[16px] font-google-sans-bold !text-gray-900">
								Vai alla home
							</ThemedText>
						</Pressable>
						<Pressable
							className="flex-1 py-3.5 rounded-xl bg-primary-500 items-center justify-center"
							onPress={() => {
								setShowSuccessModal(false);
								router.dismissAll();
								setTimeout(() => router.navigate("/(tabs)/trips" as any), 100);
							}}
						>
							<ThemedText className="text-[16px] font-google-sans-bold !text-white">
								Vai ai miei viaggi
							</ThemedText>
						</Pressable>
					</View>
				</View>
			</BottomSheet>
		</View>
	);
}
