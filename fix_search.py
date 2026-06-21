with open('app/search.tsx', 'r') as f:
    lines = f.readlines()

def del_range(start, end):
    for i in range(start-1, end):
        lines[i] = ''

# Delete methods
del_range(287, 288) # formatName
del_range(439, 449) # isSameDateToMinutes
del_range(451, 456) # hasCalendarChanges
del_range(458, 465) # handleCancelCalendar
del_range(467, 484) # handleCancelPress
del_range(496, 520) # formatDate
del_range(522, 527) # addPassenger
del_range(529, 539) # addBike
del_range(541, 551) # addAnimal
del_range(554, 560) # isToday
del_range(562, 612) # generateDays

# Add imports
lines[2] = lines[2] + 'import { CalendarPanel } from "@/components/search/calendar-panel";\nimport { PassengersPanel } from "@/components/search/passengers-panel";\n'

# Replace Calendar Bottom Sheet
del_range(892, 1316)
lines[891] = """				{/* Calendar Panel Component */}
				<CalendarPanel
					isVisible={showCalendar}
					onClose={() => setShowCalendar(false)}
					departureDate={departureDate}
					setDepartureDate={setDepartureDate}
					returnDate={returnDate}
					setReturnDate={setReturnDate}
					hasReturn={hasReturn}
					setHasReturn={setHasReturn}
					initialTab={activeCalendarTab}
				/>
"""

# Replace Passengers Full Screen Modal
del_range(1549, 2149)
lines[1548] = """				{/* Passengers Panel Component */}
				<PassengersPanel
					isVisible={showPassengersSheet}
					onClose={() => setShowPassengersSheet(false)}
					passengersList={passengersList}
					setPassengersList={setPassengersList}
				/>
"""

with open('app/search.tsx', 'w') as f:
    f.writelines(lines)
