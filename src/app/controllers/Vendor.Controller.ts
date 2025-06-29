const bcrypt = require("bcrypt");
import { Express, Request, Response } from "express";


module.exports = (app: Express) => {
    const { env } = app.z;
    const { Payment, Vendor } = app.z.models;
    const { NotFoundError } = app.z.exceptions.Common

    const Controller: object = {
        name: "Vendor",
        createVendor: async (req: Request, res: Response) => {
            try {
                const result = await Vendor.create({
                    name: req.body.name,
                    contact: req.body.contact,
                    bank_account: req.body.bank_account,
                    bank_number: req.body.bank_number,
                    address: req.body.address,
                });
                res.status(201).json({ message: "Vendor created", vendorData: result });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        getVendor: async (req: Request, res: Response) => {
            try {
                const vendor = await Vendor.findByPk(req.params.vendor_id, {
                    include: [{ model: Payment, as: "Payments" }],
                });
                if (!vendor) {
                    throw new NotFoundError("Vendor not found");
                }

                const vendorData = vendor.get({ plain: true });
                const pendingPayments = vendorData.Payments.filter((payment: { status: string; }) => payment.status === "pending");
                const historicalPayments = vendorData.Payments.filter((payment: { status: string; createdAt: string; }) => {
                    if (payment.status === "pending") return false;

                    const filterByStatus = req.query.status ? payment.status === req.query.status : true;
                    const filterByDate = req.query.date ? new Date(payment.createdAt).toISOString().startsWith(req.query.date as string) : true;

                    return filterByStatus && filterByDate;
                });

                delete vendorData.Payments;
                const response = {
                    ...vendorData,
                    pending_payments: pendingPayments,
                    historical_payments: historicalPayments,
                };

                res.status(200).json(response);
            } catch (err: any) {
                if (err instanceof NotFoundError) {
                    res.status(404).json({ message: err.message });
                } else {
                    res.status(500).json({ error: "Server Error", message: err.message });
                }
            }
        },
        getAllVendors: async (req: Request, res: Response) => {
            try {
                const vendors = await Vendor.findAll();
                res.status(200).json(vendors);
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        updateVendor: async (req: Request, res: Response) => {
            try {
                const [affectedRows, updatedVendors] = await Vendor.update(req.body, {
                    where: { id: req.params.vendor_id },
                    returning: true,
                    plain: true,
                });
                if (affectedRows === 0) {
                    return res.status(404).json({ message: "Vendor not found" });
                }
                res.status(200).json({ message: "Vendor updated", userData: updatedVendors[0] });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        deleteVendor: async (req: Request, res: Response) => {
            try {
                const deleted = await Vendor.destroy({
                    where: { id: req.params.vendor_id },
                });
                if (deleted === 0) {
                    return res.status(404).json({ message: "Vendor not found" });
                }
                res.status(200).json({ message: "Vendor deleted" });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
        deleteAllVendors: async (req: Request, res: Response) => {
            try {
                await Vendor.destroy({ where: {} });
                res.status(200).json({ message: "All vendors deleted" });
            } catch (err: any) {
                res.status(500).json({ error: "Server Error", message: err.message });
            }
        },
    };

    return Controller;
};
