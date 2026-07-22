"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("salon_owners", {
        user_id: {
          type: Sequelize.UUID,
          primaryKey: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        total_salons: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        total_revenue: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0,
        },
        total_bookings: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      }, { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("salon_owners", { transaction: t });
    });
  },
};
