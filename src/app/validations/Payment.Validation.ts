import { Express, Request, Response, NextFunction } from 'express';
const { body, validationResult } = require("express-validator");

interface Validation {
    name: string;
    check?: object;
}

module.exports = function (app: Express): Validation {
    const { ValidationError } = app.z.exceptions.Common;
    const Validation: Validation = {
        name: "Payment",
    };

    const createRules = [
        body("name")
            .exists()
            .withMessage("Name is required")
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters long"),
        body("address")
            .exists()
            .withMessage("Address is required")
            .isLength({ min: 2 })
            .withMessage("Address must be at least 2 characters long"),
        body("amount")
            .exists()
            .withMessage("Amount is required")
            .isLength({ min: 2 })
            .withMessage("Amount must be at least 2 digits long"),
        body("expiry_date")
            .exists()
            .withMessage("Expiry Date is required")
            .isISO8601()
            .withMessage("Expiry Date must be a valid date in ISO 8601 format"),
        body("status")
            .exists()
            .withMessage("Status is required")
            .isIn(['pending', 'completed', 'failed'])
            .withMessage("Status must be one of: pending, completed, failed")
    ];

    const handleErrors = (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }
            next();
        } catch (err: any) {
            return res.status(500).json({
                error: "Validation Error", message: JSON.parse(err.message)
            });
        };
    }

    Validation.check = {
        create: [
            createRules,
            handleErrors
        ],
        update: [
            createRules,
            handleErrors
        ]
    };

    return Validation;
};
