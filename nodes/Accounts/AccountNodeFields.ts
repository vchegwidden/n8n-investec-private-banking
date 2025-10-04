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
					'documents',
					'beneficiary',
				],
				operation: [
					'getBalance',
					'getTransactions',
					'getAuthorisationSetupDetails',
					'getProfileBeneficiaries',
					'transferMultiple',
					'listDocuments',
					'getDocument',
					'payMultiple',
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
						displayName: 'Amount',
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
						displayName: 'To Account Reference',
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
];

export const beneficiaryFields: INodeProperties[] = [
	{
		displayName: 'Payment List',
		name: 'additionalFields',
		type: 'fixedCollection',
		placeholder: 'Add Payment Details',	
		typeOptions: {
			multipleValues: true
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['payMultiple'],
			},
		},
		options: [
			{
				displayName: 'paymentList',
				name: 'paymentList',
				values: [
					{
						displayName: 'Beneficiary ID',
						name: 'beneficiaryId',
						type: 'string',
						default: '',
						required: true,
						hint: 'The beneficairy ID for the payment',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						required: true,
						hint: 'The amount to transfer',
					},
					{
						displayName: 'From Account Reference',
						name: 'myReference',
						type: 'string',
						default: '',
						required: true,
						hint: "My account reference"
					},
					{
						displayName: 'Beneficiary Account Reference',
						name: 'theirReference',
						type: 'string',
						default: '',
						required: true,
						hint: 'Their account reference'
					},
					{
						displayName: 'Additional Payment Fields',
						name: 'additionalOptionalFields',
						type: 'collection',
						placeholder: 'Add Field',
						default: {},
						// displayOptions: {
						// 	show: {
						// 		resource: ['accounts'],
						// 		operation: ['getTransactions'],
						// 	},
						// },
						options: [
							{
								displayName: 'Authoriser A',
								name: 'authoriserAId',
								type: 'string',
								default: '',
								hint: 'If the payment requires authorisation this is derived from profiles/{profileid}/accounts/{accountId}/authorisationsetupdetails.',

							},
							{
								displayName: 'Authoriser B',
								name: 'authoriserBId',
								type: 'string',
								default: '',
								hint: 'If the payment requires authorisation this is derived from profiles/{profileid}/accounts/{accountId}/authorisationsetupdetails.',
							},
							{
								displayName: 'Auth Period',
								name: 'authPeriodId',
								type: 'string',
								default: '',
								hint: 'If the payment requires authorisation this is derived from profiles/{profileid}/accounts/{accountId}/authorisationsetupdetails.',
							},
							{
								displayName: 'Faster Payment',
								name: 'fasterPayment',
								type: 'boolean',
								default: false,
								hint: 'If the payment requires authorisation this can be set to true if the beneficiary allows it from profiles/{profileid}/beneficiaries/{accountid}.',
							},
						],
					},
				]
			}
		],
	},
];