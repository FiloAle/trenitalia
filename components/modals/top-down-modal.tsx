import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { Pressable, View } from "react-native";

export interface TopDownModalButton {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
}

interface TopDownModalProps {
	isVisible: boolean;
	onClose?: () => void;
	title: string;
	description?: string;
	iconName?: string;
	iconColor?: string;
	iconBgColor?: string;
	buttons: TopDownModalButton[];
}

export function TopDownModal({
	isVisible,
	onClose = () => {},
	title,
	description,
	iconName,
	iconColor = "#004141",
	iconBgColor = "#e6f2f0",
	buttons,
}: TopDownModalProps) {
	return (
		<BottomSheet isVisible={isVisible} onClose={onClose} hideCloseButton>
			<View className="items-center w-full pt-4">
				{iconName && (
					<View
						className="mb-4 h-14 w-14 items-center justify-center rounded-full"
						style={{ backgroundColor: iconBgColor }}
					>
						<Icon name={iconName} size={32} color={iconColor} />
					</View>
				)}
				<ThemedText className="mb-2 text-center text-xl font-google-sans-bold !text-neutral-950">
					{title}
				</ThemedText>
				{description && (
					<ThemedText className="mb-6 text-center text-[15px] font-google-sans-medium !text-neutral-600">
						{description}
					</ThemedText>
				)}

				<View className="w-full gap-3 mt-2">
					{buttons.map((btn, index) => {
						if (btn.variant === "secondary") {
							return (
								<Pressable
									key={index}
									onPress={btn.onPress}
									className="w-full items-center justify-center rounded-2xl border border-neutral-300 py-3.5"
								>
									<ThemedText className="text-[15px] font-google-sans-bold !text-neutral-950">
										{btn.label}
									</ThemedText>
								</Pressable>
							);
						}
						return (
							<MainButton key={index} title={btn.label} onPress={btn.onPress} />
						);
					})}
				</View>
			</View>
		</BottomSheet>
	);
}
