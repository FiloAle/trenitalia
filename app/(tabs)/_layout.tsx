import { HapticTab } from "@/components/haptic-tab";
import { Icon } from "@/components/ui/icon";
import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: Colors.light.tint,
					tabBarInactiveTintColor: Colors.light.tabIconDefault,
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarShowLabel: true,
					tabBarHideOnKeyboard: true,
					tabBarLabelPosition: "below-icon",
					tabBarLabel: ({ focused, children, color }) => (
						<Text
							className={`mt-1.5 text-[12px] ${focused ? "font-plus-jakarta-bold -tracking-[0.13px]" : "font-plus-jakarta-medium"}`}
							style={{ color }}
						>
							{children}
						</Text>
					),
					tabBarBackground: () => (
						<View className="absolute bottom-0 left-0 right-0 h-full border-t border-gray-200 bg-white" />
					),
					tabBarStyle: {
						height: 84,
						borderTopWidth: 0,
						elevation: 0,
						paddingTop: 8,
						paddingHorizontal: 8,
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
								size={36}
								weight={300}
								color={color as string}
								fill={focused}
								type="sharp"
								useFont={false}
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
								size={36}
								weight={300}
								color={color as string}
								fill={focused}
								type="sharp"
								useFont={false}
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
								size={36}
								weight={300}
								color={color as string}
								fill={focused}
								type="sharp"
								useFont={false}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profilo",
						tabBarIcon: ({ color, focused }) => (
							<Icon
								name="account"
								size={36}
								weight={300}
								color={color as string}
								fill={focused}
								type="sharp"
								useFont={false}
							/>
						),
					}}
				/>
			</Tabs>
		</>
	);
}
