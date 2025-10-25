import type {
    IAuthenticateGeneric,
    Icon,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ScriberrApiKeyApi implements ICredentialType {
    name = 'scriberrApiKeyApi';

    displayName = 'Scriberr API Key API';

    documentationUrl = 'https://scriberr.app/api.html';

    icon: Icon = { light: 'file:../icons/scriberr.svg', dark: 'file:../icons/scriberr.dark.svg' };

    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://scriberr.app',
            placeholder: 'e.g. https://scriberr.app or http://localhost:8080',
            description:
                'Base URL of your Scriberr instance (without trailing slash). Defaults to the hosted service.'
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'API key to authenticate requests (sent in X-API-Key header)'
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'X-API-Key': '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            url: '={{$credentials.baseUrl}}/api/v1/transcription/models',
            method: 'GET',
        },
    };
}
