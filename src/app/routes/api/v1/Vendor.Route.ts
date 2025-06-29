import { Express, Router } from "express";

module.exports = (app: Express): Router => {
	const router = Router();
	const { Vendor: VendorController } = app.z.controllers;
	const { Auth: AuthMiddleware, Permission: PermissionMiddleware } = app.z.middlewares;

	app.use("/api/v1/vendors", [AuthMiddleware.authenticate]);

	router.post(
		"/vendors",
		[PermissionMiddleware.authorize("create-vendor")],
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
		[PermissionMiddleware.authorize("update-vendor")],
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

	return router;
};
