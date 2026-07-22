"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("integration_settings", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        email_provider: {
          type: Sequelize.TEXT,
          defaultValue: "sendgrid",
        },
        email_api_key: { type: Sequelize.TEXT },
        sms_provider: {
          type: Sequelize.TEXT,
          defaultValue: "twilio",
        },
        sms_api_key: { type: Sequelize.TEXT },
        stripe_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        email_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        sms_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        payment_gateway: {
          type: Sequelize.TEXT,
          defaultValue: "stripe",
        },
        payment_api_key: { type: Sequelize.TEXT },
        analytics_provider: {
          type: Sequelize.TEXT,
          defaultValue: "google",
        },
        analytics_tracking_id: { type: Sequelize.TEXT },
        social_logins: {
          type: Sequelize.JSONB,
          defaultValue: { google: true, facebook: false, apple: false },
        },
        webhooks: { type: Sequelize.ARRAY(Sequelize.JSONB) },
        stripe_webhook_secret: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        // Previously added by add-stripe-publishable-key.js
        stripe_publishable_key: {
          type: Sequelize.TEXT,
          allowNull: true,
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
      await queryInterface.dropTable("integration_settings", { transaction: t });
    });
  },
};