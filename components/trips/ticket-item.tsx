import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { PurchasedTrip } from "@/utils/trips-store";

interface TicketItemProps {
	ticket: PurchasedTrip;
	onLongPress?: () => void;
}

export function TicketItem({ ticket, onLongPress }: TicketItemProps) {
	const trains = ticket.trains;
	const firstTrain = trains[0];
	const lastTrain = trains[trains.length - 1];
	
	const route = `${firstTrain.origin} - ${lastTrain.destination}`;
	const time = `${ticket.departureTime} - ${ticket.arrivalTime}`;
	const details = trains.length === 1 ? "Diretto" : `${trains.length - 1} Camb${trains.length - 1 > 1 ? "i" : "io"}`;
	
	const dateObj = new Date(ticket.date || new Date());
	const day = dateObj.getDate().toString();
	const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
	const month = monthNames[dateObj.getMonth()];

	return (
		<Link
			href={{
				pathname: "/ticket-detail" as any,
				params: {
					tripId: ticket.id,
				},
			}}
			asChild
		>
			<Pressable
				onLongPress={onLongPress}
				className="flex-row rounded-lg border border-gray-200 bg-white px-4 py-6"
			>
				{/* Date column */}
				<View className="mr-4 items-center justify-center border-r border-gray-200 pr-4">
					<ThemedText className="text-[25px] font-plus-jakarta-semibold !text-gray-900">
						{day}
					</ThemedText>
					<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-gray-900">
						{month}
					</ThemedText>
				</View>

				{/* Info column */}
				<View className="flex-1">
					<ThemedText className="mb-1 text-[13px] font-plus-jakarta-medium !text-gray-500">
						Biglietto
					</ThemedText>
					<ThemedText className="mb-1 text-[14px] font-plus-jakarta-medium !text-gray-950">
						{route}
					</ThemedText>
					<View className="flex-row items-center">
						<ThemedText className="mr-2 text-[13px] font-plus-jakarta-medium !text-gray-500">
							{time} · {details}
						</ThemedText>
						<Icon name="cloud" size={16} color="#9ca3af" />
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
