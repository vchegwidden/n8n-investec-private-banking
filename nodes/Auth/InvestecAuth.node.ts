import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IRequestOptions,
	NodeConnectionType,
	NodeApiError,
	JsonObject,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

export class InvestecAuth implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Investec Private Banking Auth',
		name: 'investecAuth',
		icon: 'file:zebra.svg',
		group: ['transform'],
		version: 1,
		subtitle: 'Get Access Token',
		description: 'Get access token from Investec Private Banking API',
		defaults: {
			name: 'Investec Private Banking Auth',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'investecPrivateBankingApi',
				required: true,
			},
		],
		properties: [
			// Resources
			{
				displayName: 'Base URL',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Sandbox',
						value: 'https://openapisandbox.investec.com/identity/v2/oauth2/token',
					},
					{
						name: 'Production',
						value: 'https://openapi.investec.com/identity/v2/oauth2/token',
					},
				],
				default: 'https://openapisandbox.investec.com/identity/v2/oauth2/token',
				noDataExpression: true,
				required: true,
				description: 'Use the environment base URL',
			},
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		// const operation = this.getNodeParameter('operation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			// if (operation === 'get') {
				try {
					const options: IRequestOptions = {
						method: 'POST',
						headers: {
							Accept: 'application/json',
						},
						form: {
							grant_type: 'client_credentials',
						},
						url: resource,
						json: true,
					};

					// Logger.info(`Value for url is "${resource}"`)
					// Logger.info(`Calling investec auth endpoint for workflow with url "${options.url}"`);
					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'investecPrivateBankingApi',
						options,
					);
					returnData.push(responseData);
				} catch (error) {
					if (error.httpCode === '404') {
						const resource = this.getNodeParameter('resource', 0) as string;
						const errorOptions = {
							message: `${resource} not found`,
							description:
								'The requested resource could not be found. Please check your input parameters.',
						};
						throw new NodeApiError(this.getNode(), error as JsonObject, errorOptions);
					}

					if (error.httpCode === '401') {
						throw new NodeApiError(this.getNode(), error as JsonObject, {
							message: 'Authentication failed',
							description: 'Please check your credentials and try again.',
						});
					}
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			// }
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
