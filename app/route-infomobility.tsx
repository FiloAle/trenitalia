import { PageHeader } from "@/components/ui/page-header";
import { RouteInfomobilityContent } from "@/components/train-details/route-infomobility-content";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function RouteInfomobilityScreen() {
	const params = useLocalSearchParams();
	const tripId = params.tripId as string;

	return (
		<View className="flex-1 bg-white">
			<PageHeader title="Infomobilità Percorso" showBackButton={true} />
			<RouteInfomobilityContent tripId={tripId} />
		</View>
	);
}
