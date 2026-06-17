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
	hideIcon = false,
}: InfoBannerProps) {
	return (
		<Pressable className="flex-row items-start rounded-2xl bg-gray-100 px-4 py-3">
			<Icon
				name="info"
				size={20}
				className="-ml-0.5 mr-3 -mt-[2.5px] !text-gray-800"
			/>
			<View className="flex-1 gap-2">
				<ThemedText
					className={`font-plus-jakarta-semibold text-[14px] !text-gray-800 ${!description ? "leading-snug font-plus-jakarta-medium" : ""}`}
				>
					{title}
				</ThemedText>
				{description && (
					<View className="flex-row items-start mt-0.5">
						<ThemedText className="flex-1 mr-1 font-plus-jakarta text-[13px] !text-gray-600 leading-tight">
							{description}
						</ThemedText>
					</View>
				)}
			</View>
		</Pressable>
	);
}
