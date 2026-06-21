const fs = require('fs');

const content = fs.readFileSync('app/search.tsx', 'utf8');
const lines = content.split('\n');

// Find sections to delete and set them to empty string
function clearSection(startLineText, endLineText) {
    const start = lines.findIndex(l => l.includes(startLineText));
    if(start === -1) return;
    let end = start;
    while(end < lines.length && !lines[end].includes(endLineText)) {
        end++;
    }
    for(let i = start; i <= end; i++) {
        lines[i] = '';
    }
}

clearSection('const formatName =', 'str.slice(1).toLowerCase();');
clearSection('const isSameDateToMinutes =', '	};');
clearSection('const hasCalendarChanges =', '!isSameDateToMinutes(initialCalendarState.returnDate, returnDate)));');
clearSection('const handleCancelCalendar =', 'setShowCalendar(false);');
lines[lines.findIndex(l => l.includes('setShowCalendar(false);')) + 1] = ''; // clear };
clearSection('const handleCancelPress =', 'handleCancelCalendar();');
lines[lines.findIndex(l => l.includes('handleCancelCalendar();')) + 1] = ''; // clear }
lines[lines.findIndex(l => l.includes('handleCancelCalendar();')) + 2] = ''; // clear };
clearSection('const formatDate =', 'padStart(2, "0")}`;');
lines[lines.findIndex(l => l.includes('padStart(2, "0")}`;')) + 1] = ''; // clear };
clearSection('const addPassenger =', 'setShowAddPassengerSheet(true);');
lines[lines.findIndex(l => l.includes('setShowAddPassengerSheet(true);')) + 1] = ''; // clear };
clearSection('const addBike =', 'name: "Bicicletta",');
lines[lines.findIndex(l => l.includes('name: "Bicicletta",')) + 1] = '';
lines[lines.findIndex(l => l.includes('name: "Bicicletta",')) + 2] = '';
lines[lines.findIndex(l => l.includes('name: "Bicicletta",')) + 3] = '';
clearSection('const addAnimal =', 'name: "Animale",');
lines[lines.findIndex(l => l.includes('name: "Animale",')) + 1] = '';
lines[lines.findIndex(l => l.includes('name: "Animale",')) + 2] = '';
lines[lines.findIndex(l => l.includes('name: "Animale",')) + 3] = '';

clearSection('const isToday =', 'date.getFullYear() === today.getFullYear()');
lines[lines.findIndex(l => l.includes('date.getFullYear() === today.getFullYear()')) + 1] = '';
lines[lines.findIndex(l => l.includes('date.getFullYear() === today.getFullYear()')) + 2] = '';

clearSection('const generateDays =', 'return days;');
lines[lines.findIndex(l => l.includes('return days;')) + 1] = '';

// Reconstruct
const newContent = lines.filter(l => l !== '').join('\n');
fs.writeFileSync('app/search.tsx', newContent);
