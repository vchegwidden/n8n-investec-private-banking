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
			// Resources
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'options',
				options: [
					{
						name: 'Sandbox',
						value: 'https://openapisandbox.investec.com/za/pb/v1',
					},
					{
						name: 'Production',
						value: 'https://openapi.investec.com/za/pb/v1',
					},
				],
				default: 'https://openapisandbox.investec.com/za/pb/v1',
				noDataExpression: true,
				required: true,
				description: 'Use the environment base URL',
			},
			{
				displayName: 'Access Token',
				name: 'accessToken', // The name used to reference the element UI within the code
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				default: '',
				description: 'The OAuth2 Access token',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Account',
						value: 'accounts',
					},
					{
						name: 'Profile',
						value: 'profiles',
					},
				],
				default: 'accounts',
				noDataExpression: true,
				required: true,
				description: 'Account information',
			},
			// Operations
			{
				displayName: 'Account Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['accounts'],
					},
				},
				options: [
					{
						name: 'List Accounts',
						value: 'getAccounts',
						description:
							'Get a list of accounts with metadata regarding the account like Account name, Account type and the profile it is associated to',
						action: 'List all accounts',
					},
					{
						name: 'Account Balance',
						value: 'getBalance',
						description: 'Obtain a specified accounts balance',
						action: 'Get account balance',
					},
					{
						name: 'Account Transactions',
						value: 'getTransactions',
						description: 'Obtain a specified accounts transactions',
						action: 'Get account transactions',
					},
					// {
					// 	name: 'List Profiles',
					// 	value: 'getProfiles',
					// 	description: 'List all the profiles consented to',
					// 	action: 'List all profiles consented to',
					// },
				],
				default: 'getAccounts',
				noDataExpression: true,
			},
			{
				displayName: 'Profile Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['profiles'],
					},
				},
				options: [
					{
						name: 'List Profiles',
						value: 'getProfiles',
						description: 'List all the profiles consented to',
						action: 'List all profiles consented to',
					},
				],
				default: 'getProfiles',
				noDataExpression: true,
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['accounts'],
						operation: ['getBalance', 'getTransactions'],
					},
				},
				default: '',
				description: 'The bank account ID',
			},
			{
				displayName: 'Transaction Filter Fields',
				name: 'transactionFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['accounts'],
						operation: ['getTransactions'],
					},
				},
				options: [
					{
						displayName: 'Transactions Start Date',
						name: 'fromDate',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Transactions End Date',
						name: 'toDate',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'Transaction Type',
						name: 'transactionType',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Include Pending Transactions',
						name: 'includePending',
						type: 'boolean',
						default: false,
					},
				],
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
		const token = this.getNodeParameter('accessToken', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		// const profileOperation = this.getNodeParameter('profileOperation', 0) as string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'getBalance') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					// // Get additional fields input
					// const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					// const data: IDataObject = {
					// 	accountId,
					// };
					// Object.assign(data, additionalFields);

					const options: IRequestOptions = {
						method: 'GET',
						headers: {
							Accept: 'application/json',
							Authorization: `Bearer ${token}`,
						},
						url: `${baseUrl}/${resource}/${accountId}/balance`,
						json: true,
					};
					responseData = await this.helpers.request.call(
						this,
						// 'investecPrivateBankingApi',
						options,
					);
					returnData.push(responseData);
				}
				if (operation === 'getAccounts' || operation === 'getProfiles') {
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
					responseData = await this.helpers.request.call(
						this,
						// 'investecPrivateBankingApi',
						options,
					);
					returnData.push(responseData);
				}
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
		}
		// Map data to n8n data structure
		return [this.helpers.returnJsonArray(returnData)];
	}
}
