import type { INodeProperties } from 'n8n-workflow';

export const accountResources: INodeProperties[] = [
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
				name: 'Beneficiary',
				value: 'beneficiary'
			},
			{
				name: 'Document',
				value: 'documents'
			},
			{
				name: 'Profile',
				value: 'profiles',
			},
			{
				name: 'Transfer',
				value: 'transfer'
			},
		],
		default: 'accounts',
		noDataExpression: true,
		required: true,
		description: 'Personal Account Options',
	},
];

export const accountOperations: INodeProperties[] = [
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
			{
				name: 'Account Pending Transactions',
				value: 'getPendingTransactions',
				description: 'Obtain a specified accounts pending transactions',
				action: 'Get account pending transactions',
			},
		],
		default: 'getAccounts',
		noDataExpression: true,
	},
];

export const profileOperations: INodeProperties[] = [
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
			{
				name: 'Profile Accounts',
				value: 'getProfileAccounts',
				description: 'List all the accounts for the profile specified',
				action: 'List all profiles accounts',
			},
			{
				name: 'Authorisation Setup Details',
				value: 'getAuthorisationSetupDetails',
				description: 'List the authorisation setup details for the specified profile and accounts',
				action: 'List authorisation setup details',
			},
			{
				name: 'Profile Beneficiaries',
				value: 'getProfileBeneficiaries',
				description: 'List all the beneficiaries available for the profile and account specified',
				action: 'List all available beneficiaries',
			},
		],
		default: 'getProfiles',
		noDataExpression: true,
	},
];

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Transfer Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['transfer'],
			},
		},
		options: [
			{
				name: 'Transfer Multiple',
				value: 'transferMultiple',
				description: 'Transfer funds to one or multiple accounts',
				action: 'Inter account transfers',
			},
		],
		default: 'transferMultiple',
		noDataExpression: true,
	},
];

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Document Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['documents'],
			},
		},
		options: [
			{
				name: 'List Documents',
				value: 'listDocuments',
				description: 'List all the documents available',
				action: 'List all documents',
			},
			{
				name: 'Get Document',
				value: 'getDocument',
				description: 'Retrieve the document specified',
				action: 'Retreive document',
			},
		],
		default: 'listDocuments',
		noDataExpression: true,
	},
];

export const beneficiaryOperations: INodeProperties[] = [
	{
		displayName: 'Beneficiary Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['beneficiary'],
			},
		},
		options: [
			{
				name: 'List Beneficiaries',
				value: 'getBeneficiaries',
				description: 'List of beneficiaries linked to the profile',
				action: 'List of beneficiaries',
			},
			{
				name: 'List Beneficiary Categories',
				value: 'getBeneficiaryCategories',
				description: 'List all the beneficiary categories available',
				action: 'List of beneficiary categories',
			},
			{
				name: 'Pay Multiple',
				value: 'payMultiple',
				description: 'Pay funds to one or multiple beneficiaries. This includes payments requiring authorisation.',
				action: 'Pay multiple beneficiaries',
			},
		],
		default: 'getBeneficiaries',
		noDataExpression: true,
	},
];
