import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Modal,
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
	title: string;
	children: React.ReactNode;
}

export function BottomSheet({
	isVisible,
	onClose,
	title,
	children,
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
			<View className="flex-1 justify-end">
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
						borderTopLeftRadius: 18,
						borderTopRightRadius: 18,
						paddingHorizontal: 20,
						paddingTop: 24,
						paddingBottom: insets.bottom + 20,
					}}
				>
					<View className="flex-row justify-between items-center mb-4">
						<ThemedText className="text-[18px] font-plus-jakarta-bold !text-gray-950">
							{title}
						</ThemedText>
						<Pressable onPress={handleClose}>
							<Icon
								name="close"
								size={28}
								className="!text-gray-800"
								weight={300}
							/>
						</Pressable>
					</View>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
}
