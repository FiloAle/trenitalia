import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Link } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

export interface TicketProps {
	id: string;
	day: string;
	month: string;
	type: string;
	route: string;
	time: string;
	details: string;
	pnr: string;
	trainType?: string;
	cp?: string;
	carrozza?: string;
	posto?: string;
}

interface TicketItemProps {
	ticket: TicketProps;
}

export function TicketItem({ ticket }: TicketItemProps) {
	return (
		<Link
			href={{
				pathname: "/ticket-detail" as any,
				params: {
					id: ticket.id,
					day: ticket.day,
					month: ticket.month,
					type: ticket.type,
					route: ticket.route,
					time: ticket.time,
					details: ticket.details,
					pnr: ticket.pnr,
					trainType: ticket.trainType,
					cp: ticket.cp,
					carrozza: ticket.carrozza,
					posto: ticket.posto,
				},
			}}
			asChild
		>
			<Pressable className="flex-row rounded-lg border border-gray-200 bg-white px-4 py-6">
				{/* Date column */}
				<View className="mr-4 items-center justify-center border-r border-gray-200 pr-4">
					<ThemedText className="text-[25px] font-plus-jakarta-semibold !text-gray-900">
						{ticket.day}
					</ThemedText>
					<ThemedText className="text-[15px] font-plus-jakarta-semibold !text-gray-900">
						{ticket.month}
					</ThemedText>
				</View>

				{/* Info column */}
				<View className="flex-1">
					<ThemedText className="mb-1 text-[13px] font-plus-jakarta-medium !text-gray-500">
						{ticket.type}
					</ThemedText>
					<ThemedText className="mb-1 text-[14px] font-plus-jakarta-medium !text-gray-950">
						{ticket.route}
					</ThemedText>
					<View className="flex-row items-center">
						<ThemedText className="mr-2 text-[13px] font-plus-jakarta-medium !text-gray-500">
							{ticket.time} · {ticket.details}
						</ThemedText>
						<Icon name="cloud" size={16} color="#9ca3af" />
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
