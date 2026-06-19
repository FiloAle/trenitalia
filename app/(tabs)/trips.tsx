import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/trips/empty-state";
import { TicketItem } from "@/components/trips/ticket-item";
import {
	deletePurchasedTrip,
	getPurchasedTrips,
	PurchasedTrip,
} from "@/utils/trips-store";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHIPS = ["Biglietti", "Carnet", "Abbonamenti"];

const AnimatedTabLabel = ({
	chip,
	isActive,
}: {
	chip: string;
	isActive: boolean;
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			color: withTiming(isActive ? "#ffffff" : "#004141", { duration: 250 }),
		};
	}, [isActive]);

	return (
		<Animated.Text
			className="text-[14px] font-google-sans-semibold"
			style={animatedStyle}
		>
			{chip}
		</Animated.Text>
	);
};

export default function TripsScreen() {
	const insets = useSafeAreaInsets();
	const [activeChip, setActiveChip] = useState("Biglietti");
	const [tickets, setTickets] = useState<PurchasedTrip[]>([]);
	const [tabWidth, setTabWidth] = useState(0);

	const activeChipIndex = CHIPS.indexOf(activeChip);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(activeChipIndex * (tabWidth / CHIPS.length), {
						duration: 250,
					}),
				},
			],
		};
	}, [activeChipIndex, tabWidth]);

	useFocusEffect(
		useCallback(() => {
			setTickets(getPurchasedTrips());
		}, []),
	);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const nextTicket = tickets.find((t) => {
		if (!t.date) return false;
		const tDate = new Date(t.date);
		tDate.setHours(0, 0, 0, 0);
		return tDate.getTime() >= today.getTime();
	});

	const handleLongPress = (id: string) => {
		Alert.alert(
			"Elimina biglietto",
			"Sei sicuro di voler eliminare questo biglietto?",
			[
				{ text: "Annulla", style: "cancel" },
				{
					text: "Elimina",
					style: "destructive",
					onPress: () => {
						deletePurchasedTrip(id);
						setTickets(getPurchasedTrips());
					},
				},
			],
		);
	};

	return (
		<View className="flex-1 bg-white">
			{/* Header Section */}
			<View
				className={`bg-primary-600 ${nextTicket ? "pb-6" : "pb-2"}`}
				style={{ paddingTop: insets.top + 4 }}
			>
				<View
					className={`h-14 flex-row items-center px-6 mb-2`}
				>
					<ThemedText className="text-3xl font-google-sans-bold !text-white">
						I miei viaggi
					</ThemedText>
				</View>

				{nextTicket && (
					<View className="px-5 mt-1">
						<ThemedText className="text-[15px] font-google-sans-medium !text-white/90 mb-3">
							Il tuo prossimo viaggio
						</ThemedText>
						<TicketItem
							ticket={nextTicket}
							onLongPress={() => handleLongPress(nextTicket.id)}
						/>
					</View>
				)}
			</View>

			{/* Tab Selector */}
			<View className="px-5 pt-5 z-50">
				<View
					className="bg-primary-500/10 rounded-xl p-1 flex-row relative"
					onLayout={(e) => setTabWidth(e.nativeEvent.layout.width - 8)}
				>
					{tabWidth > 0 && (
						<Animated.View
							className="absolute top-1 bottom-1 bg-primary-600 rounded-lg"
							style={[
								{ left: 4, width: tabWidth / CHIPS.length },
								animatedStyle,
							]}
						/>
					)}
					{CHIPS.map((chip) => (
						<Pressable
							key={chip}
							onPress={() => setActiveChip(chip)}
							className="flex-1 items-center justify-center py-2.5 z-10"
						>
							<AnimatedTabLabel chip={chip} isActive={activeChip === chip} />
						</Pressable>
					))}
				</View>
			</View>

			{/* Content Section */}
			<ScrollView
				className="flex-1 px-5 pt-10 -mt-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
			>
				{activeChip === "Biglietti" ? (
					<>
						{/* Tickets List */}
						{[...tickets].reverse().map((ticket) => (
							<TicketItem
								key={ticket.id}
								ticket={ticket}
								onLongPress={() => handleLongPress(ticket.id)}
							/>
						))}
					</>
				) : (
					<EmptyState activeChip={activeChip} />
				)}
			</ScrollView>
		</View>
	);
}
