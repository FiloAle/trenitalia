import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { PurchasedTrip } from "@/utils/trips-store";

interface TicketItemProps {
	ticket: PurchasedTrip;
	onLongPress?: () => void;
	type?: "passato" | "prossimo" | "salvato";
}

export function TicketItem({ ticket, onLongPress, type = "passato" }: TicketItemProps) {
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

	const isProssimo = type === "prossimo";
	
	const checkIsToday = (dateStr?: string) => {
		if (!dateStr) return false;
		const ticketDate = new Date(dateStr);
		const today = new Date();
		return ticketDate.toDateString() === today.toDateString();
	};

	const isOggi = checkIsToday(ticket.date);
	const bgColor = isProssimo ? "#00878a" : "#5c5c5c";

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
				className="flex-row rounded-xl border border-gray-300 bg-white mb-3"
			>
				{/* Top Cutout */}
				<View 
					className="absolute bg-white z-10" 
					style={{ 
						top: -1, 
						left: 72, 
						width: 16, 
						height: 8, 
						borderBottomLeftRadius: 8, 
						borderBottomRightRadius: 8, 
						borderBottomWidth: 1, 
						borderLeftWidth: 1, 
						borderRightWidth: 1, 
						borderColor: '#d1d5db'
					}} 
				/>
				
				{/* Bottom Cutout */}
				<View 
					className="absolute bg-white z-10" 
					style={{ 
						bottom: -1, 
						left: 72, 
						width: 16, 
						height: 8, 
						borderTopLeftRadius: 8, 
						borderTopRightRadius: 8, 
						borderTopWidth: 1, 
						borderLeftWidth: 1, 
						borderRightWidth: 1, 
						borderColor: '#d1d5db'
					}} 
				/>

				{/* Date column (Colored) */}
				<View 
					className="w-20 items-center justify-center py-4 rounded-l-xl"
					style={{ backgroundColor: bgColor }}
				>
					<ThemedText className="text-[26px] font-plus-jakarta-bold !text-white leading-tight">
						{day}
					</ThemedText>
					<ThemedText className="text-[15px] font-plus-jakarta-bold !text-white leading-tight mt-0.5">
						{month}
					</ThemedText>
					{isOggi && (
						<ThemedText className="text-[13px] font-plus-jakarta-medium !text-white mt-1.5">
							Oggi
						</ThemedText>
					)}
				</View>

				{/* Content column (White) */}
				<View className="flex-1 py-4 px-5 justify-center bg-white rounded-r-xl border-l border-gray-200 border-dashed">
					<View className="flex-row justify-between items-start mb-1">
						<ThemedText className="flex-1 text-[15px] font-plus-jakarta-bold !text-[#0f172a]">
							{route}
						</ThemedText>
						{isOggi && (
							<View className="bg-red-100 px-2 py-0.5 rounded ml-2">
								<ThemedText className="text-[12px] font-plus-jakarta-bold !text-red-500">
									+12 min
								</ThemedText>
							</View>
						)}
					</View>
					
					<ThemedText className="text-[14px] font-plus-jakarta-medium !text-[#334155] mb-1">
						{time} • {details}
					</ThemedText>
					
					{isOggi && (
						<View className="flex-row items-center mt-3 justify-between">
							<View className="flex-row items-center gap-4">
								<ThemedText className="text-[13px] font-plus-jakarta-medium !text-[#475569]">
									Carrozza <ThemedText className="font-plus-jakarta-bold !text-[#0f172a]">{firstTrain.coach || "4"}</ThemedText>
								</ThemedText>
								<ThemedText className="text-[13px] font-plus-jakarta-medium !text-[#475569]">
									Posto <ThemedText className="font-plus-jakarta-bold !text-[#0f172a]">{firstTrain.seat || "3"}</ThemedText>
								</ThemedText>
							</View>
							<ThemedText className="text-[14px] font-plus-jakarta-bold !text-[#00878a]">
								BIN {firstTrain.departurePlatform || "17"}
							</ThemedText>
						</View>
					)}
				</View>
			</Pressable>
		</Link>
	);
}
