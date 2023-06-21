import { Response } from 'express';
import { ICustomUserRecord, IProduct, IProject } from './interfaces';

interface ExtendedResponse<T> extends Response {
    send(data: T): this;
    json(data: T): this;
}

interface IErrorResponse extends ExtendedResponse<{ message: string; }> { };

interface ISuccessResponse extends ExtendedResponse<{ message: "Success"; }> { };
interface IBooleanResponse extends ExtendedResponse<boolean> { };

interface ISignupResponse extends ExtendedResponse<ICustomUserRecord> { };

interface ISigninResponse extends ISignupResponse { };

interface IProfileDeleteResponse extends ISuccessResponse { };

interface IProductsGetResponse extends ExtendedResponse<IProduct[]> { };

interface IProjectsGetResponse extends ExtendedResponse<IProject[]> { };

interface IProjectCreateResponse extends ExtendedResponse<IProject> { };

interface IProjectDeleteResponse extends IBooleanResponse { };

interface IProductAddResponse extends ISuccessResponse { };

interface IProductUpdateResponse extends ISuccessResponse { };

interface IProductDeleteResponse extends ISuccessResponse { };

export {
    IErrorResponse,
    IProfileDeleteResponse,
    ISignupResponse,
    ISigninResponse,
    IProductsGetResponse,
    IProjectsGetResponse,
    IProjectCreateResponse,
    IProjectDeleteResponse,
    IProductAddResponse,
    IProductUpdateResponse,
    IProductDeleteResponse,
};
