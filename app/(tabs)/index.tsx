import { InfoBanner } from "@/components/home/info-banner";
import { QuickSearches } from "@/components/home/quick-searches";
import { TicketPurchaseCard } from "@/components/home/ticket-purchase-card";
import { SearchModal } from "@/components/modals/search-modal";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useState } from "react";

import { PromoCarousel } from "@/components/home/promo-carousel";
import { TravelSection } from "@/components/home/travel-section";

export default function HomeScreen() {
	const [searchVisible, setSearchVisible] = useState(false);

	return (
		<>
			<ParallaxScrollView
				headerBackgroundColor={{ light: "#A1CEDC", dark: "#A1CEDC" }}
				headerImage={
					<Image
						source={require("../../assets/images/venezia.jpg")}
						className="h-full w-full"
						style={{ width: "100%", height: "100%" }}
						contentFit="cover"
					/>
				}
			>
				<ThemedView className="gap-8 pb-10">
					<ThemedView className="gap-4">
						<TicketPurchaseCard onPress={() => setSearchVisible(true)} />
						<InfoBanner />
					</ThemedView>
					<QuickSearches />
					<PromoCarousel />
					<ThemedView className="gap-4">
						<TravelSection />
						<InfoBanner
							title="Hai bisogno di aiuto?"
							description="Rispondiamo alle tue domande"
						/>
					</ThemedView>
				</ThemedView>
			</ParallaxScrollView>

			<SearchModal
				isVisible={searchVisible}
				onClose={() => setSearchVisible(false)}
			/>
		</>
	);
}
