import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.tint,
				tabBarInactiveTintColor: Colors.light.tabIconDefault,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarShowLabel: true,
				tabBarLabelPosition: "below-icon",
				tabBarLabel: ({ children, color }) => (
					<Text
						className="mt-1 font-plus-jakarta-medium text-[10px]"
						style={{ color }}
					>
						{children}
					</Text>
				),
				tabBarBackground: () => (
					<View className="absolute bottom-0 left-0 right-0 h-full border-t border-gray-200 bg-white" />
				),
				tabBarStyle: {
					height: 85,
					borderTopWidth: 0,
					elevation: 0,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="home"
							size={32}
							weight={300}
							color={`${color}`}
							fill={focused}
							type="sharp"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="trips"
				options={{
					title: "I miei viaggi",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="confirmation_number"
							size={32}
							weight={300}
							color={`${color}`}
							fill={focused}
							type="sharp"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="purchase"
				options={{
					title: "Acquista",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="search"
							size={32}
							weight={300}
							color={`${color}`}
							fill={focused}
							type="sharp"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="info"
				options={{
					title: "Infomobilità",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="train"
							size={32}
							weight={300}
							color={`${color}`}
							fill={focused}
							type="sharp"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="loyalty"
				options={{
					title: "Carte fedeltà",
					tabBarIcon: ({ color, focused }) => (
						<Icon
							name="credit_card_heart"
							size={32}
							weight={300}
							color={`${color}`}
							fill={focused}
							type="sharp"
						/>
					),
				}}
			/>
		</Tabs>
	);
}
