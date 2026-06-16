import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { USER_DATA } from "@/constants/user";
import { router, Stack } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileDetailsScreen() {
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-white">
			<Stack.Screen options={{ headerShown: false }} />
			<View
				className="flex-row items-center justify-between px-5 pb-4 bg-teal-900"
				style={{ paddingTop: insets.top + 10 }}
			>
				<Pressable className="p-2" onPress={() => router.back()}>
					<Icon name="arrow_back_ios" size={24} color="white" />
				</Pressable>
				<View className="items-center">
					<ThemedText className="text-[18px] font-plus-jakarta-bold !text-white">
						Informazioni Account
					</ThemedText>
				</View>
				<View className="p-2 w-10" />
			</View>

			<ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
				<View className="gap-4">
					<ProfileField label="Nome" value={USER_DATA.firstName} />
					<ProfileField label="Cognome" value={USER_DATA.lastName} />
					<ProfileField label="Email" value={USER_DATA.email} />
					<ProfileField label="Password" value="********" />
					<ProfileField label="Telefono" value={USER_DATA.phone} />
					<ProfileField label="Data di nascita" value={USER_DATA.birthDate} />
					<ProfileField label="Indirizzo di fatturazione" value="Via Roma 1, 00100 Roma (RM)" />

					<Pressable className="mt-8 border border-red-600 bg-white rounded-lg p-4 flex-row justify-center items-center active:bg-red-50">
						<ThemedText className="font-plus-jakarta-bold !text-red-600 text-center w-full">
							Elimina account
						</ThemedText>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
}

function ProfileField({ label, value }: { label: string; value: string }) {
	return (
		<Pressable className="border-b border-gray-100 py-3 active:opacity-50">
			<View className="flex-row items-center justify-between">
				<View>
					<ThemedText className="font-plus-jakarta text-[13px] !text-gray-500 mb-1">
						{label}
					</ThemedText>
					<ThemedText className="font-plus-jakarta-semibold text-[15px] !text-gray-900">
						{value}
					</ThemedText>
				</View>
			</View>
		</Pressable>
	);
}
