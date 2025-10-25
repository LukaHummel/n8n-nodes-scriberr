import type {
    IAuthenticateGeneric,
    Icon,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ScriberrJwtApi implements ICredentialType {
    name = 'scriberrJwtApi';

    displayName = 'Scriberr JWT API';

    icon: Icon = { light: 'file:../icons/github.svg', dark: 'file:../icons/github.dark.svg' };

    documentationUrl = 'https://scriberr.app/api.html';

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
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'JWT access token to authenticate requests (sent as Bearer token)'
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
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
