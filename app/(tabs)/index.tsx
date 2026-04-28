import { InfoBanner } from "@/components/home/info-banner";
import { QuickSearches } from "@/components/home/quick-searches";
import { TicketPurchaseCard } from "@/components/home/ticket-purchase-card";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";

export default function HomeScreen() {
	return (
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
			<ThemedView className="gap-8">
				<ThemedView className="gap-4">
					<TicketPurchaseCard />
					<InfoBanner />
				</ThemedView>
				<QuickSearches />
			</ThemedView>
		</ParallaxScrollView>
	);
}
