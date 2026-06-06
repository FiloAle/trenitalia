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
	const arrivalEvents = station.events.filter(e => e.label.includes("Arrivo"));
	const departureEvents = station.events.filter(e => e.label.includes("Partenza"));

	const isArrivalActual = arrivalEvents.length > 0 ? arrivalEvents.some(e => e.isActual) : true;
	const isDepartureActual = departureEvents.length > 0 ? departureEvents.some(e => e.isActual) : (arrivalEvents.length > 0 ? arrivalEvents.some(e => e.isActual) : false);

	const hasArrival = arrivalEvents.length > 0;
	const hasDeparture = departureEvents.length > 0;

	return (
		<View 
			className="flex-row relative bg-white"
			style={{ marginTop: isFirst ? 0 : -1 }}
		>
			<View className="flex-1">
				{/* Arrival Events (Above Station Name) */}
				{hasArrival && (
					<View className="relative">
						<View className={`absolute left-[29px] w-[10px] top-0 bottom-[-2px] z-0 ${isArrivalActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} />
						<View className="ml-[64px] pl-3 relative z-10">
							{/* L-Bracket for Arrivals */}
							<View 
								className="absolute border-gray-300"
								style={{
									left: 0,
									top: -4,
									bottom: 0,
									width: 12,
									borderLeftWidth: 2,
									borderTopWidth: 2,
									borderTopLeftRadius: 8,
									borderStyle: 'dotted'
								}}
							/>
							{arrivalEvents.map((ev, idx) => (
								<View key={`arr-${idx}`} className="flex-row items-center justify-between mb-1">
									<ThemedText 
										className={`text-[13px] ${
											ev.isActual 
												? "font-plus-jakarta-bold !text-[#005045]" 
												: "font-plus-jakarta-medium !text-gray-500"
										}`}
									>
										{ev.label}
									</ThemedText>
									<ThemedText 
										className={`text-[13px] ${
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
				)}

				{/* Station Name Row */}
				<View className="relative">
					{/* Top half line */}
					{hasArrival && (
						<View 
							className={`absolute top-0 z-0 ${isArrivalActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} 
							style={{ left: 29, width: 10, bottom: '50%', marginBottom: -1 }}
						/>
					)}

					{/* Bottom half line */}
					{hasDeparture && (
						<View 
							className={`absolute z-0 ${isDepartureActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} 
							style={{ left: 29, width: 10, top: '50%', bottom: -2 }}
						/>
					)}

					{/* Rounded terminal cap for Origin Station (no arrival events) */}
					{!hasArrival && (
						<View className="absolute z-20 bg-[#005045] rounded-full" style={{ left: 29, width: 10, height: 10, top: '50%', marginTop: -5 }} />
					)}

					{/* Rounded terminal cap for Destination Station (no departure events) */}
					{!hasDeparture && (
						<View className={`absolute z-20 rounded-full ${isArrivalActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} style={{ left: 29, width: 10, height: 10, top: '50%', marginTop: -5 }} />
					)}

					{/* Dot on the line */}
					<View className="absolute z-30 rounded-full bg-white" style={{ left: 30, width: 8, height: 8, top: '50%', marginTop: -4 }} />

					<View className="flex-row items-center mb-1 relative z-10">
						{/* Table Icon */}
						<View className="w-[32px] items-start">
							<Pressable onPress={() => router.navigate("/station-board")}>
								<Icon name="table_chart" size={22} color="#4b5563" />
							</Pressable>
						</View>

						{/* Station Name & Bin */}
						<View className="ml-7 flex-1 flex-row items-center justify-between">
							<ThemedText className="text-base font-plus-jakarta-bold !text-gray-950 mr-2 flex-shrink">
								{station.name}
							</ThemedText>
							<View className="bg-[#e5e7eb] px-2 py-1 rounded">
								<ThemedText className="text-[11px] font-plus-jakarta-bold !text-gray-700">
									BIN {station.bin}
								</ThemedText>
							</View>
						</View>
					</View>
				</View>

				{/* Departures Block (Badge + Events) */}
				<View className="relative">
					{hasDeparture && (
						<View 
							className={`absolute top-0 bottom-[-2px] z-0 ${isDepartureActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} 
							style={{ left: 29, width: 10 }}
						/>
					)}
					<View className="ml-[64px] pl-3 relative z-10">
						{/* L-Bracket for Departures */}
						<View 
							className="absolute border-gray-300"
							style={{
								left: 0,
								top: 0,
								bottom: -4,
								width: 12,
								borderLeftWidth: 2,
								borderBottomWidth: 2,
								borderBottomLeftRadius: 8,
								borderStyle: 'dotted'
							}}
						/>
						
						{/* Executive in coda badge */}
						<View className="bg-[#f3f4f6] self-start px-2 py-0.5 rounded border border-gray-200 mb-1">
							<ThemedText className="text-[11px] font-plus-jakarta-medium !text-gray-700">
								Executive in coda
							</ThemedText>
						</View>

						{/* Departure Events */}
						{hasDeparture && departureEvents.map((ev, idx) => (
							<View key={`dep-${idx}`} className="flex-row items-center justify-between mb-1">
								<ThemedText 
									className={`text-[13px] ${
										ev.isActual 
											? "font-plus-jakarta-bold !text-[#005045]" 
											: "font-plus-jakarta-medium !text-gray-500"
									}`}
								>
									{ev.label}
								</ThemedText>
								<ThemedText 
									className={`text-[13px] ${
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

				{/* Spacer block replaces the pb-8 padding */}
				<View className="relative h-8">
					{hasDeparture && (
						<View 
							className={`absolute top-0 bottom-[-2px] z-0 ${isDepartureActual ? 'bg-[#005045]' : 'bg-[#e5e7eb]'}`} 
							style={{ left: 29, width: 10 }}
						/>
					)}
				</View>
			</View>
		</View>
	);
}
