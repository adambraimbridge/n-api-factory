import fetch from 'node-fetch';
import querystring from 'querystring';
import { parseFetchError } from '@financial-times/n-error';
import { trimObject } from '@financial-times/n-utils';

export const defaultHeaders = ({
	API_KEY,
	transactionId,
	systemId = process.env.SYSTEM_CODE,
	user = 'customer',
}) =>
	trimObject({
		'x-api-key': API_KEY,
		'FT-Transaction-Id': transactionId,
		'Content-Type': 'application/json',
		'X-Origin-System-Id': `https://cmdb.ft.com/systems/${systemId}`,
		'X-Origin-User': user,
	});

export const fetchWithDefaultErrorHandling = async (url, options) => {
	try {
		const response = await fetch(url, options);
		const contentLength = parseInt(response.headers.get('content-length'), 10);

		if (!response.ok) {
			throw response;
		}
		// in case of 'NO CONTENT'
		if (response.status === 204 || contentLength === 0) {
			return undefined;
		}
		return await response.json();
	} catch (e) {
		const parsed = await parseFetchError(e);
		throw parsed;
	}
};

export const setupMethod = method => ({ API_HOST, API_KEY }) => ({
	endpoint,
	query,
	body,
	meta,
}) => {
	const { transactionId } = meta;
	const options = trimObject({
		method,
		headers: defaultHeaders({ API_KEY, transactionId }),
		body: body ? JSON.stringify(body) : undefined,
	});
	// query fields can be nullable
	const stringifiedQuery = query
		? querystring.stringify(trimObject(query))
		: undefined;
	const url = stringifiedQuery
		? `${API_HOST}${endpoint}?${stringifiedQuery}`
		: `${API_HOST}${endpoint}`;
	return fetchWithDefaultErrorHandling(url, options);
};

export const setupService = ({ API_HOST, API_KEY }) => ({
	get: setupMethod('GET')({ API_HOST, API_KEY }),
	post: setupMethod('POST')({ API_HOST, API_KEY }),
	delete: setupMethod('DELETE')({ API_HOST, API_KEY }),
});

export default setupService;
