import { ThemedText } from "@/components/themed-text";
import { Image, View, Pressable } from "react-native";

export interface TrainData {
	time: string;
	destination: string;
	trainName: string;
	category: string;
	status: string;
	bin: string;
	binType: string;
	hasMenu: boolean;
}

interface StationBoardTrainRowProps {
	train: TrainData;
	onPress?: () => void;
}

const getTrainLogoData = (category: string) => {
	if (!category) return null;
	const name = category.toUpperCase();
	const words = name.split(" ");
	if (
		name.includes("FR") ||
		name.includes("FRECCIAROSSA") ||
		(name.includes("TRENITALIA") && name.includes("AV"))
	)
		return { source: require("@/assets/logos/small/f.png"), ratio: 1.4 };
	if (name.includes("FA") || name.includes("FRECCIARGENTO"))
		return { source: require("@/assets/logos/small/f.png"), ratio: 1.4 };
	if (name.includes("FB") || name.includes("FRECCIABIANCA"))
		return { source: require("@/assets/logos/small/f.png"), ratio: 1.4 };
	if (name.includes("IC") || name.includes("INTERCITY"))
		return { source: require("@/assets/logos/small/ic.png"), ratio: 0.89 };
	if (name.includes("TPER"))
		return { source: require("@/assets/logos/small/rtper.png"), ratio: 2.13 };
	if (
		name.includes("REG") ||
		words.includes("R") ||
		words.includes("RV") ||
		name.includes("REGIONALE")
	)
		return { source: require("@/assets/logos/small/r.png"), ratio: 2.03 };
	if (name.includes("EC") || name.includes("EUROCITY"))
		return { source: require("@/assets/logos/small/ec.png"), ratio: 1.1 };
	return null;
};

export function StationBoardTrainRow({ train, onPress }: StationBoardTrainRowProps) {
	const logoData = getTrainLogoData(train.category);
	const catUpper = train.category ? train.category.toUpperCase() : "";
	const isTrenitalia = !catUpper.includes("ITALO") && !catUpper.includes("TRENORD");

	return (
		<Pressable onPress={isTrenitalia ? onPress : undefined} className="flex-row items-center py-4 border-b border-neutral-100">
			<View className="w-[18%]">
				<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950">
					{train.time}
				</ThemedText>
			</View>
			<View className="flex-1 pl-1 pr-2">
				<ThemedText
					className="text-[15px] font-google-sans-medium !text-neutral-950"
					numberOfLines={1}
				>
					{train.destination}
				</ThemedText>
				<View className="flex-row items-center mt-0.5">
					{logoData && (
						<Image
							source={logoData.source}
							style={{
								width: 12 * logoData.ratio,
								height: 12,
								marginRight: 4,
								marginTop: -2,
							}}
							resizeMode="contain"
						/>
					)}
					<ThemedText className="text-[13px] font-google-sans-regular !text-neutral-600">
						{logoData
							? train.trainName
							: `${train.category} ${train.trainName}`.trim()}
					</ThemedText>
				</View>
			</View>
			<View className="w-[28%] pr-2 items-center">
				<View
					className={`w-[76px] py-1.5 rounded-full items-center justify-center ${
						train.status &&
						train.status.toLowerCase() !== "in orario" &&
						train.status.trim() !== ""
							? "bg-rose-100"
							: "bg-primary-500/10"
					}`}
				>
					<ThemedText
						className={`text-[11px] font-google-sans-bold ${
							train.status &&
							train.status.toLowerCase() !== "in orario" &&
							train.status.trim() !== ""
								? "!text-rose-600"
								: "!text-primary-500"
						}`}
						numberOfLines={1}
						adjustsFontSizeToFit
					>
						{train.status && train.status.trim() !== ""
							? train.status.toUpperCase()
							: "IN ORARIO"}
					</ThemedText>
				</View>
			</View>
			<View className="w-[18%] items-center justify-center">
				<ThemedText className="text-[15px] font-google-sans-medium !text-neutral-950 text-center">
					{train.bin}
				</ThemedText>
				{!!train.binType && (
					<ThemedText className="text-[11px] font-google-sans-medium !text-neutral-500 text-center mt-0.5">
						{train.binType}
					</ThemedText>
				)}
			</View>
		</Pressable>
	);
}
