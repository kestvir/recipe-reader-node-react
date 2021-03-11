// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import jwt, { Secret } from "jsonwebtoken";

// import User from "../models/user";

// interface IValidationError {
//   errors: { [path: string]: Error.ValidatorError };
//   code: string | number | undefined;
//   message: string;
// }

// interface ICustomValidationError {
//   [key: string]: string | number | undefined;
// }

// const handleErrors = (err: IValidationError) => {
//   console.log(err.message, err.code);
//   let errors: ICustomValidationError;

//   errors = { email: "", password: "" };

//   if (err.message === "incorrect email or password") {
//     errors.email = err.message;
//     errors.password = err.message;
//   }

//   // duplicate email error
//   if (err.code === 11000) {
//     errors.email = "that email is already registered";
//     return errors;
//   }

//   // validation errors
//   if (err.message.includes("user validation failed")) {
//     Object.values(err.errors).forEach(({ properties }) => {
//       let errorMessage: string;
//       if (typeof properties.path === "string") {
//         errorMessage = properties.path;

//         errors[errorMessage] = properties.message;
//       }
//     });
//   }

//   return errors;
// };

// const maxAge = 3 * 24 * 60 * 60;
// const createToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
//     expiresIn: maxAge,
//   });
// };

// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { email, password, passwordVerify } = req.body;

//     if (password !== passwordVerify)
//       return res.status(400).json({
//         errorMessage: "Please enter the same password twice.",
//       });

//     const newUser = new User({
//       email,
//       password,
//     });

//     const savedUser = await newUser.save();

//     const token = createToken(savedUser._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       // secure: true,
//       //   sameSite: "none",
//       maxAge: maxAge * 1000,
//     });

//     res.status(201).json({ user: savedUser._id });
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const existingUser = await User.login(email, password);

//     const token = createToken(existingUser._id);

//     res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });

//     res.status(200).json({ user: existingUser._id });
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };

// export const logout = (req: Request, res: Response) => {
//   res.cookie("token", "", { maxAge: 1 });
// };

// export const isLoggedin = (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.json(false);

//     jwt.verify(token, process.env.JWT_SECRET as Secret);

//     res.send(true);
//   } catch (err) {
//     res.json(false);
//   }
// };
