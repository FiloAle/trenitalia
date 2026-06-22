import TrenitaliaLogo from "@/assets/logos/trenitalia.svg";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { DeviceEventEmitter, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DiscountCard } from "@/components/home/discount-card";
import { InfoBanner } from "@/components/home/info-banner";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { SectionHeader } from "@/components/home/section-header";
import { TravelSolutionCard } from "@/components/search/travel-solution-card";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { getPurchasedTrips, PurchasedTrip } from "@/utils/trips-store";

export default function HomeScreen() {
	const insets = useSafeAreaInsets();
	const [nextTrip, setNextTrip] = useState<PurchasedTrip | null>(null);

	const handleOpenSearch = () => {
		router.push("/search");
	};

	useFocusEffect(
		useCallback(() => {
			const trips = getPurchasedTrips();
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const upcoming = trips.find((t) => {
				if (!t.date) return false;
				const tDate = new Date(t.date);
				tDate.setHours(0, 0, 0, 0);
				return tDate.getTime() >= today.getTime();
			});
			setNextTrip(upcoming || null);
		}, []),
	);

	return (
		<View className="flex-1 bg-white">
			<View
				className="bg-primary-500 overflow-hidden relative"
				style={{ paddingTop: insets.top + 4 }}
			>
				<LinearGradient
					pointerEvents="none"
					colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
					start={{ x: 1, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: 450,
					}}
				/>

				<View className="h-14 flex-row items-center justify-between px-6 relative z-10">
					<View style={{ width: 24 }} />
					<View
						className="absolute left-0 right-0 items-center justify-center pointer-events-none"
						style={{ top: 0, bottom: 0 }}
					>
						<TrenitaliaLogo width={100} height={25} />
					</View>
					<View className="flex-row items-center gap-4">
						<Icon name="notifications" size={24} className="!text-white" />
					</View>
				</View>

				<View className="px-6 pt-10 pb-8 relative z-10">
					<ThemedText className="text-[18px] font-google-sans-regular !text-white">
						Ciao {USER_DATA.firstName},
					</ThemedText>
					<ThemedText className="text-[24px] font-google-sans-bold !text-white">
						Dove vuoi andare?
					</ThemedText>
					<Pressable
						onPress={handleOpenSearch}
						className="mt-6 flex-row items-center rounded-full bg-white px-5 py-4 shadow-sm"
					>
						<Icon name="search" size={24} color="#4b5563" />
						<ThemedText className="ml-3 text-[16px] font-google-sans-medium !text-neutral-600">
							Cerca la tua destinazione
						</ThemedText>
					</Pressable>
				</View>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="bg-white gap-8 px-5 py-8">
					{nextTrip && (
						<View className="gap-4">
							<SectionHeader title="Il tuo prossimo viaggio" />
							<TravelSolutionCard
								isPurchasedTrip
								solution={nextTrip as any}
								route={{
									from: nextTrip.trains[0].origin!,
									to: nextTrip.trains[nextTrip.trains.length - 1].destination!,
								}}
								onPress={() =>
									router.push({
										pathname: "/ticket-detail" as any,
										params: { tripId: nextTrip.id },
									})
								}
							/>
						</View>
					)}

					<DiscountCard />

					<View className="gap-4">
						<SectionHeader
							title="Notizie di infomobilità"
							actionText="Vedi tutte"
							onActionPress={() => {
								router.push("/info");
								setTimeout(() => {
									DeviceEventEmitter.emit("openInfoNews");
								}, 100);
							}}
						/>
						<InfoBanner
							title="Piano di ammodernamento della rete"
							description={
								"Per l'estate è previsto l'ammodernamento di parte dell'infrastruttura. I tempi di viaggio possono subire variazioni."
							}
							hideIcon={true}
						/>
					</View>
				</View>

				<View className="bg-neutral-50 flex-1 gap-8 px-5 py-8">
					<View className="gap-4">
						<SectionHeader title="Promo e servizi" actionText="Vedi tutte" />
						<PromoCarousel />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
