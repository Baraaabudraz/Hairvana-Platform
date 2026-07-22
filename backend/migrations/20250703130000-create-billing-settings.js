"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("billing_settings", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        default_payment_method: { type: Sequelize.STRING, allowNull: true },
        // billing_address is TEXT directly — previously altered from JSONB
        billing_address: { type: Sequelize.TEXT, allowNull: true },
        tax_id: { type: Sequelize.STRING, allowNull: true },
        invoice_email: { type: Sequelize.STRING, allowNull: false },
        auto_pay: { type: Sequelize.BOOLEAN, defaultValue: false },
        payment_methods: { type: Sequelize.JSONB, allowNull: true },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      }, { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("billing_settings", { transaction: t });
    });
  },
};