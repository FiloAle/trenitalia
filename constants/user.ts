export const USER_DATA = {
	firstName: "MARIO",
	lastName: "ROSSI",
	email: "mario.rossi@gmail.com",
	phone: "3401234567",
	loyaltyCode: "123456789",
	birthDate: "01/01/1980",
};

export const getInitials = (firstName: string, lastName: string) => {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
