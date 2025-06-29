import { Sequelize } from 'sequelize';
const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize: Sequelize) {
	class Payment extends Model { }

	Payment.init(
		{
			tax_id: {
				allowNull: false,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			expiry_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Payment",
			tableName: "Payments",
			timestamps: true
		}
	);

	Payment.associate = function (models: any) {
		Payment.belongsToMany(models.Vendor, {
			through: "Vendor_Payment",
			as: "Vendors",
			foreignKey: "payment_id",
			otherKey: "vendor_id",
		});
	};

	return Payment;
};
