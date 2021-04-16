import { requireAuth, validateRequest } from "@eg-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").notEmpty().withMessage("Ticket Id must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {}
);

export { router as newOrderRouter };
