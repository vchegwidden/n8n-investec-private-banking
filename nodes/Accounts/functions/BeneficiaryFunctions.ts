import {
	type IExecuteFunctions,
	type IRequestOptions,
	NodeApiError,
	JsonObject,
	IDataObject,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

export async function getBeneficiaries(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
): Promise<any> {
	let responseData;

	try {
		const options: IRequestOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: `${baseUrl}/accounts/beneficiaries`,
			json: true,
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

export async function getBeneficiaryCategories(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
): Promise<any> {
	let responseData;

	try {
		const options: IRequestOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: `${baseUrl}/accounts/beneficiarycategories`,
			json: true
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		return responseData;
	} catch (error) {
		handleError(executeFunction, error);
	}
}

export async function payMultiple(
	executeFunction: IExecuteFunctions,
	baseUrl: String,
	token: String,
	itemIndex: number,
): Promise<any> {
	let responseData;

	try {
		const accountId = executeFunction.getNodeParameter('accountId', itemIndex) as string;
		// Get additional fields input
		const additionalFields = executeFunction.getNodeParameter('additionalFields', itemIndex) as IDataObject;
		const data: IDataObject = {};
		Object.assign(data, additionalFields);

		const options: IRequestOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: data,
			url: `${baseUrl}/accounts/${accountId}/paymultiple`,
			json: true,
		};
		responseData = await executeFunction.helpers.request.call(executeFunction, options);
		// responseData = data;
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
