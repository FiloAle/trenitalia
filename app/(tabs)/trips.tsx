import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { EmptyState } from "@/components/trips/empty-state";
import { TicketItem, TicketProps } from "@/components/trips/ticket-item";
import { STATIONS } from "@/constants/stations";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Biglietti", "Abbonamenti", "Carnet", "TPL", "Archivio"];

const TICKETS: TicketProps[] = [
	{
		id: "1",
		day: "29",
		month: "Apr",
		type: "Biglietto",
		route: `${STATIONS[0]} - ${STATIONS[4]}`,
		time: "18:35 - 21:27",
		details: "Diretto",
	},
	{
		id: "2",
		day: "3",
		month: "Mag",
		type: "Biglietto",
		route: `${STATIONS[4]} - ${STATIONS[0]}`,
		time: "07:27 - 10:10",
		details: "Diretto",
	},
	{
		id: "3",
		day: "28",
		month: "Mag",
		type: "Biglietto",
		route: `${STATIONS[0]} - ${STATIONS[4]}`,
		time: "18:35 - 21:27",
		details: "Diretto",
	},
	{
		id: "4",
		day: "2",
		month: "Giu",
		type: "Biglietto",
		route: `${STATIONS[4]} - ${STATIONS[0]}`,
		time: "08:28 - 11:10",
		details: "Diretto",
	},
];

export default function TripsScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Biglietti");

	return (
		<View className="flex-1 bg-white">
			{/* Header Section */}
			<View
				className="bg-teal-900 pb-6"
				style={{ paddingTop: insets.top + 4 }}
			>
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

			{/* Content Section */}
			<ScrollView
				className="flex-1 px-5 pt-6"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
			>
				{activeChip === "Biglietti" ? (
					<>
						{/* Saved Tickets Row */}
						<Pressable className="flex-row items-center justify-between rounded-lg border border-gray-100 bg-white p-4">
							<View className="flex-row items-center">
								<Icon name="bookmark" size={24} color="teal-900" />
								<ThemedText className="ml-3 font-plus-jakarta-semibold !text-gray-900">
									Biglietti salvati
								</ThemedText>
							</View>
							<Icon name="chevron_right" size={24} color="#1f2937" />
						</Pressable>

						{/* Tickets List */}
						{TICKETS.map((ticket) => (
							<TicketItem key={ticket.id} ticket={ticket} />
						))}
					</>
				) : (
					<EmptyState activeChip={activeChip} />
				)}
			</ScrollView>

			{/* Bottom Button */}
			<View className="absolute bottom-6 left-0 right-0 px-5">
				<MainButton
					title="Recupera biglietto"
					iconName="search"
					onPress={() => {}}
				/>
			</View>
		</View>
	);
}
