export type TableRow = { [ key: string ]: string };
export type TableBodies = TableRow[][];

export class WalkTableError extends Error {}

/**
 * Traverses an HTML table and converts it to machine-readable data.
 * It is able to process multiple `thead` and `tbody` elements.
 */
export function walkTable(table: HTMLTableElement): TableBodies {
	return collectTableBodies(table, collectProperties(table));
}

/**
 * Attempts to collect the properties of the table through 2 methods:
 *  - Checks if a `<thead>` element exists, and uses the text content of each
 *    `<th>` elements as the property name.
 *  - Otherwise, it loops through the first `<tr>` element and uses the text
 *    content of each `<th>` element as the property name.
 */
export function collectProperties(table: HTMLTableElement): string[] {
	const properties: string[] = [];

	const tableHeaders = table.tHead?.getElementsByTagName('th');
	if(tableHeaders !== undefined) {
		Array.from(tableHeaders).forEach(tableHeader => {
			properties.push(tableHeader.innerText);
		});
		return properties;
	}

	// retrieve all cells in the first row of the table body,
	// but first check if there's actually content inside the
	// table body
	const tableBodies = table.tBodies;
	assertHtmlCollectionHasChildren(tableBodies, 'No table body found');

	const tableRows = tableBodies[0].rows;
	assertHtmlCollectionHasChildren(tableRows, 'No table cells found');

	const firstRowCells = tableRows[0].cells;
	assertHtmlCollectionHasChildren(firstRowCells, 'No table cells found in first row');

	// the table header cells actually exist, time to collect them
	for(let cell of firstRowCells) {
		properties.push(cell.innerText);
	}

	return properties;
}

function assertHtmlCollectionHasChildren<T extends HTMLElement>(collection: HTMLCollectionOf<T>, message: string): void {
	if(collection.length === 0) {
		throw new WalkTableError('Cannot collect properties: ' + message);
	}
}

export function collectTableBodies(table: HTMLTableElement, properties: string[]): TableBodies {
	const tableBodies: TableBodies = [];

	Array.from(table.tBodies).forEach(tableBody => {
		tableBodies.push(collectTableRows(tableBody, properties));
	});

	return tableBodies;
}

export function collectTableRows(
	tableBody: HTMLTableSectionElement,
	properties: string[],
): TableRow[] {
	const tableRows: TableRow[] = [];

	Array.from(tableBody.rows).forEach(tableRow => {
		const tableCells = tableRow.cells;
		const row: TableRow = {};

		for (let i = 0; i < tableCells.length; i++) {
			const prop = properties[i];
			row[`${prop}`] = tableCells[i].innerText;
		}
		tableRows.push(row);
	});

	return tableRows;
}