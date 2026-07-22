"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("salons", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        phone: {
          type: Sequelize.TEXT,
        },
        address_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: "addresses", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        status: {
          type: Sequelize.ENUM("active", "pending", "suspended"),
          allowNull: false,
          defaultValue: "pending",
        },
        join_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        hours: { type: Sequelize.JSONB },
        website: { type: Sequelize.TEXT },
        description: { type: Sequelize.TEXT },
        business_license: { type: Sequelize.TEXT },
        tax_id: { type: Sequelize.TEXT },
        avatar: { type: Sequelize.STRING },
        // gallery added directly — previously in extend-salon.js
        gallery: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
        owner_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
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
      await queryInterface.dropTable("salons", { transaction: t });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_salons_status";',
        { transaction: t }
      );
    });
  },
};