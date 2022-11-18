export const ELEMENT_NAME_DIV = 'DIV';
export const ELEMENT_NAME_DT = 'DT';
export const ELEMENT_NAME_DD = 'DD';
export type DListCallback<T> = (element: HTMLElement) => T;

/**
 * Extracts data from a description list into a map of key-value pairs,
 * where keys store data of a `<dt>`, and values store data of a `<dd>`.
 *
 * This implementation attempts to follow the HTML Standard by the WHATWG
 * as closely as possible.
 * @see https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
 */
export function walkDescriptionList<K,V>(
	element: HTMLDListElement|HTMLDivElement,
	termCallback: DListCallback<K>,
	detailsCallback: DListCallback<V>,
): Map<K, V> {
	const children: HTMLCollection = element.children;
	if (children.length === 0) {
		return new Map<K, V>();
	}

	let descriptionList = new Map<K, V>();
	let terms: K[] = [];
	for (const currentElement of children) {
		const elementTagName = currentElement.tagName;
		switch (elementTagName) {
		case ELEMENT_NAME_DT:
			terms.push(termCallback(currentElement as HTMLElement));
			break;
		case ELEMENT_NAME_DD:
			if (currentElement.previousElementSibling?.tagName === ELEMENT_NAME_DT) {
				terms.forEach(term => descriptionList.set(
					term,
					detailsCallback(currentElement as HTMLElement),
				));
				terms = [];
			}
			break;
		case ELEMENT_NAME_DIV:
			descriptionList = new Map([
				...descriptionList.entries(),
				...walkDescriptionList(
					currentElement as HTMLDivElement,
					termCallback,
					detailsCallback,
				),
			]);
			break;
		default:
			throw new TypeError(`Expected a <dt>, <dd>, or <div> element; found <${elementTagName}> instead`);
		}
	}

	return descriptionList;
}