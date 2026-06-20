import { selectedSolutionCache } from "@/api/search";

import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { USER_DATA } from "@/constants/user";
import { addPurchasedTrip, pendingPassengers } from "@/utils/trips-store";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
	const params = useLocalSearchParams();
	const insets = useSafeAreaInsets();
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const savedRef = useRef(false);

	useEffect(() => {
		if (savedRef.current) return;
		savedRef.current = true;

		if (selectedSolutionCache && params.isAddService !== "true") {
			const sol = selectedSolutionCache;
			const generateCode = (len: number) => {
				const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				let res = "";
				for (let i = 0; i < len; i++)
					res += chars.charAt(Math.floor(Math.random() * chars.length));
				return res;
			};
			const generateNumCode = (len: number) => {
				const chars = "0123456789";
				let res = "";
				for (let i = 0; i < len; i++)
					res += chars.charAt(Math.floor(Math.random() * chars.length));
				return res;
			};

			const passengersList =
				pendingPassengers.length > 0
					? pendingPassengers
					: [`${USER_DATA.firstName} ${USER_DATA.lastName}`];

			const enrichedTrains: any[] = [];

			passengersList.forEach((passengerName) => {
				sol.trains.forEach((train: any) => {
					const isRegionale =
						train.type === "Regionale" ||
						train.type?.toLowerCase().includes("reg");
					enrichedTrains.push({
						...train,
						passengerName,
						pnr: generateCode(6),
						cp: isRegionale ? undefined : generateNumCode(6),
						coach: isRegionale
							? undefined
							: (Math.floor(Math.random() * 11) + 1).toString(),
						seat: isRegionale
							? undefined
							: `${Math.floor(Math.random() * 18) + 1}${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}`,
					});
				});
			});

			let finalDate = sol.date;
			if (sol.date && sol.departureTime) {
				const dateObj = new Date(sol.date);
				const [hh, mm] = sol.departureTime.split(":").map(Number);
				if (!isNaN(hh) && !isNaN(mm)) {
					dateObj.setHours(hh, mm, 0, 0);
					finalDate = dateObj.toISOString();
				}
			}

			addPurchasedTrip({
				id: Math.random().toString(36).substring(7),
				date: finalDate,
				departureTime: sol.departureTime,
				arrivalTime: sol.arrivalTime,
				duration: sol.duration,
				price: sol.price,
				offerName: sol.offerName,
				trains: enrichedTrains,
			});
		}
	}, []);

	return (
		<View className="flex-1 bg-primary-600">
			<Stack.Screen options={{ headerShown: false }} />

			{/* Top Bar with Close Button */}
			<View
				className="px-5 flex-row items-center justify-end"
				style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
			>
				<Pressable onPress={() => router.dismissAll()} className="p-2 -mr-2">
					<Icon name="close" size={26} color="white" weight={300} />
				</Pressable>
			</View>

			{/* Success Content */}
			<View className="flex-1 items-center justify-center px-5 pb-16">
				{/* Checkmark Badge */}
				<View className="mb-6 items-center justify-center">
					<Icon
						name="verified"
						type="rounded"
						size={80}
						color="white"
						weight={300}
					/>
				</View>

				<ThemedText className="text-[24px] font-google-sans-bold !text-white text-center mb-3">
					Acquisto effettuato!
				</ThemedText>
				<ThemedText className="text-[16px] font-google-sans-regular !text-white text-center mb-6">
					A breve riceverai una mail di conferma {"\n"} con il tuo biglietto.
				</ThemedText>
			</View>

			{/* Bottom White Banner */}
			<View
				className="bg-white rounded-t-3xl px-5 pt-6"
				style={{ paddingBottom: insets.bottom + 20 }}
			>
				{/* Notifications Switch */}
				<View className="flex-row items-center justify-between mb-8 px-2">
					<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950">
						Ricevi notifiche sui tuoi viaggi
					</ThemedText>
					<View
						className={
							Platform.OS === "ios" ? "bg-neutral-200 rounded-full" : ""
						}
					>
						<Switch
							value={notificationsEnabled}
							onValueChange={setNotificationsEnabled}
							trackColor={{ false: "#e5e7eb", true: "#006666" }}
							thumbColor={"#ffffff"}
							className={Platform.OS === "ios" ? "-mr-0.5" : ""}
						/>
					</View>
				</View>

				{/* Action Buttons */}
				<View className="flex-row items-center gap-4">
					<View className="flex-1">
						<Pressable
							onPress={() => router.dismissAll()}
							style={{ height: 56 }}
							className="w-full border border-neutral-300 rounded-2xl items-center justify-center"
						>
							<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950">
								Torna alla Home
							</ThemedText>
						</Pressable>
					</View>
					<View className="flex-1">
						<MainButton
							title="Vai ai miei viaggi"
							style={{ height: 56 }}
							onPress={() => router.navigate("/(tabs)/trips")}
						/>
					</View>
				</View>
			</View>
		</View>
	);
}
