const bcrypt = require("bcrypt");
import { Express, Request, Response } from "express";


module.exports = (app: Express) => {
    const { env } = app.z;
    const { Vendor, Payment, Vendor_Payment } = app.z.models;
    const { NotFoundError } = app.z.exceptions.Common

    const Controller: object = {
        name: "Payment",
        create: async (req: Request, res: Response) => {
            try {
                const result = await Payment.create({
                    name: req.body.name,
                    address: req.body.address,
                    amount: req.body.amount,
                    expiry_date: req.body.expiry_date,
                    status: req.body.status,
                });
                res.status(201).json({ message: "Payment created", paymentData: result });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        get: async (req: Request, res: Response) => {
            try {
                const payment = await Payment.findByPk(req.params.payment_id);
                if (!payment) {
                    throw new NotFoundError("Payment not found");
                }
                const paymentData = payment.get({ plain: true });
                res.status(200).json(paymentData);
            } catch (err: any) {
                if (err instanceof NotFoundError) {
                    res.status(404).json({ message: err.message });
                } else {
                    res.status(500).json({ error: "Server Error", message: err.message });
                }
            }
        },
        getAll: async (req: Request, res: Response) => {
            try {
                const payments = await Payment.findAll();
                res.status(200).json(payments);
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        update: async (req: Request, res: Response) => {
            try {
                const [affectedRows, updatedPayments] = await Payment.update(req.body, {
                    where: { id: req.params.payment_id },
                    returning: true,
                    plain: true,
                });
                if (affectedRows === 0) {
                    return res.status(404).json({ message: "Payment not found" });
                }
                res.status(200).json({ message: "Payment updated", userData: updatedPayments[0] });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        delete: async (req: Request, res: Response) => {
            try {
                const deleted = await Payment.destroy({
                    where: { id: req.params.payment_id },
                });
                if (deleted === 0) {
                    return res.status(404).json({ message: "Payment not found" });
                }
                res.status(200).json({ message: "Payment deleted" });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        deleteAll: async (req: Request, res: Response) => {
            try {
                await Payment.destroy({ where: {} });
                res.status(200).json({ message: "All payments deleted" });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        assign: async (req: Request, res: Response) => {
            try {
                const payment = await Payment.findByPk(req.body.payment_id);
                if (!payment) {
                    throw new NotFoundError("Payment not found");
                }
                const vendor = await Vendor.findByPk(req.params.vendor_id);
                if (!vendor) {
                    throw new NotFoundError("Vendor not found");
                }
                await Vendor_Payment.create({
                    vendor_id: vendor.id,
                    payment_id: payment.id,
                });
                res.status(200).json({ message: "Payment assigned to vendor", paymentData: payment });
            } catch (err: any) {
                if (err instanceof NotFoundError) {
                    res.status(404).json({ message: err.message });
                } else {
                    res.status(500).json({ error: "Server Error", message: err.message });
                }
            }
        }
    };

    return Controller;
};
