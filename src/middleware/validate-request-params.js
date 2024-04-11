import { validationResult } from "express-validator";

export const validateRequestParams = async (req, res, next) => {
  const result = validationResult(req);
  console.log({ result });
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.errors });
  }

  next();
};
