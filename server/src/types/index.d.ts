import { prisma } from "../db";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}