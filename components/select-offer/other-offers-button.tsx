import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable, View } from "react-native";

export function OtherOffersButton() {
	return (
		<View className="px-5 pb-5">
			<Pressable className="flex-row items-center justify-between rounded-2xl border border-neutral-200 p-4 active:bg-neutral-50">
				<View className="flex-row items-center">
					<Icon
						name="confirmation_number"
						size={24}
						className="!text-primary-600 mr-3"
						weight={300}
					/>
					<ThemedText className="text-[14px] font-google-sans-medium !text-neutral-950">
						Vedi altre offerte
					</ThemedText>
				</View>
				<Icon name="chevron_right" size={24} className="!text-neutral-950" />
			</Pressable>
		</View>
	);
}
