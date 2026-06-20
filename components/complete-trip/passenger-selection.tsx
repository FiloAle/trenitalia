import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { getInitials } from "@/constants/user";
import { SelectionItem } from "@/utils/selection-store";
import { Pressable, View } from "react-native";

interface PassengerSelectionProps {
	price: number;
	acceptedTerms: boolean;
	onToggleTerms: () => void;
	passengers: SelectionItem[];
	selectedPassengerIds: string[];
	onTogglePassenger: (id: string) => void;
	instructionText: string;
}

export function PassengerSelection({
	price,
	acceptedTerms,
	onToggleTerms,
	passengers,
	selectedPassengerIds,
	onTogglePassenger,
	instructionText,
}: PassengerSelectionProps) {
	return (
		<View className="px-5 py-4">
			<ThemedText className="text-sm font-google-sans-medium !text-neutral-600 mb-6">
				{instructionText}
			</ThemedText>

			{passengers.map((p, index) => {
				const isSelected = selectedPassengerIds.includes(p.id);
				const hasName = !!(p.firstName || p.lastName);
				return (
					<View
						key={p.id}
						className="flex-row items-center justify-between pb-6 border-b border-neutral-100 mb-6"
					>
						<View className="flex-row items-center">
							{hasName ? (
								<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-3">
									<ThemedText className="!text-white font-google-sans-bold text-[16px]">
										{getInitials(p.firstName || "", p.lastName || "")}
									</ThemedText>
								</View>
							) : (
								<View className="h-12 w-12 rounded-full bg-[#008888] items-center justify-center mr-3">
									<Icon
										name="person_outline"
										size={24}
										className="!text-white"
									/>
								</View>
							)}
							<View>
								<ThemedText className="text-base font-google-sans-bold !text-neutral-950">
									{hasName
										? `${p.firstName || ""} ${p.lastName || ""}`.trim()
										: `Passeggero ${index + 1}`}
								</ThemedText>
								<ThemedText className="text-sm font-google-sans-medium !text-neutral-600">
									{p.type === "Adulto" ||
									p.type === "Ragazzo" ||
									p.type === "Bambino"
										? p.type
										: "Adulto"}
								</ThemedText>
							</View>
						</View>

						<View className="flex-row items-center">
							<ThemedText className="text-base font-google-sans-medium !text-neutral-600 mr-3">
								{price.toFixed(2).replace(".", ",")}€
							</ThemedText>
							<Pressable
								onPress={() => onTogglePassenger(p.id)}
								className={`h-5 w-5 rounded items-center justify-center border ${
									isSelected
										? "bg-primary-600 border-primary-600"
										: "border-neutral-400"
								}`}
							>
								{isSelected && (
									<Icon
										name="check"
										size={16}
										color="white"
										weight={600}
										style={{ marginTop: -2 }}
									/>
								)}
							</Pressable>
						</View>
					</View>
				);
			})}

			{/* Terms */}
			<Pressable className="flex-row items-center" onPress={onToggleTerms}>
				<View
					className={`h-5 w-5 rounded items-center justify-center mr-3 border ${
						acceptedTerms
							? "bg-primary-600 border-primary-600"
							: "border-neutral-400"
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
				</View>
				<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-700">
					Ho letto le{" "}
					<ThemedText className="!text-primary-500 underline">
						condizioni di utilizzo
					</ThemedText>
				</ThemedText>
			</Pressable>
		</View>
	);
}
