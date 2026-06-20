import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";

export interface ServiceProps {
	id: string;
	title: string;
	description: string;
	price: number;
	priceLabel?: string;
	image: any;
}

interface ServiceCardProps {
	service: ServiceProps;
	isSelected: boolean;
	onSelect: (id: string | null) => void;
}

export function ServiceCard({
	service,
	isSelected,
	onSelect,
}: ServiceCardProps) {
	return (
		<Pressable
			onPress={() => onSelect(isSelected ? null : service.id)}
			className={`overflow-hidden rounded-2xl bg-white border flex-row ${
				isSelected ? "border-primary-600" : "border-neutral-200"
			}`}
		>
			{/* Left Image */}
			<View className="w-28">
				<Image
					source={service.image}
					style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
					contentFit="cover"
				/>
			</View>

			<View className="flex-1 p-4">
				<View className="flex-row items-start justify-between">
					<ThemedText className="flex-1 pr-2 text-base font-google-sans-bold !text-neutral-950">
						{service.title}
					</ThemedText>
					<Icon name="favorite_border" size={24} color="#1f2937" />
				</View>

				<ThemedText className="mt-1 text-sm font-google-sans-medium !text-neutral-600">
					{service.description}
				</ThemedText>

				<View className="mt-4 flex-row items-center justify-between">
					{service.priceLabel ? (
						<View className="rounded bg-blue-50 px-2 py-1">
							<ThemedText className="text-xs font-google-sans-bold !text-blue-900">
								{service.priceLabel}
							</ThemedText>
						</View>
					) : (
						<ThemedText className="text-base font-google-sans-bold !text-neutral-950">
							{service.price.toFixed(2).replace(".", ",")} €
						</ThemedText>
					)}

					{isSelected ? (
						<View className="flex-row items-center gap-3">
							<View className="rounded bg-primary-600/20 px-3 py-1">
								<ThemedText className="text-sm font-google-sans-bold !text-primary-600">
									Aggiunto
								</ThemedText>
							</View>
							<Pressable onPress={() => onSelect(null)}>
								<Icon name="delete_outline" size={24} color="#1f2937" />
							</Pressable>
						</View>
					) : (
						<Icon name="add" size={24} color="#1f2937" />
					)}
				</View>
			</View>
		</Pressable>
	);
}
