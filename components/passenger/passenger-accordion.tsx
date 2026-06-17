import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";
import { ClearableInput } from "./clearable-input";

export type PassengerData = {
	nome: string;
	cognome: string;
	cartaFreccia: string;
	dataNascita: string;
	email: string;
	telefono: string;
};

export interface PassengerAccordionProps {
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
	passenger: PassengerData;
	onUpdate: (data: Partial<PassengerData>) => void;
	onClear: () => void;
	savedPassengers: PassengerData[];
	onApplyShortcut: (p: PassengerData) => void;
}

export function PassengerAccordion({
	index,
	isExpanded,
	onToggle,
	passenger,
	onUpdate,
	onClear,
	savedPassengers,
	onApplyShortcut,
}: PassengerAccordionProps) {
	const fullName =
		passenger.nome || passenger.cognome
			? `${passenger.nome} ${passenger.cognome}`.trim()
			: `PASSEGGERO ${index + 1}`;

	const initials = (
		(passenger.nome ? passenger.nome.charAt(0) : "P") +
		(passenger.cognome ? passenger.cognome.charAt(0) : `${index + 1}`)
	).toUpperCase();

	return (
		<Animated.View layout={LinearTransition} className="bg-white">
			<Pressable onPress={onToggle} className="flex-row items-start p-5">
				<View className="w-10 h-10 rounded-full bg-[#004a4d]/10 items-center justify-center mr-3">
					<ThemedText className="font-plus-jakarta-bold text-[14px] !text-[#004a4d]">
						{initials}
					</ThemedText>
				</View>
				<View className="flex-1 min-h-[40px] pt-0">
					<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-950 uppercase">
						{fullName}
					</ThemedText>
					<ThemedText className="font-plus-jakarta-medium text-[13px] !text-gray-500 mt-0.5">
						Adulto
						{passenger.cartaFreccia
							? `  ·  CF/X-GO: ${passenger.cartaFreccia}`
							: ""}
					</ThemedText>
					{!isExpanded && (passenger.email || passenger.telefono) && (
						<ThemedText
							className="font-plus-jakarta-medium text-[13px] !text-gray-500 mt-0.5"
							numberOfLines={1}
						>
							{passenger.email}
							{passenger.email && passenger.telefono ? "  ·  " : ""}
							{passenger.telefono}
						</ThemedText>
					)}
				</View>
				<View className="ml-2 h-10 justify-center">
					<Icon
						name={isExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
						size={24}
						className="!text-gray-950"
					/>
				</View>
			</Pressable>

			{isExpanded && (
				<Animated.View
					entering={FadeIn}
					exiting={FadeOut}
					className="px-5 pt-4 pb-6"
				>
					{savedPassengers.length > 0 && (
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="-mx-5 px-5 mb-6"
							contentContainerStyle={{ paddingRight: 40 }}
						>
							{savedPassengers.map((saved, i) => (
								<Pressable
									key={i}
									onPress={() => onApplyShortcut(saved)}
									className="border border-gray-300 rounded-2xl px-4 py-3 mr-3"
								>
									<ThemedText className="font-plus-jakarta-bold text-[13px] !text-gray-950 uppercase">
										{saved.nome} {saved.cognome}
									</ThemedText>
								</Pressable>
							))}
						</ScrollView>
					)}

					<View className="flex-row justify-between items-end mb-4">
						<ThemedText className="font-plus-jakarta-bold text-[15px] !text-gray-950">
							Dettagli passeggero
						</ThemedText>
						<Pressable onPress={onClear}>
							<ThemedText className="font-plus-jakarta-bold text-[14px] !text-[#004a4d]">
								Svuota campi
							</ThemedText>
						</Pressable>
					</View>

					<ClearableInput
						label="Nome*"
						value={passenger.nome}
						onChangeText={(nome) => onUpdate({ nome })}
					/>
					<ClearableInput
						label="Cognome*"
						value={passenger.cognome}
						onChangeText={(cognome) => onUpdate({ cognome })}
					/>
					<ClearableInput
						label="CartaFRECCIA/X-GO"
						value={passenger.cartaFreccia}
						onChangeText={(cartaFreccia) => onUpdate({ cartaFreccia })}
						keyboardType="numeric"
					/>
					<ClearableInput
						label="Data di nascita"
						value={passenger.dataNascita}
						onChangeText={(dataNascita) => onUpdate({ dataNascita })}
						placeholder="GG/MM/AAAA"
					/>
					<ClearableInput
						label="Email"
						value={passenger.email}
						onChangeText={(email) => onUpdate({ email })}
						keyboardType="email-address"
					/>
					<ClearableInput
						label="Telefono"
						value={passenger.telefono}
						onChangeText={(telefono) => onUpdate({ telefono })}
						keyboardType="phone-pad"
					/>

					<ThemedText className="font-plus-jakarta-medium text-[12px] !text-gray-500 mt-1">
						*Dati obbligatori
					</ThemedText>
				</Animated.View>
			)}
		</Animated.View>
	);
}
