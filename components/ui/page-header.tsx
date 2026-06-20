import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PageHeaderProps {
	title?: React.ReactNode;
	showBackButton?: boolean;
	onBack?: () => void;
	showShareButton?: boolean;
	onShare?: () => void;
	rightElement?: React.ReactNode;
}

export function PageHeader({
	title,
	showBackButton = true,
	onBack,
	showShareButton = false,
	onShare,
	rightElement,
}: PageHeaderProps) {
	const insets = useSafeAreaInsets();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.back();
		}
	};

	return (
		<View
			className="bg-primary-600 pb-2"
			style={{ paddingTop: insets.top + 4 }}
		>
			<View className="h-14 flex-row items-center justify-between px-4">
				<View className="flex-row items-center flex-1">
					{showBackButton && (
						<Pressable onPress={handleBack} className="-ml-0.5 mr-1">
							<Icon
								name="chevron_left"
								size={32}
								className="!text-white"
								weight={300}
							/>
						</Pressable>
					)}
					<View className={showBackButton ? "-ml-1 flex-1" : "ml-1 flex-1"}>
						{typeof title === "string" ? (
							<ThemedText
								className="text-3xl font-google-sans-bold !text-white"
								numberOfLines={1}
							>
								{title}
							</ThemedText>
						) : (
							title
						)}
					</View>
				</View>

				{rightElement ? (
					<View className="ml-2">{rightElement}</View>
				) : showShareButton ? (
					<Pressable onPress={onShare} className="p-2 ml-2">
						<Icon name="ios_share" size={26} className="!text-white" />
					</Pressable>
				) : null}
			</View>
		</View>
	);
}
