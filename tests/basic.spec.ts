import { greet } from '../src/index';

test('greet runs correctly', () => {
	expect(greet('John')).toBe('Hello, John!');
})
