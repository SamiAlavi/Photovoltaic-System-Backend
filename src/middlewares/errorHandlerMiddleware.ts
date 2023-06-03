import { Request, Response, NextFunction } from 'express';

// Error handling middleware
const errorHandlerMiddleware = ((error: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle the error and send a response to the client
    // console.error('Other Error:', error);
    res.status(500).send({ error: error.message });
});

export default errorHandlerMiddleware;
