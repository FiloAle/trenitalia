import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
	isVisible: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	hideCloseButton?: boolean;
	contentPaddingBottom?: number;
	heightPercentage?: number;
}

export function BottomSheet({
	isVisible,
	onClose,
	title,
	children,
	hideCloseButton = false,
	contentPaddingBottom,
	heightPercentage,
}: BottomSheetProps) {
	const insets = useSafeAreaInsets();
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const sheetSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
	const [shouldRender, setShouldRender] = React.useState(isVisible);

	useEffect(() => {
		if (isVisible) {
			setShouldRender(true);
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(sheetSlideAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(sheetSlideAnim, {
					toValue: SCREEN_HEIGHT,
					duration: 250,
					useNativeDriver: true,
				}),
			]).start(() => {
				setShouldRender(false);
			});
		}
	}, [isVisible]);

	const handleClose = () => {
		onClose();
	};

	if (!shouldRender && !isVisible) return null;

	return (
		<Modal
			visible={shouldRender}
			transparent
			animationType="none"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1 justify-end"
			>
				<TouchableWithoutFeedback onPress={handleClose}>
					<Animated.View
						style={[
							StyleSheet.absoluteFill,
							{ opacity: fadeAnim, backgroundColor: "rgba(0,0,0,0.7)" },
						]}
					/>
				</TouchableWithoutFeedback>
					<Animated.View
						style={{
							transform: [{ translateY: sheetSlideAnim }],
							backgroundColor: "white",
							borderTopLeftRadius: 32,
							borderTopRightRadius: 32,
							paddingHorizontal: 20,
							paddingTop: 20,
							paddingBottom: contentPaddingBottom !== undefined ? insets.bottom + contentPaddingBottom : insets.bottom,
							maxHeight: SCREEN_HEIGHT * 0.9,
							height: heightPercentage ? SCREEN_HEIGHT * heightPercentage : undefined,
						}}
					>
					{(title || !hideCloseButton) && (
						<View className="flex-row items-center justify-center mb-4 relative min-h-[32px]">
							{!hideCloseButton && (
								<Pressable onPress={handleClose} className="absolute left-0 z-10 p-1 -ml-1">
									<Icon
										name="close"
										size={28}
										className="!text-gray-800"
										weight={300}
									/>
								</Pressable>
							)}
							{title ? (
								<ThemedText className="text-[18px] font-google-sans-bold !text-gray-950 text-center px-10">
									{title}
								</ThemedText>
							) : null}
						</View>
					)}
					{children}

					{/* iOS keyboard rounded corners fix */}
					{Platform.OS === "ios" && (
						<View
							style={{
								position: "absolute",
								bottom: -400,
								left: 0,
								right: 0,
								height: 400,
								backgroundColor: "white",
							}}
						/>
					)}
				</Animated.View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
