import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "expo-linear-gradient";
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
	children?: React.ReactNode;
}

export function PageHeader({
	title,
	showBackButton = true,
	onBack,
	showShareButton = false,
	onShare,
	rightElement,
	children,
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
			className={`bg-primary-500 relative overflow-hidden ${children ? "" : "pb-2"}`}
			style={{ paddingTop: insets.top + 4 }}
		>
			<LinearGradient
				pointerEvents="none"
				colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
				start={{ x: 1, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{ position: "absolute", top: 0, left: 0, right: 0, height: 450 }}
			/>
			<View className="h-14 flex-row items-center justify-between px-4 relative z-10">
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
					<View className="mr-2">{rightElement}</View>
				) : showShareButton ? (
					<Pressable onPress={onShare}>
						<Icon name="ios_share" size={26} className="!text-white mr-2" />
					</Pressable>
				) : null}
			</View>
			{children && <View className="relative z-10">{children}</View>}
		</View>
	);
}
