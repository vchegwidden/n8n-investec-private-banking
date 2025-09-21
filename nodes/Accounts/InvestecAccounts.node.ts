import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

import { accountResources, accountOperations, accountFields } from './AccountsNodeProperties';
import { accountsRequest, getAccountInfoRequest, getAccountTransactions, getProfileAccounts } from './AccountFunctions';

export class InvestecAccounts implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Investec Private Banking Accounts',
		name: 'investecAccounts',
		icon: 'file:zebra.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Investec Private Banking API',
		defaults: {
			name: 'Investec Private Banking Accounts',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [...accountResources, ...accountOperations, ...accountFields],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const baseUrl = this.getNodeParameter('baseUrl', 0) as string;
		const token = this.getNodeParameter('accessToken', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		// const profileOperation = this.getNodeParameter('profileOperation', 0) as string;

		const returnData = [];

		if (!token) {
			throw new NodeOperationError(this.getNode(), 'Access Token is required');
		}

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			switch (operation) {
				case 'getAccounts':
					returnData.push(await accountsRequest(this, baseUrl, token, resource));
					break;
				case 'getProfiles':
					returnData.push(await accountsRequest(this, baseUrl, token, resource));
					break;
				case 'getBalance':
					returnData.push(await getAccountInfoRequest(this, baseUrl, token, resource, i, 'balance'));
					break;
				case 'getTransactions':
					returnData.push(await getAccountTransactions(this, baseUrl, token, resource, i));
					break;
				case 'getPendingTransactions':
					returnData.push(await getAccountInfoRequest(this, baseUrl, token, resource, i, 'pending-transactions'));
					break;
				case 'getProfileAccounts':
					returnData.push(await getProfileAccounts(this, baseUrl, token, resource, i));
					break;
				default:
					throw new NodeOperationError(
						this.getNode(),
						`The operation "${operation}" is not supported!`,
					);
			}
		}

		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
