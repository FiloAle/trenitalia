import { BottomSheet } from "@/components/modals/bottom-sheet";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { TimerBar } from "@/components/ui/timer-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ElectronicCreditScreen() {
	const insets = useSafeAreaInsets();
	const params = useLocalSearchParams();
	const endTime = Number(params.endTime);

	const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [identificativo, setIdentificativo] = useState("");
	const [antifrode, setAntifrode] = useState("");

	return (
		<View className="flex-1 bg-white">
			{/* Custom Modal Header */}
			<View
				className="bg-white px-5"
				style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
			>
				<View className="flex-row items-center justify-between relative">
					<View className="w-10" />

					<View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
						<ThemedText className="text-[17px] font-plus-jakarta-bold !text-gray-950">
							Crediti elettronici
						</ThemedText>
					</View>

					<Pressable onPress={() => router.back()} className="p-2 -mr-2 z-10">
						<Icon name="close" size={26} color="black" weight={300} />
					</Pressable>
				</View>
			</View>

			<TimerBar endTime={endTime} />

			{/* Empty State */}
			<View className="flex-1 items-center justify-center px-8 mb-20">
				<Icon name="crop_free" size={48} color="#9ca3af" className="mb-4" />
				<ThemedText className="text-[22px] font-plus-jakarta-bold !text-gray-950 text-center mb-2">
					Nessun credito disponibile
				</ThemedText>
				<ThemedText className="text-[15px] font-plus-jakarta-medium !text-gray-600 text-center leading-tight mb-8">
					Non ci sono bonus/crediti elettronici o carte regalo nel tuo
					borsellino.
				</ThemedText>

				<Pressable
					onPress={() => setBottomSheetVisible(true)}
					className="w-full border border-gray-300 rounded-2xl py-4 items-center justify-center bg-white"
				>
					<ThemedText className="text-[15px] font-plus-jakarta-bold !text-gray-950">
						Usa Crediti, Bonus o Carta Regalo
					</ThemedText>
				</Pressable>
			</View>

			<StickyFooter
				totalPrice={0}
				basePrice={0}
				buttonTitle="Applica"
				subtitle="Totale credito/bonus"
				hideSeatSelection={true}
				disabled={false}
				onPress={() => {
					// Dummy action, goes back to payment
					router.back();
				}}
			/>

			{/* Bottom Sheet per inserimento manuale */}
			<BottomSheet
				isVisible={isBottomSheetVisible}
				onClose={() => setBottomSheetVisible(false)}
				title="Inserisci bonus credito"
			>
				<View className="pt-2">
					<View className="border border-gray-200 rounded-2xl mb-4 px-4 py-3 h-[56px] justify-center bg-white">
						<TextInput
							value={identificativo}
							onChangeText={setIdentificativo}
							placeholder="Codice indetificativo"
							placeholderTextColor="#6b7280"
							className="text-base font-plus-jakarta-medium text-gray-950 w-full"
						/>
					</View>

					<View className="border border-gray-200 rounded-2xl mb-6 px-4 py-3 h-[56px] justify-center bg-white">
						<TextInput
							value={antifrode}
							onChangeText={setAntifrode}
							placeholder="Codice antifrode"
							placeholderTextColor="#6b7280"
							className="text-base font-plus-jakarta-medium text-gray-950 w-full"
						/>
					</View>

					<MainButton
						title="Inserisci"
						onPress={() => {
							setBottomSheetVisible(false);
							// Qui si andrebbe a validare il codice
						}}
					/>
				</View>
			</BottomSheet>
		</View>
	);
}
