import { Sequelize } from 'sequelize';
const uuid = require("uuid");
const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize: Sequelize) {
	class User extends Model {}

	User.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			middle_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email_verified: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Roles",
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "User",
			timestamps: true,
			defaultScope: {
				attributes: { exclude: ["password"] },
			},
			scopes: {
				withPassword: {
					attributes: { include: ["password"] },
				},
			},
		}
	);

	User.associate = function (models: any) {
		User.belongsTo(models.Role, {
			foreignKey: "role_id",
			as: "Role",
		});
	};

	return User;
};
