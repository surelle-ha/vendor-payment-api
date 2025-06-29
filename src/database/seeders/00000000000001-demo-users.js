"use strict";
const { v4: uuidv4 } = require('uuid');
const { generateUser } = require('../factories/User.Factory'); 

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = [];

		users.push({ 
			id: uuidv4(),
			first_name: "Admin", 
			middle_name: "Admin", 
			last_name: "Admin", 
			email: "admin@admin.com",
			password: "$2b$12$IXykuuBFLlEbbJGdjn4foOPTKYvCEM7XcV9iLWYhP.BQa9ocfvefC",
			role_id: 1,
			email_verified: true,
			status: "Active",
			createdAt: new Date(), 
			updatedAt: new Date() 
		});

        for (let i = 0; i < 300; i++) { 
            users.push(await generateUser());
        }

        await queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
    },
};
