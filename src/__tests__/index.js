import defaultExport, {
	defaultHeaders,
	fetchWithErrorParser,
	setupService,
} from '../index';

describe('export correctly', () => {
	it('defaultExport', () => {
		expect(typeof defaultExport).toBe('function');
	});

	it('defaultHeaders', () => {
		expect(typeof defaultHeaders).toBe('function');
	});

	it('fetchWithErrorParser', () => {
		expect(typeof fetchWithErrorParser).toBe('function');
	});

	it('setupService', () => {
		expect(typeof setupService).toBe('function');
	});
});
