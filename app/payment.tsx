import { CheckoutHeader } from "@/components/checkout-header";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { TimerBar } from "@/components/ui/timer-bar";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);
	const totalPrice = parseFloat((params.price as string) || "61.60");

	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [invoiceRequested, setInvoiceRequested] = useState(false);

	return (
		<View className="flex-1 bg-[#f3f4f6]">
			<Stack.Screen options={{ headerShown: false }} />
			<CheckoutHeader title="Pagamento" />

			<TimerBar endTime={endTime} />

			<ScrollView
				className="flex-1"
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				{/* Credito elettronico */}
				<Pressable 
					onPress={() => router.push({ pathname: "/electronic-credit" as any, params: { endTime } })}
					className="bg-white px-5 py-4 flex-row items-center justify-between mb-2"
				>
					<View className="flex-row items-center flex-1">
						<Icon name="redeem" size={24} color="#005045" className="mr-3" weight={300} />
						<View className="flex-1">
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
								Credito elettronico, carta regalo o bonus
							</ThemedText>
							<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500 mt-0.5">
								Hai crediti disponibili
							</ThemedText>
						</View>
					</View>
					<View className="ml-2">
						<Icon name="add" size={24} color="#4b5563" />
					</View>
				</Pressable>

				<View className="bg-white flex-1 pt-6">
					{/* Paga con */}
					<View className="px-5 mb-4">
						<ThemedText className="text-[17px] font-plus-jakarta-bold !text-gray-950">
							Paga con
						</ThemedText>
					</View>

					{/* Metodi di pagamento Cards */}
					<View className="px-5 gap-4">
						{/* Card 1: Carte di credito */}
						<View className="bg-white rounded-xl border border-[#005045] p-4 flex-row items-center justify-between">
							<View className="flex-row items-center gap-1">
								<ThemedText className="text-xl font-plus-jakarta-bold !text-[#1434CB] italic">
									VISA
								</ThemedText>
								<View className="w-6 h-4 bg-red-500 rounded-sm ml-1 flex items-center justify-center">
									<View className="w-3 h-3 bg-orange-400 rounded-full opacity-80" />
								</View>
								{/* Mock for other logos */}
								<View className="w-6 h-4 bg-blue-500 rounded-sm ml-1" />
								<View className="w-6 h-4 bg-cyan-400 rounded-sm ml-1" />
								<View className="w-6 h-4 bg-gray-800 rounded-sm ml-1" />
								<View className="w-6 h-4 bg-green-600 rounded-sm ml-1" />
							</View>
							<View className="h-5 w-5 rounded-full border-2 border-[#005045] items-center justify-center">
								<View className="h-2.5 w-2.5 rounded-full bg-[#005045]" />
							</View>
						</View>

						{/* Card 2: Altri metodi */}
						<View className="bg-white rounded-xl border border-gray-200 p-4">
							<View className="flex-row items-center justify-between mb-3">
								<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
									Altri metodi di pagamento
								</ThemedText>
								<Icon name="expand_more" size={24} color="#4b5563" />
							</View>
							<View className="flex-row flex-wrap items-center gap-2">
								<View className="px-2 py-1 bg-[#003087] rounded">
									<ThemedText className="text-[10px] font-plus-jakarta-bold !text-white italic">
										PayPal
									</ThemedText>
								</View>
								<View className="px-2 py-1 bg-black rounded flex-row items-center">
									<Icon name="apple" size={12} color="white" />
									<ThemedText className="text-[10px] font-plus-jakarta-bold !text-white ml-0.5">
										Pay
									</ThemedText>
								</View>
								<View className="px-2 py-1 bg-[#ef4026] rounded">
									<ThemedText className="text-[10px] font-plus-jakarta-bold !text-white">
										satispay
									</ThemedText>
								</View>
								<View className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
									<ThemedText className="text-[10px] font-plus-jakarta-bold !text-black">
										amazon pay
									</ThemedText>
								</View>
								<View className="px-2 py-1 bg-blue-50 rounded border border-blue-200">
									<ThemedText className="text-[10px] font-plus-jakarta-bold !text-blue-600">
										MyBank
									</ThemedText>
								</View>
							</View>
						</View>
					</View>

					{/* Fattura */}
					<View className="px-5 mt-8 mb-6 flex-row items-center justify-between">
						<View className="flex-row items-center">
							<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950 mr-1.5">
								Voglio la fattura
							</ThemedText>
							<Icon name="info" size={16} color="#9ca3af" />
						</View>
						<Switch
							value={invoiceRequested}
							onValueChange={setInvoiceRequested}
							trackColor={{ false: "#e5e7eb", true: "#005045" }}
							thumbColor={"#ffffff"}
						/>
					</View>

					{/* Terms */}
					<View className="px-5 mb-8">
						<View className="flex-row items-start mb-3">
							<Pressable
								onPress={() => setAcceptedTerms(!acceptedTerms)}
								className={`h-5 w-5 rounded items-center justify-center border mt-0.5 mr-3 ${
									acceptedTerms
										? "bg-[#005045] border-[#005045]"
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
							<ThemedText className="flex-1 text-[13px] font-plus-jakarta-medium !text-gray-600 leading-tight">
								Accetto le{" "}
								<ThemedText className="!text-[#c1152c] underline">
									condizioni di trasporto
								</ThemedText>{" "}
								del vettore ed ho preso visione dell'informativa per la{" "}
								<ThemedText className="!text-[#c1152c] underline">
									protezione dei dati personali
								</ThemedText>
								.
							</ThemedText>
						</View>

						<View className="ml-8 mb-2">
							<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-600">
								Stai acquistando un biglietto cumulativo.{"\n"}
								<ThemedText className="!text-[#c1152c] underline">
									Maggiori info
								</ThemedText>
							</ThemedText>
						</View>

						<View className="ml-8">
							<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-600">
								Consulta le Modifiche alla Circolazione Programmata
							</ThemedText>
						</View>
					</View>
				</View>
			</ScrollView>

			<StickyFooter
				totalPrice={totalPrice}
				basePrice={0}
				buttonTitle="Paga ora"
				subtitle="Vedi carrello"
				hideSeatSelection={true}
				disabled={!acceptedTerms}
				onPress={() => {
					router.push("/payment-processing");
				}}
			/>
		</View>
	);
}
