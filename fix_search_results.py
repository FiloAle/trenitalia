import re

with open('app/search-results.tsx', 'r') as f:
    content = f.read()

# 1. Imports
imports = 'import { CalendarPanel } from "@/components/search/calendar-panel";\nimport { PassengersPanel } from "@/components/search/passengers-panel";\nimport { setGlobalSelectionList, SelectionItem } from "@/utils/selection-store";'
content = content.replace('import { getGlobalSelectionList } from "@/utils/selection-store";', f'import {{ getGlobalSelectionList }} from "@/utils/selection-store";\n{imports}')

# 2. Add States
states = """	const [showCalendar, setShowCalendar] = useState(false);
	const [showPassengers, setShowPassengers] = useState(false);
	const [returnDate, setReturnDate] = useState(() => returnDateStr ? new Date(returnDateStr) : new Date());
	const [hasReturn, setHasReturn] = useState(hasReturnStr === "true");
	const [passengersList, setPassengersList] = useState<SelectionItem[]>(getGlobalSelectionList());
"""
content = content.replace('	const [currentSelectedDate, setCurrentSelectedDate] = useState(departureDate);', f'	const [currentSelectedDate, setCurrentSelectedDate] = useState(departureDate);\n{states}')

# 3. Handle passenger close
# We'll just pass a custom onClose to PassengersPanel that also updates the global store

# 4. Replace Pressable onPress
content = content.replace('onPress={() => router.navigate({ pathname: "/search", params: { openPanel: "calendar" } })}', 'onPress={() => setShowCalendar(true)}')
content = content.replace('onPress={() => router.navigate({ pathname: "/search", params: { openPanel: "passengers" } })}', 'onPress={() => setShowPassengers(true)}')

# 5. Add Panels at the end of the return statement
panels = """				{/* Calendar Panel Component */}
				<CalendarPanel
					isVisible={showCalendar}
					onClose={() => {
						setShowCalendar(false);
						// We can optionally refresh data here
					}}
					departureDate={currentSelectedDate}
					setDepartureDate={setCurrentSelectedDate}
					returnDate={returnDate}
					setReturnDate={setReturnDate}
					hasReturn={hasReturn}
					setHasReturn={setHasReturn}
					initialTab={"andata"}
				/>

				{/* Passengers Panel Component */}
				<PassengersPanel
					isVisible={showPassengers}
					onClose={() => {
						setShowPassengers(false);
						setGlobalSelectionList(passengersList);
					}}
					passengersList={passengersList}
					setPassengersList={setPassengersList}
				/>"""

content = content.replace('		</View>\n	);\n}', f'{panels}\n		</View>\n	);\n}}')

with open('app/search-results.tsx', 'w') as f:
    f.write(content)
