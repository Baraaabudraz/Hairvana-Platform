"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("hairstyles", {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: { type: Sequelize.TEXT },
        tags: { type: Sequelize.ARRAY(Sequelize.STRING) },
        image_url: { type: Sequelize.STRING },
        // ar_model_url intentionally omitted — AR feature removed
        gender: { type: Sequelize.STRING },
        length: { type: Sequelize.STRING },
        color: { type: Sequelize.STRING },
        salon_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: "salons", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
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
      await queryInterface.dropTable("hairstyles", { transaction: t });
    });
  },
};