import { Request, NextFunction } from 'express';
import { IErrorResponse } from '../shared/responsesInterfaces';

const errorHandler = ((error: Error, req: Request, res: IErrorResponse, next: NextFunction) => {
    // Handle the error and send a response to the client
    console.error('Other Error:', error);
    res.status(500).send({ message: error.message });
});

export default errorHandler;
