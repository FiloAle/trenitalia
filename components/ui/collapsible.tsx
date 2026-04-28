import { Icon } from "@/components/ui/icon";
import { PropsWithChildren, useState } from "react";
import { TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function Collapsible({
	children,
	title,
}: PropsWithChildren & { title: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useColorScheme() ?? "light";

	return (
		<ThemedView>
			<TouchableOpacity
				className="flex-row items-center gap-1.5"
				onPress={() => setIsOpen((value) => !value)}
				activeOpacity={0.8}
			>
				<ThemedView className={isOpen ? "rotate-90" : undefined}>
					<Icon name="chevron-right" size={18} color={Colors.light.icon} />
				</ThemedView>

				<ThemedText type="defaultSemiBold">{title}</ThemedText>
			</TouchableOpacity>
			{isOpen && <ThemedView className="ml-6 mt-1.5">{children}</ThemedView>}
		</ThemedView>
	);
}
