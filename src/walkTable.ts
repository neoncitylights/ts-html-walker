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
	const dataProps: string[] = [];
	const tHeads = table.tHead?.getElementsByTagName('th') as HTMLCollectionOf<HTMLTableHeaderCellElement>;

	Array.from(tHeads).forEach(tHead => {
		dataProps.push(tHead.innerText);
	});

	return dataProps;
}

export function collectTableBodies(table: HTMLTableElement, properties: string[]): TableBodies {
	const dataBodies: TableBodies = [];

	Array.from(table.tBodies).forEach(tableBody => {
		dataBodies.push(collectDataRows(tableBody, properties));
	});

	return dataBodies;
}

export function collectDataRows(
	tableBody: HTMLTableSectionElement,
	dataProps: string[],
): TableRow[] {
	const dataRows: TableRow[] = [];

	Array.from(tableBody.rows).forEach(tableRow => {
		const tableCells = tableRow.cells;
		const dataRow: TableRow = {};

		for (let i = 0; i < tableCells.length; i++) {
			const prop = dataProps[i];
			dataRow[`${prop}`] = tableCells[i].innerText;
		}
		dataRows.push(dataRow);
	});

	return dataRows;
}
