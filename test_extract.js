const fs = require('fs');

const content = fs.readFileSync('app/search.tsx', 'utf8');
const lines = content.split('\n');

const calendarStart = lines.findIndex(line => line.includes('{/* Calendar Bottom Sheet */}'));
const calendarEnd = lines.findIndex((line, i) => i > calendarStart && line.includes('</BottomSheet>'));

const calLines = lines.slice(calendarStart, calendarEnd + 1);
const finalCal = calLines.map(line => line.replace('isVisible={showCalendar}', 'isVisible={isVisible}').replace('onClose={() => setShowCalendar(false)}', 'onClose={handleCancelPress}').replace('onPress={() => setShowCalendar(false)}', 'onPress={onClose}')).join('\n');

const out = `import { BottomSheet } from "@/components/modals/bottom-sheet";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { MainButton } from "@/components/ui/main-button";
import { useState, useRef, useEffect } from "react";
import { View, Pressable, FlatList, Alert } from "react-native";

interface CalendarPanelProps {
	isVisible: boolean;
	onClose: () => void;
	departureDate: Date;
	setDepartureDate: (date: Date) => void;
	returnDate: Date;
	setReturnDate: (date: Date) => void;
	hasReturn: boolean;
	setHasReturn: (val: boolean) => void;
	initialTab?: "andata" | "ritorno";
}

export function CalendarPanel({
	isVisible,
	onClose,
	departureDate,
	setDepartureDate,
	returnDate,
	setReturnDate,
	hasReturn,
	setHasReturn,
	initialTab = "andata",
}: CalendarPanelProps) {
	const [activeCalendarTab, setActiveCalendarTab] = useState<"andata" | "ritorno">(initialTab);
	const [currentMonth, setCurrentMonth] = useState(initialTab === "andata" ? departureDate : returnDate);
	
	const [initialCalendarState, setInitialCalendarState] = useState<{
		departureDate: string;
		returnDate: string;
		hasReturn: boolean;
	} | null>(null);

	const hourScrollRef = useRef<FlatList>(null);

	useEffect(() => {
		if (isVisible) {
			setInitialCalendarState({
				departureDate: departureDate.toISOString(),
				returnDate: returnDate.toISOString(),
				hasReturn: hasReturn,
			});
			setActiveCalendarTab(initialTab);
			setCurrentMonth(initialTab === "andata" ? departureDate : returnDate);

			const h = initialTab === "andata" ? departureDate.getHours() : returnDate.getHours();
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: h * 88,
					animated: true,
				});
			}, 400);
		} else {
			setInitialCalendarState(null);
		}
	}, [isVisible, initialTab]);

	useEffect(() => {
		if (isVisible) {
			const h = activeCalendarTab === "andata" ? departureDate.getHours() : returnDate.getHours();
			setTimeout(() => {
				hourScrollRef.current?.scrollToOffset({
					offset: h * 88,
					animated: true,
				});
			}, 400);
		}
	}, [isVisible, activeCalendarTab]);

	const isSameDateToMinutes = (date1: string | Date, date2: string | Date) => {
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate() &&
			d1.getHours() === d2.getHours() &&
			d1.getMinutes() === d2.getMinutes()
		);
	};

	const hasCalendarChanges =
		initialCalendarState !== null &&
		(initialCalendarState.hasReturn !== hasReturn ||
			!isSameDateToMinutes(initialCalendarState.departureDate, departureDate) ||
			(hasReturn && !isSameDateToMinutes(initialCalendarState.returnDate, returnDate)));

	const handleCancelCalendar = () => {
		if (initialCalendarState) {
			setDepartureDate(new Date(initialCalendarState.departureDate));
			setReturnDate(new Date(initialCalendarState.returnDate));
			setHasReturn(initialCalendarState.hasReturn);
		}
		onClose();
	};

	const handleCancelPress = () => {
		if (hasCalendarChanges) {
			Alert.alert(
				"Cancellare le modifiche?",
				"Le modifiche al calendario non verranno salvate.",
				[
					{ text: "Annulla", style: "cancel" },
					{
						text: "Cancella modifiche",
						style: "destructive",
						onPress: handleCancelCalendar,
					},
				],
				{ cancelable: true }
			);
		} else {
			handleCancelCalendar();
		}
	};

	const formatDate = (date: Date) => {
		const monthIdx = date.getMonth();
		const monthName = [
			"Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
			"Lug", "Ago", "Set", "Ott", "Nov", "Dic"
		][monthIdx];
		return \`\${date.getDate()} \${monthName} - \${date.getHours()}:\${date.getMinutes().toString().padStart(2, "0")}\`;
	};

	const generateDays = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

		const days = [];
		for (let i = 0; i < adjustedFirstDay; i++) {
			days.push({ day: null });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const depOnlyDate = new Date(departureDate);
		depOnlyDate.setHours(0, 0, 0, 0);
		const retOnlyDate = new Date(returnDate);
		retOnlyDate.setHours(0, 0, 0, 0);

		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			const isStart = hasReturn && date.getTime() === depOnlyDate.getTime();
			const isEnd = hasReturn && date.getTime() === retOnlyDate.getTime();
			const isInRange = hasReturn && date > depOnlyDate && date < retOnlyDate;
			const isSelected =
				activeCalendarTab === "andata"
					? departureDate.toDateString() === date.toDateString()
					: returnDate.toDateString() === date.toDateString();

			days.push({
				day: i,
				date: date,
				isPast: date < today,
				isSelected,
				isStart,
				isEnd,
				isInRange,
			});
		}
		return days;
	};

	return (
		<>
${finalCal}
		</>
	);
}
`;

fs.writeFileSync('components/search/calendar-panel.tsx', out);
