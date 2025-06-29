import { Express, Router } from "express";

module.exports = (app: Express): Router => {
	const router = Router();
	const { Vendor: VendorController, Payment: PaymentController } = app.z.controllers;
	const { Auth: AuthMiddleware, Permission: PermissionMiddleware } = app.z.middlewares;
	const { Vendor: VendorValidation } = app.z.validations;

	app.use("/api/v1/vendors", [AuthMiddleware.authenticate]);

	router.post(
		"/vendors",
		[
			PermissionMiddleware.authorize("create-vendor"),
			VendorValidation.check.create
		],
		VendorController.createVendor
	);

	router.get(
		"/vendors",
		[PermissionMiddleware.authorize("fetch-vendor")],
		VendorController.getAllVendors
	);

	router.get(
		"/vendors/:vendor_id",
		[PermissionMiddleware.authorize("fetch-vendor")],
		VendorController.getVendor
	);

	router.patch(
		"/vendors/:vendor_id",
		[
			PermissionMiddleware.authorize("update-vendor"),
			VendorValidation.check.update
		],
		VendorController.updateVendor
	);

	router.delete(
		"/vendors",
		[PermissionMiddleware.authorize("delete-vendor")],
		VendorController.deleteAllVendors
	);

	router.delete(
		"/vendors/:vendor_id",
		[PermissionMiddleware.authorize("delete-vendor")],
		VendorController.deleteVendor
	);

	router.post(
		"/vendors/:vendor_id/payments",
		[
			PermissionMiddleware.authorize("assign-payment")
		],
		PaymentController.assign
	);

	return router;
};
