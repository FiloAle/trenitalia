import { ThemedText } from "@/components/themed-text";
import React, { useEffect, useRef } from "react";
import { FlatList, View } from "react-native";

export interface SelectionSectionProps<T = any> {
	title: string;
	data: T[];
	renderItem: (item: T, index: number) => React.ReactElement;
	containerClassName?: string;
	selectedIndex?: number;
}

export function SelectionSection<T>({ 
	title, 
	data,
	renderItem,
	containerClassName = "mb-4",
	selectedIndex = 0
}: SelectionSectionProps<T>) {
	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		if (flatListRef.current && data && data.length > 0 && selectedIndex >= 0 && selectedIndex < data.length) {
			flatListRef.current.scrollToIndex({
				index: selectedIndex,
				animated: true,
				viewPosition: 0.5 // Centers the item perfectly!
			});
		}
	}, [selectedIndex, data]);

	return (
		<View className={containerClassName}>
			<ThemedText className="px-5 text-[14px] font-plus-jakarta-bold !text-gray-950 mb-2">
				{title}
			</ThemedText>
			<FlatList
				ref={flatListRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 20 }}
				data={data}
				renderItem={({ item, index }) => renderItem(item, index)}
				keyExtractor={(item: any, index) => item.id || index.toString()}
				onScrollToIndexFailed={(info) => {
					const wait = new Promise(resolve => setTimeout(resolve, 100));
					wait.then(() => {
						flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
					});
				}}
				ItemSeparatorComponent={() => <View className="w-3" />}
			/>
		</View>
	);
}
