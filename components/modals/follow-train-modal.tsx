import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { MainButton } from "@/components/ui/main-button";
import { TimePickerColumn } from "@/components/ui/time-picker-column";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";

interface FollowTrainModalProps {
	isVisible: boolean;
	onClose: () => void;
	onConfirm: () => void;
	stations: string[];
	initialDays?: number[];
	initialHour?: string;
	initialMinute?: string;
}

export function FollowTrainModal({
	isVisible,
	onClose,
	onConfirm,
	stations,
	initialDays = [],
	initialHour = "12",
	initialMinute = "35",
}: FollowTrainModalProps) {
	const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
	const [selectedDays, setSelectedDays] = useState<number[]>(initialDays);
	const [selectedStation, setSelectedStation] =
		useState<string>("Intero percorso");
	const [selectedHour, setSelectedHour] = useState(initialHour);
	const [selectedMinute, setSelectedMinute] = useState(initialMinute);

	const days = ["L", "M", "M", "G", "V", "S", "D"];
	const hours = Array.from({ length: 24 }, (_, i) =>
		i.toString().padStart(2, "0"),
	);
	const minutes = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, "0"),
	);

	const toggleDay = (index: number) => {
		if (selectedDays.includes(index)) {
			setSelectedDays(selectedDays.filter((d) => d !== index));
		} else {
			setSelectedDays([...selectedDays, index]);
		}
	};

	const isConfirmEnabled = !isNotificationsEnabled || selectedDays.length > 0;

	// Reset state when modal opens
	useEffect(() => {
		if (isVisible) {
			setIsNotificationsEnabled(true);
			setSelectedDays(initialDays);
			setSelectedStation("Intero percorso");
			setSelectedHour(initialHour);
			setSelectedMinute(initialMinute);
		}
	}, [isVisible, initialDays, initialHour, initialMinute]);

	return (
		<BottomSheet
			isVisible={isVisible}
			onClose={onClose}
			title="Attiva notifiche"
		>
			<ScrollView
				style={{ maxHeight: Dimensions.get("window").height * 0.75 }}
				className="-mx-5 px-5"
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}
			>
				<View>
					{/* Days Selector */}
					<View className="mb-6">
						<ThemedText className="text-xs font-google-sans-bold !text-neutral-950 mb-3 bg-neutral-100 py-2 -mx-5 px-5">
							RICEVI NOTIFICHE NEI GIORNI:
						</ThemedText>
						<View className="flex-row justify-between">
							{days.map((day, idx) => {
								const isSelected = selectedDays.includes(idx);
								return (
									<Pressable
										key={idx}
										onPress={() => toggleDay(idx)}
										className={`h-10 w-10 items-center justify-center rounded-full border ${
											isSelected
												? "border-primary-500 bg-primary-500"
												: "border-neutral-200 bg-neutral-50"
										}`}
									>
										<ThemedText
											className={`text-[15px] font-google-sans-bold ${
												isSelected ? "!text-white" : "!text-neutral-500"
											}`}
										>
											{day}
										</ThemedText>
									</Pressable>
								);
							})}
						</View>
					</View>

					{/* Time Selector (Mocked Scroll) */}
					<View className="mb-8">
						<ThemedText className="text-xs font-google-sans-bold !text-neutral-950 mb-4 bg-neutral-100 py-2 -mx-5 px-5">
							RICEVI NOTIFICHE A QUEST&apos;ORA:
						</ThemedText>

						<View className="flex-row justify-center items-center h-32 relative">
							{/* Background Highlights for selected time */}
							<View
								className="absolute flex-row justify-center items-center w-full h-[40px]"
								style={{ top: 44 }}
								pointerEvents="none"
							>
								<View className="w-[60px] h-full rounded-full bg-primary-500" />
								<View className="w-[30px]" />
								<View className="w-[60px] h-full rounded-full bg-primary-500" />
							</View>

							<TimePickerColumn
								items={hours}
								selectedValue={selectedHour}
								onValueChange={setSelectedHour}
							/>

							<View className="w-[30px] items-center justify-center">
								<ThemedText className="text-lg font-google-sans-bold !text-neutral-950">
									:
								</ThemedText>
							</View>

							{/* Minutes */}
							<TimePickerColumn
								items={minutes}
								selectedValue={selectedMinute}
								onValueChange={setSelectedMinute}
							/>
						</View>
					</View>

					{/* Stations Selector */}
					<View className="mb-4">
						<ThemedText className="text-xs font-google-sans-bold !text-neutral-950 mb-3 bg-neutral-100 py-2 -mx-5 px-5">
							RICEVI NOTIFICHE FINO A:
						</ThemedText>

						{["Intero percorso", ...stations].map((station, idx) => {
							const isSelected = selectedStation === station;
							return (
								<Pressable
									key={idx}
									onPress={() => setSelectedStation(station)}
									className="flex-row items-center justify-between py-4"
								>
									<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
										{station}
									</ThemedText>
									<View
										className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? "border-primary-500" : "border-neutral-400"}`}
									>
										{isSelected && (
											<View className="w-2.5 h-2.5 rounded-full bg-primary-500" />
										)}
									</View>
								</Pressable>
							);
						})}
					</View>
				</View>
			</ScrollView>

			{/* Footer Buttons */}
			<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 pb-8 flex-row gap-3">
				<Pressable
					onPress={onClose}
					className="flex-1 items-center justify-center py-3.5 rounded-2xl border border-neutral-300 h-14"
				>
					<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950">
						Annulla
					</ThemedText>
				</Pressable>
				<View className="flex-1">
					<MainButton
						title="Conferma"
						onPress={() => isConfirmEnabled && onConfirm()}
						disabled={!isConfirmEnabled}
					/>
				</View>
			</View>
		</BottomSheet>
	);
}
