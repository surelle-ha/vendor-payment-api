import { Express, Request, Response, NextFunction } from "express";

module.exports = async function setupException(app: Express): Promise<void> {
	const { env } = app.z;
    
	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		let message;
		try {
			message = JSON.parse(err.message);
		} catch {
			message = err.message;
		}
		res.status(err.statusCode || 500).send({
			success: err.success || false,
			message,
			error: err.name || "Error",
			...(env.app.environment !== "production" ? { stack: err.stack } : {}),
		});
	});

	// app.get("*", function (req, res) {
	// 	res.status(404).json({ error: "The requested resource was not found." });
	// });
};
