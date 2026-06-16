import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/trips/empty-state";
import { TicketItem } from "@/components/trips/ticket-item";
import { Icon } from "@/components/ui/icon";
import React, { useState, useCallback, useRef } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPurchasedTrips, deletePurchasedTrip, PurchasedTrip } from "@/utils/trips-store";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const CHIPS = ["Biglietti", "Abbonamenti", "Carnet"];

const FILTER_OPTIONS = [
	{ label: "Mostra tutti", value: "tutti" },
	{ label: "Prossimi", value: "prossimi" },
	{ label: "Passati", value: "passati" },
	{ label: "Salvati", value: "salvati" }
];

export default function TripsScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Biglietti");
	const [tickets, setTickets] = useState<PurchasedTrip[]>([]);
	const [filter, setFilter] = useState("tutti");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setTickets(getPurchasedTrips());
		}, [])
	);

	const handleLongPress = (id: string) => {
		Alert.alert(
			"Elimina biglietto",
			"Sei sicuro di voler eliminare questo biglietto?",
			[
				{ text: "Annulla", style: "cancel" },
				{
					text: "Elimina",
					style: "destructive",
					onPress: () => {
						deletePurchasedTrip(id);
						setTickets(getPurchasedTrips());
					},
				},
			]
		);
	};

	const now = new Date();
	const pastTickets = tickets.filter(t => new Date(t.date || now) < now).reverse();
	const upcomingTickets = tickets.filter(t => new Date(t.date || now) >= now);

	const renderTicketsList = () => {
		return (
			<View className="pb-10">
				{(filter === "tutti" || filter === "prossimi") && (
					<View className="mb-4">
						{upcomingTickets.map((ticket) => (
							<TicketItem
								key={ticket.id}
								ticket={ticket}
								type="prossimo"
								onLongPress={() => handleLongPress(ticket.id)}
							/>
						))}
					</View>
				)}

				{(filter === "tutti" || filter === "passati") && (
					<View>
						{filter === "tutti" && pastTickets.length > 0 && (
							<View className="pb-2 mb-4 border-t border-gray-300 pt-6">
								<ThemedText className="font-plus-jakarta-bold text-[16px] text-[#0f172a]">
									Passati
								</ThemedText>
							</View>
						)}
						{pastTickets.map((ticket) => (
							<TicketItem
								key={ticket.id}
								ticket={ticket}
								type="passato"
								onLongPress={() => handleLongPress(ticket.id)}
							/>
						))}
					</View>
				)}
				
				{filter === "salvati" && (
					<View className="pb-10">
						{tickets.filter(t => t.isSaved).map((ticket) => (
							<TicketItem
								key={ticket.id}
								ticket={ticket}
								type="salvato"
								onLongPress={() => handleLongPress(ticket.id)}
							/>
						))}
						{tickets.filter(t => t.isSaved).length === 0 && (
							<View className="py-10 items-center justify-center">
								<ThemedText className="text-gray-500 font-plus-jakarta-medium">
									Nessun biglietto salvato.
								</ThemedText>
							</View>
						)}
					</View>
				)}
			</View>
		);
	};

	return (
		<View className="flex-1 bg-white relative">
			{/* Header Section */}
			<View className="bg-teal-900 pb-6 z-30" style={{ paddingTop: insets.top + 4 }}>
				<View className="h-14 flex-row items-center px-6 mb-2">
					<ThemedText className="text-3xl font-plus-jakarta-bold !text-white">
						I miei viaggi
					</ThemedText>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="px-5"
				>
					{CHIPS.map((chip) => (
						<Pressable
							key={chip}
							onPress={() => setActiveChip(chip)}
							className={`mr-3 rounded-full px-5 py-2.5 ${
								activeChip === chip ? "bg-[#1f2937]" : "bg-[#ffffff20]"
							}`}
						>
							<ThemedText
								className={`font-plus-jakarta-semibold ${
									activeChip === chip ? "!text-white" : "!text-white"
								}`}
							>
								{chip}
							</ThemedText>
						</Pressable>
					))}
				</ScrollView>
			</View>

			{/* Dropdown Section */}
			{["Biglietti", "Abbonamenti", "Carnet"].includes(activeChip) && (
				<View className="z-20 px-5 pt-6 bg-white relative">
					<Pressable 
						onPress={() => setIsDropdownOpen(!isDropdownOpen)}
						className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white"
					>
						<ThemedText className="font-plus-jakarta-semibold text-teal-900 text-[16px]">
							{FILTER_OPTIONS.find(o => o.value === filter)?.label}
						</ThemedText>
						<Icon name={isDropdownOpen ? "expand_less" : "expand_more"} size={24} color="#115e59" />
					</Pressable>
					
					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<View className="absolute top-[72px] left-5 right-5 bg-white border border-gray-200 rounded-lg shadow-sm z-50 overflow-hidden">
							{FILTER_OPTIONS.map((option, index) => (
								<Pressable
									key={option.value}
									onPress={() => { setFilter(option.value); setIsDropdownOpen(false); }}
									className={`px-4 py-4 ${index < FILTER_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''}`}
								>
									<ThemedText className={`font-plus-jakarta-semibold text-[15px] ${filter === option.value ? 'text-teal-900' : 'text-gray-700'}`}>
										{option.label}
									</ThemedText>
								</Pressable>
							))}
						</View>
					)}
					
					{/* Linear Gradient Fade Out */}
					<View className="absolute left-0 right-0 -bottom-3 h-3 pointer-events-none z-10">
						<LinearGradient 
							colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']} 
							style={{flex: 1}} 
						/>
					</View>
				</View>
			)}

			{/* Content Section */}
			<ScrollView
				className="flex-1 px-5 pt-4 z-0"
				showsVerticalScrollIndicator={false}
			>
				{["Biglietti", "Abbonamenti", "Carnet"].includes(activeChip) ? (
					renderTicketsList()
				) : (
					<EmptyState activeChip={activeChip} />
				)}
			</ScrollView>
		</View>
	);
}
