import express, { NextFunction, Request, Response } from "express";
import Recipe from "../models/recipe";
const router = express.Router();

router.get("/all", (req, res) => {});

router.get("/entrees", (req, res) => {});

router.get("/mains", (req, res) => {});

router.get("/deserts", (req, res) => {});

router.post("/add", (req, res) => {});

export default router;
