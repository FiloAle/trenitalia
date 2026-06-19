import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView, View } from "react-native";

interface TimePickerColumnProps {
	items: string[];
	selectedValue: string;
	onValueChange: (value: string) => void;
	itemHeight?: number;
}

export function TimePickerColumn({ 
	items, 
	selectedValue, 
	onValueChange, 
	itemHeight = 40 
}: TimePickerColumnProps) {
	// Find initial index to set scroll offset
	const initialIndex = items.findIndex((item) => item === selectedValue);
	const initialOffset = initialIndex >= 0 ? initialIndex * itemHeight : 0;

	return (
		<View className="w-[60px] h-full items-center">
			<ScrollView 
				className="w-full"
				showsVerticalScrollIndicator={false} 
				snapToInterval={itemHeight}
				decelerationRate="fast"
				nestedScrollEnabled={true}
				contentContainerStyle={{ paddingVertical: itemHeight + 4 }}
				contentOffset={{ x: 0, y: initialOffset }}
				scrollEventThrottle={16}
				onScroll={(e) => {
					const index = Math.round(e.nativeEvent.contentOffset.y / itemHeight);
					if (index >= 0 && index < items.length) {
						onValueChange(items[index]);
					}
				}}
			>
				{items.map((item, i) => (
					<View 
						key={i} 
						className="items-center justify-center rounded-full w-full"
						style={{ height: itemHeight }}
					>
						<ThemedText 
							className={`text-lg font-google-sans-bold ${
								item === selectedValue ? "!text-white" : "!text-gray-950"
							}`}
						>
							{item}
						</ThemedText>
					</View>
				))}
			</ScrollView>
		</View>
	);
}
