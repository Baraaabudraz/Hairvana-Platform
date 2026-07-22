"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("subscription_payments", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        // owner_id: the user who owns the subscription (replaces former user_id)
        owner_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        salon_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: "salons", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        plan_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "subscription_plans", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        billing_cycle: {
          type: Sequelize.ENUM("monthly", "yearly"),
          allowNull: false,
          defaultValue: "monthly",
        },
        method: {
          type: Sequelize.ENUM("stripe", "paypal", "bank_transfer"),
          allowNull: false,
          defaultValue: "stripe",
        },
        status: {
          type: Sequelize.ENUM("pending", "paid", "failed", "cancelled", "refunded"),
          allowNull: false,
          defaultValue: "pending",
        },
        transaction_id: { type: Sequelize.STRING, allowNull: true },
        payment_date: { type: Sequelize.DATE, allowNull: true },
        payment_intent_id: { type: Sequelize.STRING, allowNull: true },
        client_secret: { type: Sequelize.TEXT, allowNull: true },
        metadata: { type: Sequelize.JSONB, allowNull: true },
        refund_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0,
        },
        refund_reason: { type: Sequelize.TEXT, allowNull: true },
        expires_at: { type: Sequelize.DATE, allowNull: true },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("NOW"),
        },
      }, { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("subscription_payments", { transaction: t });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_subscription_payments_billing_cycle";',
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_subscription_payments_method";',
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_subscription_payments_status";',
        { transaction: t }
      );
    });
  },
};
