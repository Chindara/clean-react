import _ from 'lodash';

export function authFunctionHandler(userFunctions, menuItems) {
	const clonedMenuItems = _.cloneDeep(menuItems);

	if (!userFunctions?.length) return [];
	// CREATE A SET OF FUNCTION IDS FOR FASTER LOOKUP
	const functionIds = new Set(userFunctions.map((func) => func.id));

	// RECURSIVE FUNCTION TO FILTER CHILDREN
	function filterChildren(children) {
		return children.filter((child) => {
			if (child.children) {
				// IF CHILD HAS NESTED CHILDREN, FILTER RECURSIVELY
				child.children = filterChildren(child.children);
				// KEEP THE CHILD IF IT HAS ANY VALID CHILDREN AFTER FILTERING
				return child.children.length > 0;
			} else {
				// KEEP THE CHILD IF ITS ID IS PRESENT IN THE FUNCTIONS ARRAY
				return functionIds.has(child.id);
			}
		});
	}

	// FILTER THE TOP-LEVEL MENU ITEMS
	return clonedMenuItems.filter((menuItem) => {
		if (menuItem.children) {
			// IF MENU ITEM HAS CHILDREN, FILTER RECURSIVELY
			menuItem.children = filterChildren(menuItem.children);
			// KEEP THE MENU ITEM IF IT HAS ANY VALID CHILDREN AFTER FILTERING
			return menuItem.children.length > 0;
		} else {
			// KEEP THE MENU ITEM IF ITS ID IS PRESENT IN THE FUNCTIONS ARRAY
			return functionIds.has(menuItem.id);
		}
	});
}
