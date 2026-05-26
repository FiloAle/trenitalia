import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

interface TimerBarProps {
	endTime: number;
	onExpire?: () => void;
}

export function TimerBar({ endTime, onExpire }: TimerBarProps) {
	const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((endTime - Date.now()) / 1000)));

	useEffect(() => {
		const interval = setInterval(() => {
			const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
			setTimeLeft(remaining);

			if (remaining <= 0) {
				clearInterval(interval);
				if (onExpire) {
					onExpire();
				} else {
					// Fallback behavior: redirect to tickets detail or home
					router.replace("/(tabs)/trips");
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [endTime, onExpire]);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

	return (
		<View className="flex-row items-center justify-between bg-[#f0f4f4] px-5 py-3">
			<ThemedText className="font-plus-jakarta-medium text-[15px] !text-gray-900">
				Completa l&apos;acquisto entro
			</ThemedText>
			<ThemedText className="font-plus-jakarta-bold text-[16px] !text-gray-950">
				{formattedTime}
			</ThemedText>
		</View>
	);
}
