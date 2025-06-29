import { Express, Router } from "express";

module.exports = (app: Express): Router => {
	const router = Router();
	const { Vendor: VendorController, Payment: PaymentController } = app.z.controllers;
	const { Auth: AuthMiddleware, Permission: PermissionMiddleware } = app.z.middlewares;

	app.use("/api/v1/payments", [AuthMiddleware.authenticate]);

	router.post(
		"/payments",
		[PermissionMiddleware.authorize("create-payment")],
		PaymentController.create
	);

	router.get(
		"/payments",
		[PermissionMiddleware.authorize("fetch-payment")],
		PaymentController.getAll
	);

	router.get(
		"/payments/:payment_id",
		[PermissionMiddleware.authorize("fetch-payment")],
		PaymentController.get
	);

	router.patch(
		"/payments/:payment_id",
		[PermissionMiddleware.authorize("update-payment")],
		PaymentController.update
	);

	router.delete(
		"/payments",
		[PermissionMiddleware.authorize("delete-payment")],
		PaymentController.deleteAll
	);

	router.delete(
		"/payments/:payment_id",
		[PermissionMiddleware.authorize("delete-payment")],
		PaymentController.delete
	);

	return router;
};
