"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("users", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        phone: {
          type: Sequelize.TEXT,
        },
        role_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "SET NULL",
        },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: "active",
          validate: {
            isIn: [["active", "pending", "suspended"]],
          },
        },
        join_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        last_login: {
          type: Sequelize.DATE,
        },
        avatar: {
          type: Sequelize.TEXT,
        },
        permissions: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
        },
        password_hash: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        preferences:{
          type: Sequelize.JSONB,
          allowNull:true
        },
        reset_token:{
          type:Sequelize.TEXT,
          allowNull: true,
          comment: 'Hashed password reset token'
        },
        reset_token_expires:{
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Expiration date for password reset token'
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
      await queryInterface.dropTable("users", { transaction: t });
    });
  },
};
