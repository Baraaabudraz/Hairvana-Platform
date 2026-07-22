"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // subscriptions uses owner_id (user who owns the subscription),
      // NOT salon_id. salon_id was renamed to owner_id in production —
      // this base table reflects the final, correct schema.
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_subscriptions_billing_period";',
        { transaction: t }
      );

      await queryInterface.createTable("subscriptions", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        // owner_id replaces the former salon_id column
        owner_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        plan_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "subscription_plans", key: "id" },
        },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: { isIn: [["active", "trial", "cancelled", "past_due"]] },
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        end_date: { type: Sequelize.DATE, allowNull: true },
        billing_period: {
          type: Sequelize.ENUM("monthly", "yearly"),
          allowNull: false,
          defaultValue: "monthly",
        },
        next_billing_date: { type: Sequelize.DATE, allowNull: false },
        amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
        billing_cycle: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: { isIn: [["monthly", "yearly"]] },
        },
        usage: { type: Sequelize.JSONB },
        payment_method: { type: Sequelize.JSONB },
        payment_id: {
          type: Sequelize.UUID,
          allowNull: true,
          // forward ref populated after subscription_payments table is created
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
      await queryInterface.dropTable("subscriptions", { transaction: t });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_subscriptions_billing_period";',
        { transaction: t }
      );
    });
  },
};
