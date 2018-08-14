import { trimObject } from '@financial-times/n-utils';
import { fetch, parseFetchError } from '@financial-times/n-error';

export const defaultHeaders = ({
	API_KEY,
	transactionId,
	requestId,
	systemId = process.env.SYSTEM_CODE,
	user = 'customer',
}) =>
	trimObject({
		'Content-Type': 'application/json',
		'x-api-key': API_KEY,
		'FT-Transaction-Id': transactionId || requestId,
		'X-Origin-System-Id': `https://cmdb.ft.com/systems/${systemId}`,
		'X-Origin-User': user,
	});

export const fetchWithErrorParser = async (url, options) => {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw response;
		}
		// in case of 'NO CONTENT'
		const contentLength = parseInt(response.headers.get('content-length'), 10);
		if (response.status === 204 || contentLength === 0) {
			return undefined;
		}

		const contentType = response.headers.get('content-type');
		const parseMethod =
			contentType && contentType.includes('application/json') ? 'json' : 'text';
		return await response[parseMethod]();
	} catch (e) {
		const parsed = await parseFetchError(e);
		throw parsed;
	}
};
