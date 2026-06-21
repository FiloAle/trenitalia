import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import React, { useRef, useState, useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";

export interface CalendarSheetProps {
	isVisible: boolean;
	onClose: () => void;
	initialDate: Date;
	onConfirm: (date: Date) => void;
}

export function CalendarSheet({ isVisible, onClose, initialDate, onConfirm }: CalendarSheetProps) {
	const [currentMonth, setCurrentMonth] = useState(() => {
		const d = new Date(initialDate);
		d.setDate(1);
		return d;
	});
	const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
	const hourScrollRef = useRef<FlatList>(null);

	useEffect(() => {
		if (isVisible) {
			setSelectedDate(new Date(initialDate));
			const d = new Date(initialDate);
			d.setDate(1);
			setCurrentMonth(d);
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: initialDate.getHours() * 88,
					animated: true,
				});
			}, 400);
		}
	}, [isVisible, initialDate]);

	const generateDays = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
		const days = [];

		for (let i = 0; i < adjustedFirstDay; i++) {
			days.push({ day: null });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (let i = 1; i <= daysInMonth; i++) {
			const d = new Date(year, month, i);
			const isPast = d < today;
			days.push({ day: i, isPast, date: d });
		}
		return days;
	};

	return (
		<BottomSheet
			isVisible={isVisible}
			onClose={onClose}
			title="Data e ora"
			heightPercentage={0.9}
		>
			<View className="flex-1 justify-between flex-col pb-2">
				<View className="-mx-6 px-[4px]">
					<View className="flex-row justify-between items-center px-2">
						<Pressable
							onPress={() => {
								const prev = new Date(currentMonth);
								prev.setMonth(prev.getMonth() - 1);
								setCurrentMonth(prev);
							}}
							disabled={
								currentMonth.getMonth() === new Date().getMonth() &&
								currentMonth.getFullYear() === new Date().getFullYear()
							}
							className={`p-1 ${
								currentMonth.getMonth() === new Date().getMonth() &&
								currentMonth.getFullYear() === new Date().getFullYear()
									? "opacity-0"
									: "opacity-100"
							}`}
						>
							<Icon name="chevron_left" size={32} className="!text-neutral-950" weight={200} />
						</Pressable>
						<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-950 capitalize">
							{currentMonth.toLocaleString("it-IT", { month: "long", year: "numeric" })}
						</ThemedText>
						<Pressable
							onPress={() => {
								const next = new Date(currentMonth);
								next.setMonth(next.getMonth() + 1);
								setCurrentMonth(next);
							}}
							className="p-1"
						>
							<Icon name="chevron_right" size={32} className="!text-neutral-950" weight={200} />
						</Pressable>
					</View>

					<View className="flex-row px-0 py-2">
						{["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"].map((d) => (
							<ThemedText key={d} className="text-[13px] font-google-sans-medium !text-neutral-400 w-[14.28%] text-center">
								{d}
							</ThemedText>
						))}
					</View>

					<View className="px-0 flex-row flex-wrap h-[312px]">
						{generateDays().map((d, i) => (
							<Pressable
								key={i}
								disabled={!d.day || d.isPast}
								onPress={() => {
									if (d.date) {
										const newDate = new Date(d.date);
										newDate.setHours(selectedDate.getHours());
										newDate.setMinutes(selectedDate.getMinutes());
										setSelectedDate(newDate);
									}
								}}
								className="w-[14.28%] aspect-square items-center justify-center p-1"
							>
								{d.day && (
									<View
										className={`w-10 h-10 items-center justify-center rounded-full ${
											d.date &&
											selectedDate.getDate() === d.date.getDate() &&
											selectedDate.getMonth() === d.date.getMonth() &&
											selectedDate.getFullYear() === d.date.getFullYear()
												? "bg-primary-600"
												: ""
										}`}
									>
										<ThemedText
											className={`text-[15px] font-google-sans-medium ${
												d.isPast
													? "!text-neutral-300"
													: d.date &&
													  selectedDate.getDate() === d.date.getDate() &&
													  selectedDate.getMonth() === d.date.getMonth() &&
													  selectedDate.getFullYear() === d.date.getFullYear()
													? "!text-white"
													: "!text-neutral-950"
											}`}
										>
											{d.day}
										</ThemedText>
									</View>
								)}
							</Pressable>
						))}
					</View>

					<View className="h-[88px] flex-row mt-6">
						<View className="absolute inset-y-0 left-0 right-0 justify-center pointer-events-none z-0 px-6">
							<View className="h-10 bg-neutral-100 rounded-xl" />
						</View>
						<FlatList
							ref={hourScrollRef}
							data={Array.from({ length: 24 }, (_, i) => i)}
							keyExtractor={(item) => item.toString()}
							horizontal
							showsHorizontalScrollIndicator={false}
							snapToInterval={88}
							snapToAlignment="center"
							decelerationRate="fast"
							contentContainerStyle={{ paddingHorizontal: 150 }}
							onMomentumScrollEnd={(e) => {
								const offsetX = e.nativeEvent.contentOffset.x;
								const hour = Math.round(offsetX / 88);
								if (hour >= 0 && hour <= 23) {
									const newDate = new Date(selectedDate);
									newDate.setHours(hour);
									setSelectedDate(newDate);
								}
							}}
							getItemLayout={(_, index) => ({
								length: 88,
								offset: 88 * index,
								index,
							})}
							renderItem={({ item }) => (
								<Pressable
									onPress={() => {
										const newDate = new Date(selectedDate);
										newDate.setHours(item);
										setSelectedDate(newDate);
										hourScrollRef.current?.scrollToIndex({
											index: item,
											animated: true,
											viewPosition: 0.5,
										});
									}}
									className="w-[88px] h-full items-center justify-center z-10"
								>
									<ThemedText
										className={`text-[20px] font-google-sans-medium ${
											selectedDate.getHours() === item ? "!text-primary-600" : "!text-neutral-400"
										}`}
									>
										{item.toString().padStart(2, "0")}:00
									</ThemedText>
								</Pressable>
							)}
						/>
					</View>
				</View>

				<View className="mt-8 px-6">
					<MainButton
						title="Conferma"
						onPress={() => {
							onConfirm(selectedDate);
							onClose();
						}}
					/>
				</View>
			</View>
		</BottomSheet>
	);
}
