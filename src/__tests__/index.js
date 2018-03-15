import {
	defaultHeaders,
	fetchWithDefaultErrorHandling,
	setupService,
} from '../index';

describe('export correctly', () => {
	it('defaultHeaders', () => {
		expect(typeof defaultHeaders).toBe('function');
	});

	it('fetchWithDefaultErrorHandling', () => {
		expect(typeof fetchWithDefaultErrorHandling).toBe('function');
	});

	it('setupService', () => {
		expect(typeof setupService).toBe('function');
	});
});
