import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	// LoggerProxy as Logger,
} from 'n8n-workflow';

import { 
	accountResources, 
	accountOperations,
	profileOperations,
	transferOperations,
	documentOperations,
	beneficiaryOperations,
} from './AccountsNodeProperties';

import {
	accountFields,
	profileFields,
	transferFields,
	documentFields,
	beneficiaryFields,
} from './AccountNodeFields';

import { 
	accountsRequest, 
	getAccountInfoRequest, 
	getAccountTransactions, 
	getAuthorisationSetupDetails, 
	getProfileAccounts, 
	getProfileBeneficiaries,
} from './functions/AccountFunctions';

import { transferMultiple } from './functions/TransferFunctions';

import { getBeneficiaries, getBeneficiaryCategories, payMultiple } from './functions/BeneficiaryFunctions';

import { listDocuments, getDocument } from './functions/DocumentFunctions';

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
		properties: [
			...accountResources,
			...accountOperations,
			...profileOperations,
			...transferOperations,
			...documentOperations,
			...beneficiaryOperations,
			...accountFields,
			...profileFields,
			...transferFields,
			...documentFields,
			...beneficiaryFields,
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const baseUrl = this.getNodeParameter('baseUrl', 0) as string;
		const token = this.getNodeParameter('accessToken', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData = [];

		if (!token) {
			throw new NodeOperationError(this.getNode(), 'Access Token is required');
		}

		// Get Accounts, Profiles, Beneficiary and BeneficiaryCategories operate on the whole account so we call those outside the loop
		switch(operation) { 
			case 'getBeneficiaries':
				returnData.push(await getBeneficiaries(this, baseUrl, token));
				return [this.helpers.returnJsonArray(returnData)];
			case 'getBeneficiaryCategories':
				returnData.push(await getBeneficiaryCategories(this, baseUrl, token));
				return [this.helpers.returnJsonArray(returnData)];
			case 'getAccounts':
			case 'getProfiles':
				returnData.push(await accountsRequest(this, baseUrl, token, resource));
				return [this.helpers.returnJsonArray(returnData)];
			default:
				// continue to loop
				break;
		}

		// For each item, make an API call to create a contact
		// items can be for different accounts or different profiles
		for (let i = 0; i < items.length; i++) {
			switch (operation) {
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
				case 'getAuthorisationSetupDetails':
					returnData.push(await getAuthorisationSetupDetails(this, baseUrl, token, resource, i));
					break;
				case 'getProfileBeneficiaries':
					returnData.push(await getProfileBeneficiaries(this, baseUrl, token, resource, i));
					break;
				case 'transferMultiple':
					returnData.push(await transferMultiple(this, baseUrl, token, i));
					break;
				case 'payMultiple':
					returnData.push(await payMultiple(this, baseUrl, token, i));
					break;
				case 'listDocuments':
					returnData.push(await listDocuments(this, baseUrl, token, i));
					break;
				case 'getDocument':
					returnData.push(await getDocument(this, baseUrl, token, i));
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
