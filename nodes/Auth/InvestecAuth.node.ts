import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

import { getAuthToken } from './AuthFunctions';

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
				name: 'baseUrl',
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
		const baseUrl = this.getNodeParameter('baseUrl', 0) as string;

		for (let i = 0; i < items.length; i++) {
			responseData = await getAuthToken(this, baseUrl);
			returnData.push(responseData);
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
