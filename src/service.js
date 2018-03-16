import querystring from 'querystring';
import { trimObject } from '@financial-times/n-utils';

import { defaultHeaders, fetchWithErrorParser } from './method';

export const setupMethod = ({ method, API_HOST, API_KEY }) => ({
	endpoint,
	query,
	body,
	meta = {},
	headers,
}) => {
	const { transactionId } = meta;
	const options = trimObject({
		method,
		headers: { ...defaultHeaders({ API_KEY, transactionId }), ...headers },
		body: body ? JSON.stringify(body) : undefined,
	});
	// query fields can be nullable
	const stringifiedQuery = query
		? querystring.stringify(trimObject(query))
		: undefined;
	const url = stringifiedQuery
		? `${API_HOST}${endpoint}?${stringifiedQuery}`
		: `${API_HOST}${endpoint}`;
	return fetchWithErrorParser(url, options);
};

export const setupService = ({ API_HOST, API_KEY }) => ({
	get: setupMethod({ method: 'GET', API_HOST, API_KEY }),
	post: setupMethod({ method: 'POST', API_HOST, API_KEY }),
	delete: setupMethod({ method: 'DELETE', API_HOST, API_KEY }),
});

export default setupService;
