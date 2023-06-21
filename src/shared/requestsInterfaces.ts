import { Request } from 'express';
import { IProductDetail } from './interfaces';


interface ICustomRequest extends Request {
    userUid: string,
}

interface ISignupRequest extends Request {
    body: {
        email: string,
        password: string,
    };
}

interface ISigninRequest extends ISignupRequest { }

interface IProfileUpdateRequest extends ICustomRequest {
    body: {
        email: string,
        currentPassword: string,
        newPassword: string,
    };
}

interface IProfileDeleteRequest extends ICustomRequest {
    body: {
        email: string,
        currentPassword?: string,
    };
}

interface IProjectCreateRequest extends ICustomRequest {
    body: {
        projectId: string,
    };
}

interface IProjectDeleteRequest extends IProjectCreateRequest { }

interface IProductAddRequest extends ICustomRequest {
    body: {
        projectId: string,
        product: IProductDetail,
    };
}

interface IProductUpdateRequest extends IProductAddRequest { }

interface IProductDeleteRequest extends IProductAddRequest { }


export {
    ICustomRequest,
    ISignupRequest,
    ISigninRequest,
    IProfileUpdateRequest,
    IProfileDeleteRequest,
    IProjectCreateRequest,
    IProjectDeleteRequest,
    IProductAddRequest,
    IProductUpdateRequest,
    IProductDeleteRequest,
};
