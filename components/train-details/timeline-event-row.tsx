import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";
import { TimelineStation } from "@/constants/train-details-mock";
import { router } from "expo-router";

interface TimelineEventRowProps {
	station: TimelineStation;
	isFirst: boolean;
	isLast: boolean;
}

export function TimelineEventRow({ station, isFirst, isLast }: TimelineEventRowProps) {
	return (
		<View className="flex-row relative">
			{/* Left Column: Table Icon & Line/Circle */}
			<View className="flex-row items-start mr-3">
				<Pressable 
					onPress={() => router.navigate("/station-board")}
					className="mr-2"
				>
					<Icon name="table_chart" size={24} color="#4b5563" />
				</Pressable>
				<View className="w-8 items-center relative">
					{/* The line connecting nodes (don't draw after last node) */}
					{!isLast && (
						<View 
							className="absolute w-[2px] bg-gray-200"
							style={{ top: 12, bottom: -24 }}
						/>
					)}
					{/* Active line portion */}
					{isFirst && (
						<View 
							className="absolute w-[4px] bg-[#005045]"
							style={{ top: 12, height: '150%' }}
						/>
					)}
					
					{/* Station node dot */}
					<View 
						className="w-3 h-3 rounded-full bg-white border-2 border-[#005045] mt-[6px] z-10"
					/>
				</View>
			</View>

			{/* Right Column: Station Details */}
			<View className="flex-1 pb-8">
				<View className="flex-row items-center justify-between mb-2">
					<View className="flex-row items-center flex-1">
						<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mr-2">
							{station.name}
						</ThemedText>
					</View>
					<View className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
						<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-600">
							BIN {station.bin}
						</ThemedText>
					</View>
				</View>
				
				<View className="bg-gray-100 self-start px-2 py-1 rounded mb-2">
					<ThemedText className="text-xs font-plus-jakarta-medium !text-gray-700">
						Executive in testa
					</ThemedText>
				</View>

				<View className="gap-1 mt-1">
					{station.events.map((ev, idx) => (
						<View key={idx} className="flex-row items-center justify-between">
							<ThemedText 
								className={`text-sm ${
									ev.isActual 
										? "font-plus-jakarta-bold !text-[#005045]" 
										: "font-plus-jakarta-medium !text-gray-500"
								}`}
							>
								{ev.label}
							</ThemedText>
							<ThemedText 
								className={`text-sm ${
									ev.isActual 
										? "font-plus-jakarta-bold !text-[#005045]" 
										: "font-plus-jakarta-medium !text-gray-500"
								}`}
							>
								{ev.time}
							</ThemedText>
						</View>
					))}
				</View>
			</View>
		</View>
	);
}
