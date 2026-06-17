import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";

interface TicketPurchaseCardProps {
	onPress?: () => void;
}

export function TicketPurchaseCard({ onPress }: TicketPurchaseCardProps) {
	return (
		<View className="gap-5">
			<ThemedText className="text-md font-plus-jakarta-bold !text-[#262626]">
				Acquista un biglietto
			</ThemedText>

			<Pressable className="relative" onPress={onPress}>
				<View className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
					{/* Da Section */}
					<View className="flex-row items-center border-b border-gray-200 px-4 py-4">
						<ThemedText className="mr-4 w-6 font-plus-jakarta-medium !text-gray-500">
							Da
						</ThemedText>
						<ThemedText className="flex-1 font-plus-jakarta-medium !text-gray-500">
							Stazione di partenza
						</ThemedText>
					</View>

					{/* A Section */}
					<View className="flex-row items-center px-4 py-4">
						<ThemedText className="mr-4 w-6 font-plus-jakarta-medium !text-gray-500">
							A
						</ThemedText>
						<ThemedText className="flex-1 font-plus-jakarta-medium !text-gray-500">
							Stazione di arrivo
						</ThemedText>
					</View>
				</View>

				{/* Search FAB */}
				<View
					className="absolute right-4 top-1/2 -mt-6 h-12 w-12 overflow-hidden rounded-full"
					style={{
						elevation: 4,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.2,
						shadowRadius: 4,
					}}
				>
					<LinearGradient
						colors={["#8a052b", "#f73d3d"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{
							width: "100%",
							height: "100%",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Icon name="search" size={24} color="white" />
					</LinearGradient>
				</View>
			</Pressable>
		</View>
	);
}
