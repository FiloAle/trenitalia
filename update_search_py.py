import re

with open('app/search.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """import { CalendarPanel } from "@/components/search/calendar-panel";
import { PassengersPanel } from "@/components/search/passengers-panel";
"""
content = content.replace('import { SectionHeader } from "@/components/search/section-header";', 'import { SectionHeader } from "@/components/search/section-header";\n' + imports_to_add)

# Remove isSameDateToMinutes
content = re.sub(r'\tconst isSameDateToMinutes = \(\).*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
# It takes arguments actually
content = re.sub(r'\tconst isSameDateToMinutes = \(.*?\).*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)

# Remove hasCalendarChanges, handleCancelCalendar, handleCancelPress, formatDate, generateDays, isToday
content = re.sub(r'\tconst hasCalendarChanges =.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst handleCancelCalendar = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst handleCancelPress = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst formatDate = \(.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst generateDays = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst isToday = \(.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)

# Remove PassengersPanel functions: addPassenger, addBike, addAnimal
content = re.sub(r'\tconst addPassenger = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst addBike = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst addAnimal = \(\) => \{.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)
content = re.sub(r'\tconst formatName = \(.*?^\t};\n', '', content, flags=re.MULTILINE|re.DOTALL)


# Replace Calendar Bottom Sheet
calendar_start = content.find('{/* Calendar Bottom Sheet */}')
calendar_end = content.find('</BottomSheet>', calendar_start) + len('</BottomSheet>')
calendar_replacement = """{/* Calendar Panel Component */}
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
				/>"""
content = content[:calendar_start] + calendar_replacement + content[calendar_end:]

# Replace Add Passenger Sheet
add_sheet_start = content.find('{/* Add Passenger Sheet */}')
add_sheet_end = content.find('</BottomSheet>', add_sheet_start) + len('</BottomSheet>')
content = content[:add_sheet_start] + content[add_sheet_end:]

# Replace Passengers Full Screen Modal
modal_start = content.find('{/* Passengers Full Screen Modal */}')
modal_end = content.find('</Modal>', modal_start) + len('</Modal>')
modal_replacement = """{/* Passengers Panel Component */}
				<PassengersPanel
					isVisible={showPassengersSheet}
					onClose={() => setShowPassengersSheet(false)}
					passengersList={passengersList}
					setPassengersList={setPassengersList}
				/>"""
content = content[:modal_start] + modal_replacement + content[modal_end:]


with open('app/search.tsx', 'w') as f:
    f.write(content)

