import { Request, Response, NextFunction } from 'express';

const routeLogger = (req: Request, res: Response, next: NextFunction): void => {
    // const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const dateTime = new Date().toISOString();
    const httpMethod = req.method;
    const reqPath = req.originalUrl;
    console.log(`[${dateTime}] ${httpMethod} ${reqPath}`);

    next();
};

export default routeLogger;
