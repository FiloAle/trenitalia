import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Biglietti", "Abbonamenti", "Carnet", "TPL", "Archivio"];

const TICKETS = [
	{
		id: "1",
		day: "29",
		month: "Apr",
		type: "Biglietto",
		route: "Milano Centrale - Cesena",
		time: "18:35 - 21:27",
		details: "Diretto",
	},
	{
		id: "2",
		day: "3",
		month: "Mag",
		type: "Biglietto",
		route: "Cesena - Milano Centrale",
		time: "07:27 - 10:10",
		details: "Diretto",
	},
	{
		id: "3",
		day: "28",
		month: "Mag",
		type: "Biglietto",
		route: "Milano Centrale - Cesena",
		time: "18:35 - 21:27",
		details: "Diretto",
	},
	{
		id: "4",
		day: "2",
		month: "Giu",
		type: "Biglietto",
		route: "Cesena - Milano Centrale",
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
							<View
								key={ticket.id}
								className="flex-row rounded-lg border border-gray-100 bg-white p-4"
							>
								{/* Date column */}
								<View className="mr-4 items-center border-r border-gray-100 pr-4">
									<ThemedText className="text-2xl font-plus-jakarta-bold !text-gray-900">
										{ticket.day}
									</ThemedText>
									<ThemedText className="text-sm font-plus-jakarta-semibold !text-gray-900">
										{ticket.month}
									</ThemedText>
								</View>

								{/* Info column */}
								<View className="flex-1">
									<ThemedText className="mb-0.5 text-xs font-plus-jakarta-medium !text-gray-500">
										{ticket.type}
									</ThemedText>
									<ThemedText className="mb-1 text-[15px] font-plus-jakarta-bold !text-gray-950">
										{ticket.route}
									</ThemedText>
									<View className="flex-row items-center">
										<ThemedText className="mr-2 text-sm font-plus-jakarta-medium !text-gray-500">
											{ticket.time} · {ticket.details}
										</ThemedText>
										<Icon name="cloud" size={16} color="#9ca3af" />
									</View>
								</View>
							</View>
						))}
					</>
				) : (
					<View className="mt-20 items-center justify-center px-10">
						<Icon
							name={
								activeChip === "Abbonamenti"
									? "card_membership"
									: activeChip === "Carnet"
										? "view_day"
										: activeChip === "TPL"
											? "directions_bus"
											: "archive"
							}
							size={64}
							color="#d1d5db"
						/>
						<ThemedText className="mt-6 text-center text-xl font-plus-jakarta-bold !text-gray-950">
							Nessun {activeChip.toLowerCase()} trovato
						</ThemedText>
						<ThemedText className="mt-2 text-center font-plus-jakarta-medium !text-gray-500">
							Una volta acquistato un {activeChip.toLowerCase()} lo potrai
							vedere qui
						</ThemedText>
					</View>
				)}
			</ScrollView>

			{/* Bottom Button */}
			<View className="absolute bottom-6 left-0 right-0 items-center px-5">
				<Pressable
					className="h-12 w-full overflow-hidden rounded-lg"
					style={{
						elevation: 4,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.2,
						shadowRadius: 4,
					}}
				>
					<LinearGradient
						colors={["#8a052b", "#f73d3d"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={{
							width: "100%",
							height: "100%",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Icon name="search" size={20} color="white" />
						<ThemedText className="ml-2 font-plus-jakarta-bold !text-white">
							Recupera biglietto
						</ThemedText>
					</LinearGradient>
				</Pressable>
			</View>
		</View>
	);
}
