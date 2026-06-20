import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CheckoutHeaderProps {
	title: React.ReactNode;
	onBack?: () => void;
	showCartBadge?: boolean;
	rightElement?: React.ReactNode;
}

export function CheckoutHeader({
	title,
	onBack,
	showCartBadge = true,
	rightElement,
}: CheckoutHeaderProps) {
	const insets = useSafeAreaInsets();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	return (
		<View
			className="bg-primary-600 px-5"
			style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
		>
			{/* Navigation Row */}
			<View className="flex-row items-center justify-between relative">
				<Pressable onPress={handleBack} className="p-2 -ml-2 z-10">
					<Icon name="arrow_back" size={26} className="!text-white" />
				</Pressable>

				<View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
					{typeof title === "string" ? (
						<ThemedText className="text-[17px] font-google-sans-bold !text-white">
							{title}
						</ThemedText>
					) : (
						title
					)}
				</View>

				<View className="flex-row items-center gap-5 mr-1 z-10">
					{rightElement ? (
						rightElement
					) : (
						<Pressable onPress={() => router.navigate("/")}>
							<Icon name="home" size={26} className="!text-white" />
						</Pressable>
					)}
				</View>
			</View>
		</View>
	);
}
