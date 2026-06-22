import { ThemedText } from "@/components/themed-text";
import { TimelineEventRow } from "@/components/train-details/timeline-event-row";
import { TimelineStation } from "@/constants/train-details-mock";
import { formatTrainName } from "@/utils/format";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, View } from "react-native";

export const InfomobilityTrainBlock = ({
	train,
	LOGOS,
	isToday,
}: {
	train: any;
	LOGOS: any;
	isToday: boolean;
}) => {
	const [showPrev, setShowPrev] = useState(false);
	const [showNext, setShowNext] = useState(false);

	const formattedTrainName = formatTrainName(train.trainInfo.type);
	const logoSource = LOGOS[formattedTrainName];

	const passengerOrigin = train.trainInfo.origin;
	const passengerDest = train.trainInfo.destination;

	const normalizeStationName = (name: string) => {
		return name
			.toLowerCase()
			.replace(/c\.le/g, "centrale")
			.replace(/\/av/g, "")
			.replace(/\(av\)/g, "")
			.replace(/p\. ?ga.*/g, "porta garibaldi")
			.replace(/p\.ta/g, "porta")
			.replace(/ - /g, " ")
			.replace(/-/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	};

	const matchStation = (target: string) => {
		const normTarget = normalizeStationName(target);

		let idx = train.timeline.findIndex(
			(s: any) => normalizeStationName(s.name) === normTarget,
		);
		if (idx !== -1) return idx;

		idx = train.timeline.findIndex((s: any) => {
			const normS = normalizeStationName(s.name);
			return normS.includes(normTarget) || normTarget.includes(normS);
		});
		return idx;
	};

	let startIndex = matchStation(passengerOrigin);
	let endIndex = matchStation(passengerDest);

	if (startIndex === -1) startIndex = 0;
	if (endIndex === -1 || endIndex < startIndex)
		endIndex = train.timeline.length - 1;

	const hasPrev = startIndex > 0;
	const hasNext = endIndex < train.timeline.length - 1;

	const visibleStations = train.timeline.filter((_: any, idx: number) => {
		if (showPrev && showNext) return true;
		if (showPrev && !showNext) return idx <= endIndex;
		if (!showPrev && showNext) return idx >= startIndex;
		return idx >= startIndex && idx <= endIndex;
	});

	return (
		<View className="mb-10">
			{/* Train Header */}
			<View className="flex-row items-center justify-between mb-4 border-b border-neutral-100 pb-3">
				<View className="flex-row items-center gap-2">
					{logoSource ? (
						<Image
							source={logoSource.source}
							style={{
								height: 16,
								width: 16 * (logoSource.ratio || 1.4),
								marginTop: -3,
							}}
							contentFit="contain"
						/>
					) : (
						<View className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
							<ThemedText className="text-[13px] font-google-sans-bold !text-neutral-700">
								{formatTrainName(train.trainInfo.type)}
							</ThemedText>
						</View>
					)}
					<View className="flex-row items-center ml-0.5">
						<ThemedText className="text-[16px] font-google-sans-bold !text-neutral-900 mr-1">
							{formatTrainName(train.trainInfo.type)}
						</ThemedText>
						<ThemedText className="text-[16px] font-google-sans-regular !text-neutral-900">
							{train.trainInfo.number}
						</ThemedText>
					</View>
				</View>

				{/* Status Tag */}
				{isToday && train.data.compRitardo && train.data.compRitardo[0] && (
					<View
						className={`py-1.5 px-3 rounded-full items-center justify-center ${
							train.data.compRitardo[0].toLowerCase() !== "in orario" &&
							train.data.compRitardo[0].toLowerCase() !== "non partito"
								? "bg-rose-100"
								: "bg-primary-500/10"
						}`}
					>
						<ThemedText
							className={`text-[11px] font-google-sans-bold ${
								train.data.compRitardo[0].toLowerCase() !== "in orario" &&
								train.data.compRitardo[0].toLowerCase() !== "non partito"
									? "!text-rose-600"
									: "!text-primary-500"
							}`}
							numberOfLines={1}
							adjustsFontSizeToFit
						>
							{train.data.compRitardo[0].toLowerCase() === "in orario" ||
							train.data.compRitardo[0].toLowerCase() === "non partito"
								? train.data.compRitardo[0].toUpperCase()
								: `+${train.data.compRitardo[0].replace(/[^0-9]/g, "")} MIN`}
						</ThemedText>
					</View>
				)}
			</View>

			{/* Timeline */}
			<View>
				{hasPrev && (
					<Pressable
						onPress={() => setShowPrev(!showPrev)}
						className="items-center py-3 bg-neutral-50 rounded-2xl mb-8"
					>
						<ThemedText className="text-[13px] font-google-sans-bold text-primary-600">
							{showPrev
								? "Nascondi fermate precedenti"
								: "Mostra fermate precedenti"}
						</ThemedText>
					</Pressable>
				)}

				{visibleStations.map((station: TimelineStation, idx: number) => {
					return (
						<TimelineEventRow
							key={station.id}
							station={station}
							nextStation={
								idx < visibleStations.length - 1
									? visibleStations[idx + 1]
									: undefined
							}
							isFirst={idx === 0}
							isLast={idx === visibleStations.length - 1}
							isTruncatedTop={idx === 0 && hasPrev && !showPrev}
							isTruncatedBottom={
								idx === visibleStations.length - 1 && hasNext && !showNext
							}
						/>
					);
				})}

				{hasNext && (
					<Pressable
						onPress={() => setShowNext(!showNext)}
						className="items-center py-3 bg-neutral-50 rounded-2xl mt-8"
					>
						<ThemedText className="text-[13px] font-google-sans-bold text-primary-600">
							{showNext
								? "Nascondi fermate successive"
								: "Mostra fermate successive"}
						</ThemedText>
					</Pressable>
				)}
			</View>
		</View>
	);
};
