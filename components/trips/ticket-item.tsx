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
				},
			}}
			asChild
		>
			<Pressable className="flex-row rounded-lg border border-gray-100 bg-white p-4">
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
			</Pressable>
		</Link>
	);
}
