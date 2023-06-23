import { Request, NextFunction } from 'express';
import { IErrorResponse } from '../shared/responsesInterfaces';

const errorHandler = ((error: Error, req: Request, res: IErrorResponse, next: NextFunction) => {
    console.error('Other Error:', error);
    const response = { message: error.message };
    res.status(500).json(response);
});

export default errorHandler;
