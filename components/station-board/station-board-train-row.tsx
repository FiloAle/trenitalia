import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { Pressable, View } from "react-native";

export interface TrainData {
	time: string;
	destination: string;
	trainName: string;
	status: string;
	bin: string;
	binType: string;
	hasMenu: boolean;
}

interface StationBoardTrainRowProps {
	train: TrainData;
}

export function StationBoardTrainRow({ train }: StationBoardTrainRowProps) {
	return (
		<View className="flex-row items-center py-3 border-b border-gray-100">
			<View className="w-[15%]">
				<ThemedText className="text-sm font-google-sans-medium !text-gray-950">
					{train.time}
				</ThemedText>
			</View>
			<View className="w-[35%] pl-2 pr-2">
				<ThemedText
					className="text-sm font-google-sans-bold !text-gray-950"
					numberOfLines={1}
				>
					{train.destination}
				</ThemedText>
				<ThemedText className="text-xs font-google-sans-medium !text-gray-500">
					{train.trainName}
				</ThemedText>
			</View>
			<View className="w-[25%] pr-2 items-center">
				<ThemedText className="text-xs font-google-sans-bold !text-gray-950 text-center">
					{train.status}
				</ThemedText>
			</View>
			<View className="w-[20%] flex-row items-center justify-center relative">
				<View className="items-center justify-center">
					<ThemedText className="text-sm font-google-sans-bold !text-gray-950 text-center">
						{train.bin}
					</ThemedText>
					{!!train.binType && (
						<ThemedText className="text-[10px] font-google-sans-medium !text-gray-500 text-center">
							{train.binType}
						</ThemedText>
					)}
				</View>
				{train.hasMenu && (
					<Pressable className="absolute right-0 -mr-6">
						<Icon name="more_vert" size={20} color="#9ca3af" />
					</Pressable>
				)}
			</View>
		</View>
	);
}
