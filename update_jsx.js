const fs = require('fs');

const content = fs.readFileSync('app/search.tsx', 'utf8');

let newContent = content.replace(
    'import { SectionHeader } from "@/components/search/section-header";',
    'import { SectionHeader } from "@/components/search/section-header";\nimport { CalendarPanel } from "@/components/search/calendar-panel";\nimport { PassengersPanel } from "@/components/search/passengers-panel";'
);

const calStart = newContent.indexOf('{/* Calendar Bottom Sheet */}');
const calEnd = newContent.indexOf('</BottomSheet>', calStart) + '</BottomSheet>'.length;
newContent = newContent.substring(0, calStart) + `				{/* Calendar Panel Component */}
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
				/>` + newContent.substring(calEnd);

const modalStart = newContent.indexOf('{/* Passengers Full Screen Modal */}');
const modalEnd = newContent.indexOf('</Modal>', modalStart) + '</Modal>'.length;
newContent = newContent.substring(0, modalStart) + `				{/* Passengers Panel Component */}
				<PassengersPanel
					isVisible={showPassengersSheet}
					onClose={() => setShowPassengersSheet(false)}
					passengersList={passengersList}
					setPassengersList={setPassengersList}
				/>` + newContent.substring(modalEnd);

fs.writeFileSync('app/search.tsx', newContent);
