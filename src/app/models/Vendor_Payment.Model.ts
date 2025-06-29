import { Sequelize } from "sequelize";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize: Sequelize) => {
	class Vendor_Payment extends Model { }

	Vendor_Payment.init(
		{
			vendor_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Vendors",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			payment_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Payments",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
		},
		{
			sequelize,
			modelName: "Vendor_Payment",
			tableName: "Vendor_Payments",
			timestamps: true,
		}
	);

	Vendor_Payment.associate = function (models: any) {
		this.belongsTo(models.Vendor, { foreignKey: "vendor_id", as: "Vendor" });
		this.belongsTo(models.Payment, {
			foreignKey: "payment_id",
			as: "Payment",
		});
	};

	return Vendor_Payment;
};
