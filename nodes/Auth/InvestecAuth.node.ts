import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class InvestecAuth implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Investec Private Banking Auth',
		name: 'investecAuth',
		icon: 'file:zebra.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["baseUrl"]}}',
		description: 'Get access token from Investec Private Banking API',
		defaults: {
			name: 'Investec Private Banking Auth',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'investecPbApi',
				required: true,
			},
		],
		// requestDefaults: {
		// 	// baseURL: 'https://openapisandbox.investec.com',
		//     baseURL: '={{$credentials.baseUrl}}',
		//     headers: {
		// 		Accept: 'application/json',
		//     },
		// },
		properties: [
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Sandbox',
						value: 'https://openapisandbox.investec.com',
					},
					{
						name: 'Production',
						value: 'https://openapi.investec.com',
					},
				],
				default: 'https://openapisandbox.investec.com',
			},
			// Operations will go here
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get access token',
						description: 'Get the client access token for API calls',
						routing: {
							request: {
								method: 'POST',
								url: 'https://openapisandbox.investec.com/identity/v2/oauth2/token',
								headers: {
									Accept: 'application/json',
								},
							},
						},
					},
				],
				default: 'get',
			},
			// Optional/additional fields will go here
		],
	};
}
