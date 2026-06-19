import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { PurchasedTrip } from "@/utils/trips-store";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

interface TicketItemProps {
	ticket: PurchasedTrip;
	onLongPress?: () => void;
}

export function TicketItem({ ticket, onLongPress }: TicketItemProps) {
	const trains = ticket.trains;
	const firstTrain = trains[0];
	const lastTrain = trains[trains.length - 1];

	const route = `${firstTrain.origin} - ${lastTrain.destination}`;
	const time = `${ticket.departureTime} - ${ticket.arrivalTime}`;
	const details =
		trains.length === 1
			? "Diretto"
			: `${trains.length - 1} Camb${trains.length - 1 > 1 ? "i" : "io"}`;

	const dateObj = new Date(ticket.date || new Date());
	const day = dateObj.getDate().toString();
	const monthNames = [
		"Gen",
		"Feb",
		"Mar",
		"Apr",
		"Mag",
		"Giu",
		"Lug",
		"Ago",
		"Set",
		"Ott",
		"Nov",
		"Dic",
	];
	const month = monthNames[dateObj.getMonth()];

	const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });
	const [notchX, setNotchX] = useState(0);
	const [lineHeight, setLineHeight] = useState(0);

	const getPathData = () => {
		const R = 16; // Border radius
		const NR = 8; // Notch radius
		const minX = 0.5;
		const minY = 0.5;
		const maxX = cardLayout.width - 0.5;
		const maxY = cardLayout.height - 0.5;
		const NX = notchX;

		return `
			M ${minX + R} ${minY}
			L ${NX - NR} ${minY}
			A ${NR} ${NR} 0 0 0 ${NX + NR} ${minY}
			L ${maxX - R} ${minY}
			A ${R} ${R} 0 0 1 ${maxX} ${minY + R}
			L ${maxX} ${maxY - R}
			A ${R} ${R} 0 0 1 ${maxX - R} ${maxY}
			L ${NX + NR} ${maxY}
			A ${NR} ${NR} 0 0 0 ${NX - NR} ${maxY}
			L ${minX + R} ${maxY}
			A ${R} ${R} 0 0 1 ${minX} ${maxY - R}
			L ${minX} ${minY + R}
			A ${R} ${R} 0 0 1 ${minX + R} ${minY}
			Z
		`;
	};

	const showSvgBg = cardLayout.width > 0 && cardLayout.height > 0 && notchX > 0;
	const dashLength = 4;
	const computedGap = 4;

	return (
		<Link
			href={{
				pathname: "/ticket-detail" as any,
				params: {
					tripId: ticket.id,
				},
			}}
			asChild
		>
			<Pressable
				onLongPress={onLongPress}
				className="flex-row px-4 py-6 relative overflow-hidden"
				onLayout={(e) => setCardLayout(e.nativeEvent.layout)}
				style={{
					borderRadius: 16,
					borderWidth: 0,
				}}
			>
				{!showSvgBg && (
					<View className="absolute inset-0 rounded-2xl border border-gray-200 bg-white" />
				)}
				{showSvgBg && (
					<Svg
						width={cardLayout.width}
						height={cardLayout.height}
						style={{ position: "absolute", top: 0, left: 0 }}
					>
						<Path
							d={getPathData()}
							fill="white"
							stroke="#e5e7eb"
							strokeWidth={1}
						/>
					</Svg>
				)}

				{/* Dashed Separator */}
				{showSvgBg && (
					<View
						className="absolute"
						style={{
							left: notchX,
							top: 8,
							bottom: 8,
							width: 1,
							zIndex: 10,
						}}
						onLayout={(e) => setLineHeight(e.nativeEvent.layout.height)}
					>
						{lineHeight > 0 && (
							<Svg height={lineHeight} width="1" className="absolute">
								<Line
									x1="0.5"
									y1="0"
									x2="0.5"
									y2={lineHeight}
									stroke="#e5e7eb"
									strokeWidth="1"
									strokeDasharray={`${dashLength}, ${computedGap}`}
								/>
							</Svg>
						)}
					</View>
				)}

				{/* Date column */}
				<View
					className="mr-4 items-center justify-center pr-4"
					onLayout={(e) => {
						setNotchX(e.nativeEvent.layout.x + e.nativeEvent.layout.width);
					}}
				>
					<ThemedText className="text-[25px] font-google-sans-semibold !text-gray-900">
						{day}
					</ThemedText>
					<ThemedText className="text-[15px] font-google-sans-semibold !text-gray-900">
						{month}
					</ThemedText>
				</View>

				{/* Info column */}
				<View className="flex-1">
					<ThemedText className="mb-1 text-[13px] font-google-sans-medium !text-gray-500">
						Biglietto
					</ThemedText>
					<ThemedText className="mb-1 text-[14px] font-google-sans-medium !text-gray-950">
						{route}
					</ThemedText>
					<View className="flex-row items-center">
						<ThemedText className="mr-2 text-[13px] font-google-sans-medium !text-gray-500">
							{time} · {details}
						</ThemedText>
						<Icon name="cloud" size={16} color="#9ca3af" />
					</View>
				</View>
			</Pressable>
		</Link>
	);
}
