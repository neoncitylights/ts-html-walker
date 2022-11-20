export type TableRow = { [ key: string ]: string };
export type TableBodies = TableRow[][];

/**
 * Traverses an HTML table and converts it to machine-readable data.
 * It is able to process multiple `thead` and `tbody` elements.
 */
export function walkTable(table: HTMLTableElement): TableBodies {
	return collectTableBodies(table, collectProperties(table));
}

export function collectProperties(table: HTMLTableElement): string[] {
	const properties: string[] = [];
	const tHeads = table.tHead?.getElementsByTagName('th') as HTMLCollectionOf<HTMLTableCellElement>;

	Array.from(tHeads).forEach(tHead => {
		properties.push(tHead.innerText);
	});

	return properties;
}

export function collectTableBodies(table: HTMLTableElement, properties: string[]): TableBodies {
	const tableBodies: TableBodies = [];

	Array.from(table.tBodies).forEach(tableBody => {
		tableBodies.push(collectDataRows(tableBody, properties));
	});

	return tableBodies;
}

export function collectDataRows(
	tableBody: HTMLTableSectionElement,
	dataProps: string[],
): TableRow[] {
	const tableRows: TableRow[] = [];

	Array.from(tableBody.rows).forEach(tableRow => {
		const tableCells = tableRow.cells;
		const dataRow: TableRow = {};

		for (let i = 0; i < tableCells.length; i++) {
			const prop = dataProps[i];
			dataRow[`${prop}`] = tableCells[i].innerText;
		}
		tableRows.push(dataRow);
	});

	return tableRows;
}
