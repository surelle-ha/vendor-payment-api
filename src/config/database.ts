import { Express } from "express";
import { Sequelize } from "sequelize";

module.exports = async function setupDatabase(app: Express): Promise<void> {
	const { env } = app.z;
	app.z.sequelize = new Sequelize(env.database.name, env.database.username, env.database.password, {
		host: env.database.host,
		port: env.database.port,
		dialect: env.database.type,
		logging: false,
		dialectOptions: {
			ssl: env.database.type === 'postgres' ? { require: true, rejectUnauthorized: false } : false,
		},
	});
	try {
		await app.z.sequelize.authenticate();
		app.z.logger.info(`Database connected successfully`);
	} catch (error: any) {
		console.log(error)
		app.z.logger.error(`[SQL] Connection Error`, error.message);
	}
}
