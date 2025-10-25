import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    Icon,
} from 'n8n-workflow';

export class ScriberrJwtApi implements ICredentialType {
    name = 'scriberrJwtApi';

    displayName = 'Scriberr JWT API';

    documentationUrl = 'https://scriberr.app/api.html';

    icon: Icon = { light: 'file:../icons/scriberr.svg', dark: 'file:../icons/scriberr.dark.svg' };

    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'http://localhost:8080',
            placeholder: 'http://localhost:8080',
            description:
                'Base URL of your Scriberr instance (without trailing slash). Defaults to localhost.'
        },
        {
            displayName: 'How to get JWT Token',
            name: 'jwtInstructions',
            type: 'notice',
            default: '',
            description: 'To get a JWT token: Use Scriberr node with Resource=Auth, Operation=Login. Enter your username/password, run the workflow, then copy the "accessToken" from the output and paste it below.'
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
                Authorization: '={{"Bearer " + $credentials.accessToken}}',
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
