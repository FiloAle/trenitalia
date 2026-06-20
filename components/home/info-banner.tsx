import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable, View } from "react-native";

interface InfoBannerProps {
	title?: string;
	description?: string;
	hideIcon?: boolean;
}

export function InfoBanner({
	title = "Informazioni sulla circolazione",
	description,
}: InfoBannerProps) {
	return (
		<Pressable className="flex-row items-start rounded-2xl bg-neutral-100 px-4 py-3">
			<Icon
				name="info"
				size={20}
				className="-ml-0.5 mr-3 -mt-[2.5px] !text-neutral-800"
			/>
			<View className="flex-1 gap-1">
				<ThemedText
					className={`font-google-sans-semibold text-[14px] !text-neutral-800 ${!description ? "leading-snug font-google-sans-medium" : ""}`}
				>
					{title}
				</ThemedText>
				{description && (
					<View className="flex-row items-start">
						<ThemedText className="flex-1 mr-1 font-google-sans-regular text-[13px] !text-neutral-600 leading-tight">
							{description}
						</ThemedText>
					</View>
				)}
			</View>
		</Pressable>
	);
}
