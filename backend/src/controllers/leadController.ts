import { Request, Response, NextFunction } from "express";

export const getAllLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const assignLeadToAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const changeLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
