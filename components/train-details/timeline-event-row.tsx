import { ThemedText } from "@/components/themed-text";
import { TimelineStation } from "@/constants/train-details-mock";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

interface TimelineEventRowProps {
	station: TimelineStation;
	nextStation?: TimelineStation;
	isFirst: boolean;
	isLast: boolean;
	isTruncatedTop?: boolean;
	isTruncatedBottom?: boolean;
	isNextArrivalActual?: boolean;
	isFreccia?: boolean;
}

const TrackLine = ({
	isDashed,
	isActual,
	className,
	style,
	isReverse = false,
}: any) => {
	if (isDashed) {
		return (
			<View
				className={`absolute z-0 ${className}`}
				style={[style, { backgroundColor: "transparent", width: 10 }]}
			>
				{Array.from({ length: 3 }).map((_, i) => (
					<View
						key={i}
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
							backgroundColor: isActual ? "#004141" : "#e5e7eb",
							position: "absolute",
							...(isReverse ? { bottom: i * 14 + 9 } : { top: i * 14 + 9 }),
						}}
					/>
				))}
			</View>
		);
	}
	return (
		<View
			className={`absolute z-0 ${isActual ? "bg-primary-500" : "bg-[#e5e7eb]"} ${className}`}
			style={style}
		/>
	);
};

export function TimelineEventRow({
	station,
	nextStation,
	isFirst,
	isTruncatedTop = false,
	isTruncatedBottom = false,
	isFreccia = false,
}: TimelineEventRowProps) {
	const arrivalEvents = station.events.filter((e) =>
		e.label.includes("Arrivo"),
	);
	const departureEvents = station.events.filter((e) =>
		e.label.includes("Partenza"),
	);

	const isArrivalActual =
		arrivalEvents.length > 0 ? arrivalEvents.some((e) => e.isActual) : true;
	const isDepartureActual =
		departureEvents.length > 0
			? departureEvents.some((e) => e.isActual)
			: arrivalEvents.length > 0
				? arrivalEvents.some((e) => e.isActual)
				: false;

	const hasArrival = arrivalEvents.length > 0;
	const hasDeparture = departureEvents.length > 0;

	const isNextArrivalActual = nextStation
		? nextStation.events
				.filter((e) => e.label.includes("Arrivo"))
				.some((e) => e.isActual)
		: false;

	return (
		<View
			className="flex-row relative bg-white"
			style={{ marginTop: isFirst ? 0 : -1 }}
		>
			<View className="flex-1">
				{/* Removed Arrival Events (Above Station Name) block */}

				{/* Station Name Row */}
				<View className="relative">
					{/* Top half line */}
					{hasArrival && (
						<TrackLine
							isDashed={isTruncatedTop}
							isActual={isArrivalActual}
							isReverse={true}
							className="top-0"
							style={
								isTruncatedTop
									? { left: 45, width: 10, bottom: "50%" }
									: { left: 45, width: 10, bottom: "50%", marginBottom: -1 }
							}
						/>
					)}

					{/* Bottom half line */}
					{hasDeparture && (
						<TrackLine
							isDashed={isTruncatedBottom}
							isActual={isDepartureActual}
							className=""
							style={
								isTruncatedBottom
									? { left: 45, width: 10, top: "50%" }
									: { left: 45, width: 10, top: "50%", bottom: -2 }
							}
						/>
					)}

					{/* Rounded terminal cap for Origin Station (no arrival events) */}
					{!hasArrival && (
						<View
							className="absolute z-20 bg-primary-500 rounded-full"
							style={{
								left: 45,
								width: 10,
								height: 10,
								top: "50%",
								marginTop: -5,
							}}
						/>
					)}

					{/* Rounded terminal cap for Destination Station (no departure events) */}
					{!hasDeparture && (
						<View
							className={`absolute z-20 rounded-full ${isArrivalActual ? "bg-primary-500" : "bg-[#e5e7eb]"}`}
							style={{
								left: 45,
								width: 10,
								height: 10,
								top: "50%",
								marginTop: -5,
							}}
						/>
					)}

					{/* Solid background behind dot to ensure white dot has a border */}
					<View
						className={`absolute z-20 rounded-full ${isArrivalActual || isDepartureActual ? "bg-primary-500" : "bg-[#e5e7eb]"}`}
						style={{
							left: 45,
							width: 10,
							height: 10,
							top: "50%",
							marginTop: -5,
						}}
					/>

					{/* Dot on the line */}
					<View
						className="absolute z-30 rounded-full bg-white"
						style={{ left: 46, width: 8, height: 8, top: "50%", marginTop: -4 }}
					/>

					<View className="flex-row items-center mb-1 relative z-10">
						{/* Bin (replaces Table Icon) */}
						<View className="w-[64px] items-end -ml-7 relative">
							<Pressable
								onPress={() =>
									router.navigate({
										pathname: "/station-board",
										params: { station: station.name },
									})
								}
							>
								<View className="py-1">
									<ThemedText
										className={`text-[13px] font-google-sans-bold text-right ${
											station.isCurrent
												? "!text-primary-500"
												: "!text-neutral-700"
										}`}
									>
										BIN {station.bin}
									</ThemedText>
								</View>
							</Pressable>
							{station.isCurrent && isFreccia && (
								<View className="absolute top-[100%] right-0 w-[80px]">
									<ThemedText className="text-[10px] font-google-sans-medium !text-neutral-500 text-right leading-tight">
										Executive{"\n"}in coda
									</ThemedText>
								</View>
							)}
						</View>

						{/* Station Name */}
						<View className="ml-10 flex-1 flex-row items-center justify-between">
							<ThemedText className="text-base font-google-sans-bold !text-primary-500 mr-2 flex-shrink">
								{station.name}
							</ThemedText>
						</View>
					</View>
				</View>

				{/* Events Block (Badge + Events) */}
				<View className="relative">
					{!isTruncatedBottom && hasDeparture && (
						<TrackLine
							isDashed={false}
							isActual={isDepartureActual}
							className="top-0 bottom-[-2px]"
							style={{ left: 45, width: 10 }}
						/>
					)}
					{(hasArrival || hasDeparture) && (
						<View className="ml-[80px] pl-3 relative z-10">
							{/* L-Bracket for Events */}
							<View
								className="absolute border-neutral-300"
								style={{
									left: 0,
									top: 0,
									bottom: -4,
									width: 12,
									borderLeftWidth: 2,
									borderBottomWidth: 2,
									borderBottomLeftRadius: 8,
									borderStyle: "dotted",
								}}
							/>

							{/* All Events (Arrivals and Departures) */}
							{[...arrivalEvents, ...departureEvents].map((ev, idx) => (
								<View
									key={`ev-${idx}`}
									className="flex-row items-center justify-between mb-1"
								>
									<ThemedText
										className={`text-[13px] font-google-sans-medium ${
											ev.isActual ? "!text-neutral-900" : "!text-neutral-500"
										}`}
									>
										{ev.label}
									</ThemedText>
									<View className="flex-row items-center gap-1.5">
										<ThemedText
											className={`text-[13px] ${
												ev.isDelayed
													? "font-google-sans-regular !text-neutral-500 line-through"
													: `font-google-sans-medium ${
															ev.isActual
																? "!text-primary-500"
																: "!text-neutral-500"
													  }`
											}`}
										>
											{ev.time}
										</ThemedText>
										{ev.isDelayed && ev.updatedTime && (
											<ThemedText className="text-[13px] font-google-sans-medium !text-rose-600">
												{ev.updatedTime}
											</ThemedText>
										)}
									</View>
								</View>
							))}
						</View>
					)}

					{/* Terminal rounded cap for the green line */}
					{!isTruncatedBottom &&
						isDepartureActual &&
						!isNextArrivalActual &&
						hasDeparture && (
							<View
								className="absolute z-20 bg-primary-500 rounded-full"
								style={{ left: 45, width: 10, height: 10, bottom: -5 }}
							/>
						)}
				</View>

				{/* Spacer block replaces the pb-8 padding */}
				{!isTruncatedBottom && (
					<View className="relative h-12">
						{hasDeparture && (
							<View
								className={`absolute top-0 bottom-[-2px] z-0 ${isDepartureActual && isNextArrivalActual ? "bg-primary-500" : "bg-[#e5e7eb]"}`}
								style={{ left: 45, width: 10 }}
							/>
						)}
					</View>
				)}
			</View>
		</View>
	);
}
