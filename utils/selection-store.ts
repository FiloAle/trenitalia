export type TravelerType = "Adulto" | "Ragazzo" | "Bambino";
export type ServiceType = "Bicicletta" | "Animale" | "Servizio Aggiuntivo";
export type ItemType = "passenger" | "service";

export interface SelectionItem {
	id: string;
	itemType: ItemType;
	type: TravelerType | ServiceType | string; // Allow string for specific service names
	name: string;
	isMock?: boolean;
	firstName?: string;
	lastName?: string;
	birthDate?: string;
	loyaltyCode?: string;
	phone?: string;
	email?: string;
	price?: number;
}

let globalSelectionList: SelectionItem[] = [];

export const getGlobalSelectionList = () => globalSelectionList;
export const setGlobalSelectionList = (list: SelectionItem[]) => {
	globalSelectionList = list;
};
