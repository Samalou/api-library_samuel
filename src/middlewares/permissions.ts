import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const checkPermissions = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const userPermissions = decodedToken.permissions;

      // Vérifier si l'utilisateur a les permissions nécessaires
      if (userPermissions[resource]?.includes(action)) {
        next();
      } else {
        return res.status(403).send("Forbidden: Insufficient permissions");
      }
    } catch (error) {
      return res.status(401).send("Invalid token");
    }
  };
};
