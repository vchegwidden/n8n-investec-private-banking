import {
	type IExecuteFunctions,
	type IRequestOptions,
	NodeApiError,
	JsonObject,
	IDataObject,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

export type AccountInfoTypes = 'balance' | 'pending-transactions';

export async function accountsRequest(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
	resource: String,
): Promise<any> {
	let responseData;

	const options: IRequestOptions = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
		url: `${baseUrl}/${resource}`,
		json: true,
	};

	// Logger.info(`Value for url is "${resource}"`)
	// Logger.info(`Calling investec auth endpoint for workflow with url "${options.url}"`);
	try {
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

export async function getAccountInfoRequest(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
	resource: String,
	itemIndex: number,
    requestType: AccountInfoTypes,
): Promise<any> {
	let responseData;

	try {
		const accountId = executeFunction.getNodeParameter('accountId', itemIndex) as string;

		const options: IRequestOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: `${baseUrl}/${resource}/${accountId}/${requestType}`,
			json: true,
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

export async function getAccountTransactions(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
	resource: String,
	itemIndex: number,
): Promise<any> {
	let responseData;

	try {
		const accountId = executeFunction.getNodeParameter('accountId', itemIndex) as string;
		var transactionsUrl = `${baseUrl}/${resource}/${accountId}/transactions`;

		// Get additional fields input
		const additionalFields = executeFunction.getNodeParameter(
			'additionalFields',
			itemIndex,
		) as IDataObject;
		if (additionalFields) {
			if (additionalFields.fromDate) {
				var startDate = additionalFields.fromDate as string;
				transactionsUrl = `${transactionsUrl}&fromDate=${startDate.split(' ')[0]}`;
			}
			if (additionalFields.toDate) {
				var endDate = additionalFields.toDate as string;
				transactionsUrl = `${transactionsUrl}&toDate=${endDate.split(' ')[0]}`;
			}
			if (additionalFields.transactionType) {
				transactionsUrl = `${transactionsUrl}&transactionType=${additionalFields.transactionType as string}`;
			}
			if (additionalFields.includePending) {
				transactionsUrl = `${transactionsUrl}&includePending=${additionalFields.includePending as string}`;
			}
		}

		const options: IRequestOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: transactionsUrl,
			json: true,
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

export async function getProfileAccounts(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
	resource: String,
	itemIndex: number,
): Promise<any> {
	let responseData;

	try {
		const profileId = executeFunction.getNodeParameter('profileId', itemIndex) as string;

		const options: IRequestOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: `${baseUrl}/${resource}/${profileId}/accounts`,
			json: true,
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

function handleError(executeFunction: IExecuteFunctions, error: any) {
	if (error.httpCode === '400') {
		const resource = executeFunction.getNodeParameter('resource', 0) as string;
		const errorOptions = {
			message: `Bad request for ${resource}`,
			description:
				'The request was invalid or cannot be otherwise served. Please check your input parameters.',
		};
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
	}

	if (error.httpCode === '404') {
		const resource = executeFunction.getNodeParameter('resource', 0) as string;
		const errorOptions = {
			message: `${resource} not found`,
			description: 'The requested resource could not be found. Please check your input parameters.',
		};
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
	}

	if (error.httpCode === '403') {
		const resource = executeFunction.getNodeParameter('resource', 0) as string;
		const errorOptions = {
			message: `Forbidden request for ${resource}`,
			description:
				'You do not have permission to access this resource. Please check your access rights.',
		};
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
	}

	if (error.httpCode === '429') {
		const errorOptions = {
			message: `Too many requests`,
			description:
				'You have exceeded the rate limit for requests. Please wait and try again later.',
		};
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
	}

	if (error.httpCode === '401') {
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, {
			message: 'Authentication failed',
			description: 'Please check your credentials and try again.',
		});
	}

	if (error.httpCode === '500') {
		const errorOptions = {
			message: `Internal server error`,
			description: 'The server encountered an internal error. Please try again later.',
		};
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
	}

	throw new NodeApiError(executeFunction.getNode(), error as JsonObject);
}
