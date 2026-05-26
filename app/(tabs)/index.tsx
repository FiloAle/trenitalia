import { QuickSearches } from "@/components/home/quick-searches";
import { TicketPurchaseCard } from "@/components/home/ticket-purchase-card";
import { LoyaltyMenu } from "@/components/modals/loyalty-menu";
import { SearchModal } from "@/components/modals/search-modal";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useState } from "react";
import { View } from "react-native";

import { InfoBanner } from "@/components/home/info-banner";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { TravelSection } from "@/components/home/travel-section";
import { ThemedText } from "@/components/themed-text";

export default function HomeScreen() {
	const [searchVisible, setSearchVisible] = useState(false);
	const [loyaltyVisible, setLoyaltyVisible] = useState(false);
	const [searchParams, setSearchParams] = useState<{
		from?: string;
		to?: string;
		step?: "searching" | "details";
	}>({});

	const handleOpenSearch = () => {
		setSearchParams({});
		setSearchVisible(true);
	};

	const handleQuickSearch = (from: string, to: string) => {
		setSearchParams({ from, to, step: "details" });
		setSearchVisible(true);
	};

	return (
		<>
			<ParallaxScrollView
				onProfilePress={() => setLoyaltyVisible(true)}
				headerBackgroundColor={{ light: "#A1CEDC", dark: "#A1CEDC" }}
				headerImage={
					<View className="flex-1">
						<Image
							source={require("../../assets/images/nature.jpg")}
							className="h-full w-full"
							style={{ width: "100%", height: "100%" }}
							contentFit="cover"
						/>
						<View className="absolute inset-0 items-center justify-center bg-black/40">
							<View className="items-center mt-[128px]">
								<ThemedText className="text-[18px] font-plus-jakarta-extrabold !text-white tracking-tight">
									FRECCIADAYS
								</ThemedText>
								<ThemedText className="text-[18px] font-plus-jakarta-medium !text-white uppercase tracking-tight -mt-1">
									Ci sono giorni fatti per viaggiare
								</ThemedText>
								<ThemedText className="text-[11px] font-plus-jakarta-medium !text-white text-center -mt-1">
									Il sabato e dal martedì al giovedì viaggi con sconti fino al
									60%
								</ThemedText>
								<ThemedText className="text-[12px] mt-2 font-plus-jakarta-semibold !text-white text-center uppercase">
									Scopri di più
								</ThemedText>
								<ThemedText className="text-[7px] mt-2 font-plus-jakarta-medium !text-white text-center">
									L&apos;offerta è soggetta a condizioni e limitazioni
								</ThemedText>
							</View>
						</View>
					</View>
				}
			>
				<ThemedView className="gap-8 pb-10">
					<ThemedView className="gap-4">
						<TicketPurchaseCard onPress={handleOpenSearch} />
						<InfoBanner />
					</ThemedView>
					<QuickSearches onSelectRoute={handleQuickSearch} />
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
				initialFrom={searchParams.from}
				initialTo={searchParams.to}
				initialStep={searchParams.step}
			/>

			<LoyaltyMenu
				isVisible={loyaltyVisible}
				onClose={() => setLoyaltyVisible(false)}
			/>
		</>
	);
}
