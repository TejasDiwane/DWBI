import { NextFunction, Request, Response } from "express";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`[${req.method}] ${req.path} - ${endTime - startTime}ms`);
    });
    next();
}
