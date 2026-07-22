"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("security_settings", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
        },
        two_factor_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        password_last_changed: { type: Sequelize.DATE },
        login_attempts: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        last_login_ip: { type: Sequelize.TEXT },
        allowed_ips: { type: Sequelize.ARRAY(Sequelize.TEXT) },
        session_timeout: {
          type: Sequelize.INTEGER,
          defaultValue: 30,
        },
        // Fields previously added by add-missing-security-fields.js
        password_expiry_days: {
          type: Sequelize.INTEGER,
          defaultValue: 90,
          allowNull: true,
        },
        data_retention_period: {
          type: Sequelize.INTEGER,
          defaultValue: 365,
          allowNull: true,
        },
        ssl_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: true,
        },
        encryption_level: {
          type: Sequelize.STRING,
          defaultValue: "AES-256",
          allowNull: true,
        },
        audit_logging: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: true,
        },
        backup_frequency: {
          type: Sequelize.STRING,
          defaultValue: "daily",
          allowNull: true,
        },
        backup_retention: {
          type: Sequelize.INTEGER,
          defaultValue: 30,
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
      await queryInterface.dropTable("security_settings", { transaction: t });
    });
  },
};