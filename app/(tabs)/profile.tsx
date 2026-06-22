import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { USER_DATA } from "@/constants/user";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const MENU_ITEMS = [
	{ label: "Metodi di pagamento", icon: "credit_card", isDestructive: false },
	{
		label: "Le mie promozioni",
		icon: "percent_discount",
		isDestructive: false,
	},
	{ label: "Assistenza", icon: "headset_mic", isDestructive: false },
	{ label: "Impostazioni", icon: "settings", isDestructive: false },
	{ label: "Logout", icon: "logout", isDestructive: true },
];

export default function ProfileScreen() {
	const insets = useSafeAreaInsets();
	const windowWidth = Dimensions.get("window").width;
	const cardWidth = windowWidth - 40; // 20px padding on each side (px-5)

	// Aspect ratio calculations
	const viewBoxWidth = 350;
	const viewBoxHeight = 120;
	// Calculate actual height based on the inner card width to maintain aspect ratio
	const innerCardWidth = windowWidth - 40 - 32; // 40 outer padding, 32 inner padding
	const cardHeight = (innerCardWidth / viewBoxWidth) * viewBoxHeight;

	return (
		<View className="flex-1 bg-white">
			{/* Page Header */}
			<PageHeader title="Profilo" showBackButton={false}>
				{/* Wallet Card Container */}
				<View className="px-5 pt-2 pb-6">
				<View
					className="bg-white rounded-[22px] shadow-sm overflow-hidden"
					style={{ minHeight: 180 }}
				>
					{/* Top Red SVG Area with White Margin */}
					<View className="px-2 pt-2">
						<View
							className="rounded-t-[16px] overflow-hidden"
							style={{
								width: "100%",
								height: cardHeight,
								position: "relative",
							}}
						>
							<Svg
								width="100%"
								height="100%"
								viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
								preserveAspectRatio="none"
							>
								<Defs>
									<LinearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
										<Stop offset="0" stopColor="#D91835" />
										<Stop offset="1" stopColor="#460811" />
									</LinearGradient>
								</Defs>
								<Path
									d="M 0 0 L 350 0 L 350 120 L 250 120 C 230 120, 230 90, 210 90 L 0 90 Z"
									fill="url(#redGrad)"
								/>
							</Svg>

							{/* Content overlaying the red SVG */}
							<View className="absolute inset-0 p-5 flex-row justify-between">
								<View className="flex-row">
									<ThemedText className="text-[17px] font-google-sans-bold !text-white">
										CartaFRECCIA
									</ThemedText>
									<Icon
										name="chevron_right"
										size={18}
										className="!text-white"
										weight={600}
										style={{ marginBottom: -2 }}
									/>
								</View>
								<View className="items-end justify-between h-full">
									<ThemedText className="text-[14px] font-google-sans-bold !text-white mt-0.5">
										{USER_DATA.loyaltyCode}
									</ThemedText>
									<Icon
										name="qr_code_2"
										size={32}
										className="!text-white -mb-1"
									/>
								</View>
							</View>
						</View>
					</View>

					{/* Bottom User Info Area */}
					<View className="px-6 pb-6" style={{ marginTop: -16 }}>
						<ThemedText className="text-[22px] font-google-sans-bold !text-primary-500 mb-4">
							{USER_DATA.firstName} {USER_DATA.lastName}
						</ThemedText>

						<View className="gap-1 mb-1">
							<View className="flex-row items-center">
								<Icon name="mail_outline" size={20} color="#6b7280" />
								<ThemedText className="ml-3 text-[15px] font-google-sans-medium !text-neutral-600">
									{USER_DATA.email}
								</ThemedText>
							</View>
							<View className="flex-row items-center">
								<Icon name="call" size={20} color="#6b7280" />
								<ThemedText className="ml-3 text-[15px] font-google-sans-medium !text-neutral-600">
									{USER_DATA.phone}
								</ThemedText>
							</View>
						</View>

						<View className="flex-row justify-end">
							<Pressable className="flex-row items-center">
								<ThemedText className="text-[16px] font-google-sans-bold !text-primary-500 mr-1">
									Dati personali
								</ThemedText>
								<Icon
									name="chevron_right"
									size={20}
									className="!text-primary-500"
									weight={600}
								/>
							</Pressable>
						</View>
					</View>
					</View>
				</View>
			</PageHeader>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
			>
				{/* Menu Items List */}
				<View className="mt-5 px-5 gap-3">
					{MENU_ITEMS.map((item, index) => (
						<Pressable
							key={index}
							className={`flex-row items-center p-4 bg-white rounded-2xl border ${item.isDestructive ? "border-rose-600" : "border-neutral-200"}`}
						>
							<Icon
								name={item.icon}
								size={26}
								weight={300}
								className={
									item.isDestructive ? "!text-rose-600" : "!text-neutral-700"
								}
							/>
							<ThemedText
								className={`ml-4 flex-1 text-[16px] font-google-sans-medium ${
									item.isDestructive ? "!text-rose-600" : "!text-neutral-700"
								}`}
							>
								{item.label}
							</ThemedText>
							{!item.isDestructive && (
								<Icon
									name="chevron_right"
									size={24}
									weight={300}
									className="!text-neutral-400"
								/>
							)}
						</Pressable>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
