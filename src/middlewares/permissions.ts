import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const checkPermissions = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(false);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const userPermissions = decodedToken.permissions;

      const hasPermission = userPermissions[resource]?.includes(action);

      return next(hasPermission);
    } catch (error) {
      return next(false);
    }
  };
};
