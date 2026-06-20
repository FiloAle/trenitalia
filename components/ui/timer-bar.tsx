import { ThemedText } from "@/components/themed-text";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface TimerBarProps {
	endTime: number;
	onExpire?: () => void;
}

export function TimerBar({ endTime, onExpire }: TimerBarProps) {
	const [timeLeft, setTimeLeft] = useState(() =>
		Math.max(0, Math.floor((endTime - Date.now()) / 1000)),
	);

	useEffect(() => {
		if (!endTime || isNaN(endTime)) return;

		const interval = setInterval(() => {
			const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
			setTimeLeft(remaining);

			if (remaining <= 0) {
				clearInterval(interval);
				if (onExpire) {
					onExpire();
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [endTime, onExpire]);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

	return (
		<View className="bg-neutral-100 px-5 py-2.5 flex-row justify-between items-center border-b border-neutral-200">
			<ThemedText className="text-[13px] font-google-sans-medium !text-neutral-900">
				Completa l&apos;acquisto entro
			</ThemedText>
			<ThemedText className="text-[14px] font-google-sans-bold !text-neutral-950">
				{formattedTime}
			</ThemedText>
		</View>
	);
}
