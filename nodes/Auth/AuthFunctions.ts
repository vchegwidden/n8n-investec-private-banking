import {
	type IExecuteFunctions,
	type IRequestOptions,
	NodeApiError,
	JsonObject,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

export async function getAuthToken(
	executeFunction: IExecuteFunctions,
	authUrl: string,
): Promise<any> {
	let responseData;
	try {
		const options: IRequestOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			form: {
				grant_type: 'client_credentials',
			},
			url: authUrl,
			json: true,
		};

		// Logger.info(`Value for url is "${resource}"`)
		// Logger.info(`Calling investec auth endpoint for workflow with url "${options.url}"`);
		responseData = await executeFunction.helpers.requestWithAuthentication.call(
			executeFunction,
			'investecPrivateBankingApi',
			options,
		);
		return responseData;
	} catch (error) {
		if (error.httpCode === '404') {
			const resource = executeFunction.getNodeParameter('resource', 0) as string;
			const errorOptions = {
				message: `${resource} not found`,
				description:
					'The requested resource could not be found. Please check your input parameters.',
			};
			throw new NodeApiError(executeFunction.getNode(), error as JsonObject, errorOptions);
		}

		if (error.httpCode === '401') {
			throw new NodeApiError(executeFunction.getNode(), error as JsonObject, {
				message: 'Authentication failed',
				description: 'Please check your credentials and try again.',
			});
		}
		throw new NodeApiError(executeFunction.getNode(), error as JsonObject);
	}
}
