"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("billing_histories", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        subscription_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "subscriptions", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: { isIn: [["paid", "pending", "failed", "refunded"]] },
        },
        description: { type: Sequelize.STRING, allowNull: true },
        invoice_number: { type: Sequelize.STRING, allowNull: true },
        tax_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
        subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
        total: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
        // Previously added by add-transaction-id-to-billing-histories.js
        transaction_id: { type: Sequelize.STRING, allowNull: true },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      }, { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("billing_histories", { transaction: t });
    });
  },
};