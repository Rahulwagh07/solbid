import jwt from "jsonwebtoken";
import { sendError } from "./utils";
import { WebSocket } from "ws";

export async function verifyToken(ws: WebSocket, token: string): Promise<boolean> {
  try {
    await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.NEXT_PUBLIC_SECRET as string,
        (err: any, decoded: any) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });
    return true;
    
  } catch (error) {
    sendError(ws, "Unauthorized");
    return false;
  }
}