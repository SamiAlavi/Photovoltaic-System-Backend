import { Request, Response, NextFunction } from 'express';

const errorHandler = ((error: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle the error and send a response to the client
    // console.error('Other Error:', error);
    res.status(500).send({ message: error.message });
});

export default errorHandler;
