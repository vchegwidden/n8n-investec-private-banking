// import { URLSearchParams } from 'url';
import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

// https://docs.n8n.io/integrations/creating-nodes/build/reference/credentials-files/
export class InvestecPrivateBankingApi implements ICredentialType {
	name = 'investecPrivateBankingApi';
	displayName = 'Investec Private Banking API';
	documentationUrl =
		'https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#section/Authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string' as const,
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string' as const,
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
			auth: {
				username: '={{$credentials.clientId}}',
				password: '={{$credentials.clientSecret}}',
			},
		},
	};
}
