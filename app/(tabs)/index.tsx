import ParallaxScrollView from "@/components/parallax-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { DiscountCard } from "@/components/home/discount-card";
import { InfoBanner } from "@/components/home/info-banner";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { SectionHeader } from "@/components/home/section-header";
import { ThemedText } from "@/components/themed-text";
import { TicketItem } from "@/components/trips/ticket-item";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { getPurchasedTrips, PurchasedTrip } from "@/utils/trips-store";
import { router } from "expo-router";

export default function HomeScreen() {
	const [nextTrip, setNextTrip] = useState<PurchasedTrip | null>(null);

	const handleOpenSearch = () => {
		router.push("/search");
	};

	useFocusEffect(
		useCallback(() => {
			const trips = getPurchasedTrips();
			const now = new Date();
			const upcoming = trips.find((t) => t.date && new Date(t.date) > now);
			setNextTrip(upcoming || trips[0] || null); // Fallback to first if all in past, just in case
		}, []),
	);

	return (
		<>
			<ParallaxScrollView
				headerBackgroundColor={{ light: "#032c2e", dark: "#032c2e" }}
				lightColor="#f9fafb"
				darkColor="#f9fafb"
				headerImage={
					<View className="flex-1">
						<LinearGradient
							colors={["#032c2e", "#064448"]}
							style={StyleSheet.absoluteFill}
						/>
						<View className="flex-1 justify-end px-6 pb-8">
							<ThemedText className="text-[18px] font-plus-jakarta !text-white">
								Ciao {USER_DATA.firstName},
							</ThemedText>
							<ThemedText className="text-[24px] font-plus-jakarta-bold !text-white">
								Dove vuoi andare?
							</ThemedText>
							<Pressable
								onPress={handleOpenSearch}
								className="mt-6 flex-row items-center rounded-full bg-white px-5 py-4"
							>
								<Icon name="search" size={24} color="#4b5563" />
								<ThemedText className="ml-3 text-[16px] font-plus-jakarta-medium !text-gray-600">
									Cerca la tua destinazione
								</ThemedText>
							</Pressable>
						</View>
					</View>
				}
			>
				<View className="bg-white gap-8 px-5 py-8 pb-10">
					{nextTrip && (
						<View className="gap-4">
							<SectionHeader title="Il tuo prossimo viaggio" />
							<TicketItem ticket={nextTrip} />
						</View>
					)}

					<DiscountCard />

					<View className="gap-4">
						<SectionHeader
							title="Notizie di infomobilità"
							actionText="Vedi tutte"
						/>
						<InfoBanner
							title="Piano di ammodernamento della rete"
							description={
								"Per l’estate 2026 sono previsti interventi di ammodernamento dell’infrastruttura ferroviaria.\nTempi di viaggio e disponibilità dei biglietti possono subire variazioni."
							}
							hideIcon={true}
						/>
					</View>
				</View>

				<View className="bg-gray-50 flex-1 gap-8 px-5 py-8 pb-12">
					<View className="gap-4">
						<SectionHeader title="Promo e servizi" actionText="Vedi tutte" />
						<PromoCarousel />
					</View>
				</View>
			</ParallaxScrollView>
		</>
	);
}
