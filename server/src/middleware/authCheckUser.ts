import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
import { Request, Response } from 'express';
import { prisma } from '../db';

export const isAuthorizedUser = (req: Request, res:Response, next: Function) => {
    if(req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) {
            res.status(401).json({message: "User not authorized"});
            return;
        }

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
        next(error);
    }
}

export const isVerifiedUser = async (req: Request, res: Response, next: Function) => {
    const tokenUser = req.user;
     
    try {
        const user = await prisma.user.findUnique({where: {email: tokenUser.email}});
        if(!user) {
            res.status(404).json({success: false, message: "User not found"});
            return;
        }

        if(!user.verified) {
            res.status(403).json({success: false, message: "User not verified"});
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error});
        next(error);
    }
}