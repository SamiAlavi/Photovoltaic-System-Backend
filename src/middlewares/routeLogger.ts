import { Request, Response, NextFunction } from 'express';

const routeLogger = (req: Request, res: Response, next: NextFunction): void => {
    // const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log(`[${req.method}] ${req.url}`);
    next();
};

export default routeLogger;
