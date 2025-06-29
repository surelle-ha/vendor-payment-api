import { Express, Request, Response, NextFunction } from 'express';
const { body, validationResult } = require("express-validator");

interface Validation {
    name: string;
    check?: object;
}

module.exports = function (app: Express): Validation {
    const { ValidationError } = app.z.exceptions.Common;
    const Validation: Validation = {
        name: "Vendor",
    };

    const createRules = [
        body("name")
            .exists()
            .withMessage("Name is required")
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters long"),
        body("contact")
            .exists()
            .withMessage("Contact Number is required")
            .isLength({ min: 2 })
            .withMessage("Contact Number must be at least 2 characters long"),
        body("bank_account")
            .exists()
            .withMessage("Bank Account Name is required")
            .isLength({ min: 2 })
            .withMessage("Bank Account Name must be at least 2 characters long"),
        body("bank_number")
            .exists()
            .withMessage("Bank Number is required")
            .isLength({ min: 2 })
            .withMessage("Bank Number must be at least 2 characters long"),
        body("address")
            .exists()
            .withMessage("Address is required")
            .isLength({ min: 2 })
            .withMessage("Address must be at least 2 characters long")
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
