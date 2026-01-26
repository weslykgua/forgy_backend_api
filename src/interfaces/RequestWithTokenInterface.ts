import { JWTPayload } from "./JwtPayloadInterface";
import { Request } from "express";

export interface RequestWithTokenInterface extends Request {
  token: JWTPayload
}