import { CheckoutHeader } from "@/components/checkout-header";
import { InfoBanner } from "@/components/home/info-banner";
import {
	PassengerAccordion,
	PassengerData,
} from "@/components/passenger/passenger-accordion";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { TimerBar } from "@/components/ui/timer-bar";
import { USER_DATA } from "@/constants/user";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
const EMPTY_PASSENGER: PassengerData = {
	nome: "",
	cognome: "",
	cartaFreccia: "",
	dataNascita: "",
	email: "",
	telefono: "",
};

export default function PassengerDataScreen() {
	const params = useLocalSearchParams();
	const totalPrice = parseFloat((params.totalPrice as string) || "15");
	const basePrice = parseFloat((params.basePrice as string) || "15");
	const passengerText = (params.passengerText as string) || "1 Adulto";

	const adultsMatch = passengerText.match(/(\d+)\s+Adult/i);
	const adults = adultsMatch ? parseInt(adultsMatch[1], 10) : 1;
	const youthsMatch = passengerText.match(/(\d+)\s+Ragazz/i);
	const youths = youthsMatch ? parseInt(youthsMatch[1], 10) : 0;
	const passengerCount = Math.max(1, adults + youths);

	// Timer logic
	const [endTime] = useState(() => Date.now() + 600 * 1000); // 10 minutes from now

	// State
	const [passengers, setPassengers] = useState<PassengerData[]>(() => {
		const arr = [];
		const currentUser: PassengerData = {
			nome: USER_DATA.firstName,
			cognome: USER_DATA.lastName,
			cartaFreccia: USER_DATA.loyaltyCode,
			dataNascita: USER_DATA.birthDate,
			email: USER_DATA.email.toUpperCase(),
			telefono: USER_DATA.phone,
		};
		for (let i = 0; i < passengerCount; i++) {
			arr.push(i === 0 ? { ...currentUser } : { ...EMPTY_PASSENGER });
		}
		return arr;
	});
	const [expandedAccordion, setExpandedAccordion] = useState<number>(-1);

	const updatePassenger = (index: number, data: Partial<PassengerData>) => {
		setPassengers((prev) => {
			const newArr = [...prev];
			newArr[index] = { ...newArr[index], ...data };
			return newArr;
		});
	};

	const clearPassenger = (index: number) => {
		setPassengers((prev) => {
			const newArr = [...prev];
			newArr[index] = { ...EMPTY_PASSENGER };
			return newArr;
		});
	};

	return (
		<View className="flex-1 bg-white">
			<CheckoutHeader title="Dati passeggeri" />

			<TimerBar endTime={endTime} />

			<ScrollView
				className="flex-1 bg-gray-50"
				contentContainerStyle={{ paddingBottom: 160 }}
			>
				{/* Contatti acquirente */}
				<View className="bg-white px-5 py-4 flex-row items-center border-b border-gray-100">
					<Icon
						name="contact_mail"
						size={24}
						className="!text-[#004a4d] mr-4"
					/>
					<View>
						<ThemedText className="text-[14px] font-plus-jakarta-bold !text-gray-950 mb-0.5">
							Contatti acquirente
						</ThemedText>
						<ThemedText className="text-[13px] font-plus-jakarta-medium !text-gray-500 uppercase">
							{USER_DATA.email}
							{"  ·  "}
							{USER_DATA.phone}
						</ThemedText>
					</View>
				</View>

				{/* Passeggeri Section */}
				<View className="bg-white mt-2 pt-6 pb-6 border-y border-gray-100">
					<View className="px-5 mb-4">
						<ThemedText className="text-[16px] font-plus-jakarta-bold !text-gray-950 mb-3">
							Passeggeri
						</ThemedText>

						<InfoBanner title="I biglietti sono nominativi. Lascia anche l'email e/o il telefono nel caso dovessimo contattarti." />
					</View>

					{/* Accordions */}
					<View>
						{passengers.map((p, idx) => (
							<PassengerAccordion
								key={idx}
								index={idx}
								isExpanded={expandedAccordion === idx}
								onToggle={() =>
									setExpandedAccordion(expandedAccordion === idx ? -1 : idx)
								}
								passenger={p}
								onUpdate={(data) => updatePassenger(idx, data)}
								onClear={() => clearPassenger(idx)}
								savedPassengers={[
									{
										nome: USER_DATA.firstName,
										cognome: USER_DATA.lastName,
										cartaFreccia: USER_DATA.loyaltyCode,
										dataNascita: USER_DATA.birthDate,
										email: USER_DATA.email.toUpperCase(),
										telefono: USER_DATA.phone,
									},
								]}
								onApplyShortcut={(savedData) => updatePassenger(idx, savedData)}
							/>
						))}
					</View>

					{/* Aggiungi buono sconto */}
					<View className="px-5 mt-6">
						<Pressable className="border border-dashed border-gray-300 rounded-2xl p-4 flex-row justify-between items-center bg-white">
							<View className="flex-row items-center">
								<Icon
									name="local_offer"
									size={20}
									className="!text-[#004a4d] mr-3"
								/>
								<ThemedText className="text-[14px] font-plus-jakarta-bold !text-[#004a4d]">
									Aggiungi buono sconto
								</ThemedText>
							</View>
							<Icon name="add" size={24} className="!text-[#004a4d]" />
						</Pressable>
					</View>
				</View>
			</ScrollView>

			<StickyFooter
				totalPrice={totalPrice}
				basePrice={basePrice}
				buttonTitle="Conferma"
				hideSeatSelection={true}
				onPress={() => {
					router.push({
						pathname: "/add-services" as any,
						params: {
							endTime: endTime,
							price: totalPrice,
						},
					});
				}}
			/>
		</View>
	);
}
