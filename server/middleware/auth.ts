// import { Request, Response, NextFunction } from "express";
// import jwt, { Secret } from "jsonwebtoken";

// interface ICustomRequest {
//   user: string;
// }

// interface IVerifiedTokenData {
//   id: string;
// }

// export interface IGetUserAuthInfoRequest extends Request, ICustomRequest {}

// export const auth = (
//   req: IGetUserAuthInfoRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

//     const verified = jwt.verify(token, process.env.JWT_SECRET as Secret);

//     req.user = (verified as IVerifiedTokenData).id;

//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ errorMessage: "Unauthorized" });
//   }
// };
