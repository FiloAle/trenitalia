const fs = require('fs');
let content = fs.readFileSync('app/(tabs)/info.tsx', 'utf8');

// 1. Add AnimatedTabLabel and reanimated imports
if (!content.includes('import Animated')) {
    content = content.replace('import { useCallback', 'import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";\nimport { useCallback');
}

const animatedTabLabelCode = `
const AnimatedTabLabel = ({
	chip,
	isActive,
}: {
	chip: string;
	isActive: boolean;
}) => {
	const animatedStyle = useAnimatedStyle(() => {
		return {
			color: withTiming(isActive ? "#ffffff" : "#004141", { duration: 250 }),
		};
	}, [isActive]);

	return (
		<Animated.Text
			className="text-[14px] font-google-sans-semibold"
			style={animatedStyle}
		>
			{chip}
		</Animated.Text>
	);
};
`;
content = content.replace('const CHIPS = ["N. Treno", "Tabellone", "Da/a", "Treni seguiti"];', 'const CHIPS = ["Stazione", "Da/a", "N. Treno"];' + animatedTabLabelCode);

// 2. Add tabWidth state
content = content.replace('const [activeChip, setActiveChip] = useState("N. Treno");', 'const [activeChip, setActiveChip] = useState("Stazione");\n\tconst [tabWidth, setTabWidth] = useState(0);');

// 3. Add animated style for the active chip
const animatedStyleCode = `
	const activeChipIndex = CHIPS.indexOf(activeChip) === -1 ? 0 : CHIPS.indexOf(activeChip);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(activeChipIndex * (tabWidth / CHIPS.length), {
						duration: 250,
					}),
				},
			],
		};
	}, [activeChipIndex, tabWidth]);
`;
content = content.replace('const [recentTrains, setRecentTrains] = useState<RecentTrainSearch[]>([]);', 'const [recentTrains, setRecentTrains] = useState<RecentTrainSearch[]>([]);\n' + animatedStyleCode);

// 4. Update switch statement cases
content = content.replace('case "Tabellone":', 'case "Stazione":');

// 5. Replace top chips with the new animated selector
const topChipsRegex = /<ScrollView[\s\S]*?<\/ScrollView>/;
content = content.replace(topChipsRegex, ''); // remove from header

const tabSelectorCode = `
				{/* Tab Selector */}
				<View className="px-5 pt-5 z-50">
					<View
						className="bg-primary-500/10 rounded-xl p-1 flex-row relative"
						onLayout={(e) => setTabWidth(e.nativeEvent.layout.width - 8)}
					>
						{tabWidth > 0 && (
							<Animated.View
								className="absolute top-1 bottom-1 bg-primary-600 rounded-lg"
								style={[
									{ left: 4, width: tabWidth / CHIPS.length },
									animatedStyle,
								]}
							/>
						)}
						{CHIPS.map((chip) => (
							<Pressable
								key={chip}
								onPress={() => setActiveChip(chip)}
								className="flex-1 py-2.5 items-center justify-center z-10"
							>
								<AnimatedTabLabel
									chip={chip}
									isActive={activeChip === chip}
								/>
							</Pressable>
						))}
					</View>
				</View>
`;
content = content.replace('{/* Main Content Area */}', tabSelectorCode + '\n\n\t\t\t\t{/* Main Content Area */}');

fs.writeFileSync('app/(tabs)/info.tsx', content);
console.log("Done");
