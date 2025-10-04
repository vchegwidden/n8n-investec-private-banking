import type { INodeProperties } from 'n8n-workflow';

export const accountFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'accounts',
					'profiles',
					'transfer',
					'documents'
				],
				operation: [
					'getBalance',
					'getTransactions',
					'getAuthorisationSetupDetails',
					'getProfileBeneficiaries',
					'transferMultiple',
					'listDocuments',
					'getDocument',
				],
			},
		},
		default: '',
		description: 'The bank account ID',
	},
	{
		displayName: 'Transaction Filter Fields',
		name: 'additionalFields',
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
				hint: 'The date from which to start the transaction search',

			},
			{
				displayName: 'Transactions End Date',
				name: 'toDate',
				type: 'dateTime',
				default: '',
				hint: 'The date at which to end the transaction search',
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
];

export const profileFields: INodeProperties[] = [
    {
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['profiles', 'transfer'],
				operation: [
					'getProfileAccounts',
					'getAuthorisationSetupDetails',
					'getProfileBeneficiaries',
					'transferMultiple'
				],
			},
		},
		default: '',
		description: 'The user profile ID',
	},
]

export const transferFields: INodeProperties[] = [
	{
		displayName: 'Transfer List',
		name: 'additionalFields',
		type: 'fixedCollection',
		placeholder: 'Add Transfer Details',
		typeOptions: {
			multipleValues: true
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['transferMultiple'],
			},
		},
		options: [
			{
				displayName: 'transferList',
				name: 'transferList',
				values: [
					{
						displayName: 'Beneficiary Account ID',
						name: 'beneficiaryAccountId',
						type: 'string',
						default: '',
						hint: 'The account ID for the transfer destination',
					},
					{
						displayName: 'Transactions End Date',
						name: 'amount',
						type: 'number',
						default: 0,
						hint: 'The amount to transfer',
					},
					{
						displayName: 'From Account Reference',
						name: 'myReference',
						type: 'string',
						default: '',
						hint: "My account reference"
					},
					{
						displayName: 'Beneficiary Account Reference',
						name: 'theirReference',
						type: 'string',
						default: '',
						hint: 'Their account reference'
					},
				]
			}
		],
	},
];

export const documentFields: INodeProperties[] = [
	{
		displayName: 'Document Type',
		name: 'documentType',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['documents'],
				operation: ['getDocument',],
			},
		},
		default: '',
		description: 'The document type',
	},
	{
		displayName: 'Document Date',
		name: 'documentDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['documents'],
				operation: ['getDocument',],
			},
		},
		default: '',
		description: 'The document date',
	},
	{
		displayName: 'Documents Start Date',
		name: 'documentFromDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['documents'],
				operation: ['listDocuments'],
			},
		},
		default: '',
		description: 'The date from which to start the document search',
	},
	{
		displayName: 'Document End Date',
		name: 'documentToDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['documents'],
				operation: ['listDocuments'],
			},
		},
		default: '',
		description: 'The date at which to end the document search',
	},
]