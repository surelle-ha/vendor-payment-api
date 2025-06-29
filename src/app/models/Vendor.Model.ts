import { Sequelize } from 'sequelize';
const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize: Sequelize) {
	class Vendor extends Model { }

	Vendor.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contact: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bank_account: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bank_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Vendor",
			tableName: "Vendors",
			timestamps: true
		}
	);

	Vendor.associate = function (models: any) {
		Vendor.belongsToMany(models.Payment, {
			through: "Vendor_Payment",
			as: "Payments",
			foreignKey: "vendor_id",
			otherKey: "payment_id",
		});
	};

	return Vendor;
};
