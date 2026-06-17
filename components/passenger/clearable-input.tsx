import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Pressable, TextInput, View } from "react-native";

export interface ClearableInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
}

export function ClearableInput({
	label,
	value,
	onChangeText,
	placeholder,
	keyboardType = "default",
}: ClearableInputProps) {
	return (
		<View className="border border-gray-300 rounded-2xl bg-white px-4 py-2 mb-3 flex-row items-center">
			<View className="flex-1 justify-center min-h-[44px]">
				<ThemedText className="text-[12px] font-plus-jakarta-medium !text-gray-500 mb-0.5">
					{label}
				</ThemedText>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					keyboardType={keyboardType}
					className="font-plus-jakarta-bold text-[16px] text-gray-900 p-0 m-0 leading-tight h-[22px]"
					placeholderTextColor="#9ca3af"
					autoCapitalize={
						keyboardType === "email-address" ? "none" : "characters"
					}
					autoCorrect={false}
				/>
			</View>
			{value.length > 0 && (
				<Pressable onPress={() => onChangeText("")} className="ml-2 p-2 -mr-2">
					<Icon name="cancel" size={20} className="!text-gray-400" />
				</Pressable>
			)}
		</View>
	);
}
