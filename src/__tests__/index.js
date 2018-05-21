import setupService, {
	defaultHeaders,
	fetchWithErrorParser,
	setupMethod,
} from '../index';

describe('export correctly', () => {
	it('setupService', () => {
		expect(typeof setupService).toBe('function');
	});

	it('defaultHeaders', () => {
		expect(typeof defaultHeaders).toBe('function');
	});

	it('fetchWithErrorParser', () => {
		expect(typeof fetchWithErrorParser).toBe('function');
	});

	it('setupMethod', () => {
		expect(typeof setupMethod).toBe('function');
	});
});
