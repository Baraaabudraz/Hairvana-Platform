"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("permissions", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        role_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        resource: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        action: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        allowed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
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

      await queryInterface.addConstraint("permissions", {
        fields: ["role_id", "resource", "action"],
        type: "unique",
        name: "unique_role_resource_action",
        transaction: t
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("permissions", { transaction: t });
    });
  },
};
