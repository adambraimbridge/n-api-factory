import fetch from 'node-fetch';

import setupService from '../service';

const config = {
	API_HOST: 'http://mock.com',
	API_KEY: 'mock.key',
};

process.env.SYSTEM_CODE = 'newspaper-mma';

jest.mock('node-fetch', () =>
	jest.fn(() => ({
		ok: true,
		headers: {
			get: () => 5,
		},
		json: () => ({
			data: 'test',
		}),
	})),
);

describe('setupService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('set up get method correctly', async () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		const res = await service.get({
			endpoint: '/test',
			meta: { transactionId },
			query: { foo: 'bar' },
		});
		expect(res).toEqual({ data: 'test' });
		expect(fetch.mock.calls).toMatchSnapshot();
	});

	it('set up post methods correctly', async () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		await service.post({
			endpoint: '/test',
			body: { test: 'test' },
			meta: { transactionId },
		});
		expect(fetch.mock.calls).toMatchSnapshot();
	});

	it('set up delete methods correctly', async () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		await service.delete({ endpoint: '/test/xxxx', meta: { transactionId } });
		expect(fetch.mock.calls).toMatchSnapshot();
	});
});
