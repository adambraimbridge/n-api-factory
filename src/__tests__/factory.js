import nock from 'nock';
import fetch from 'node-fetch';

import { fetchWithDefaultErrorHandling, setupService } from '../factory';

const config = {
	API_HOST: 'http://mock.com',
	API_KEY: 'mock.key',
};

process.env.SYSTEM_CODE = 'newspaper-mma';

describe('fetchWithDefaultErrorHandling', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	it('return the parsed data correctly if response.ok', async () => {
		const res = { foo: 'bar' };
		nock(config.API_HOST)
			.get('/')
			.reply(200, res);
		const data = await fetchWithDefaultErrorHandling(`${config.API_HOST}`);
		expect(data).toEqual(res);
	});

	it('return undefined if response.status 204', async () => {
		nock(config.API_HOST)
			.get('/')
			.reply(204);

		const data = await fetchWithDefaultErrorHandling(`${config.API_HOST}`);
		expect(data).toBe(undefined);
	});

	it('return undefined if the response.body is emtpy', async () => {
		nock(config.API_HOST)
			.get('/')
			.reply(200, '', { 'Content-Length': '0' });

		const data = await fetchWithDefaultErrorHandling(`${config.API_HOST}`);
		expect(data).toBe(undefined);
	});

	it('return formatted error correctly if response is error', async () => {
		nock(config.API_HOST)
			.get('/')
			.reply(404, { message: 'some message' });
		try {
			await fetchWithDefaultErrorHandling(`${config.API_HOST}`);
			throw new Error('it should throw an exception');
		} catch (e) {
			expect(e).toEqual({
				category: 'FETCH_RESPONSE_ERROR',
				contentType: 'application/json',
				status: 404,
				message: {
					message: 'some message',
				},
			});
		}
	});
});

describe('setupService', () => {
	beforeAll(() => {
		fetch.default = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('set up get method correctly', () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		service.get({
			endpoint: '/test',
			meta: { transactionId },
		});
		expect(fetch.default.mock.calls).toMatchSnapshot();
	});

	it('set up post methods correctly', () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		service.post({
			endpoint: '/test',
			body: { test: 'test' },
			meta: { transactionId },
		});
		expect(fetch.default.mock.calls).toMatchSnapshot();
	});

	it('set up delete methods correctly', () => {
		const service = setupService(config);
		const transactionId = 'xxxx';
		service.delete({ endpoint: '/test/xxxx', meta: { transactionId } });
		expect(fetch.default.mock.calls).toMatchSnapshot();
	});
});
