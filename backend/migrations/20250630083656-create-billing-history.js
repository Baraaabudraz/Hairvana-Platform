'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable('billing_history', {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        subscription_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'subscriptions',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            isIn: [['paid', 'pending', 'failed', 'refunded']]
          }
        },
        description: {
          type: Sequelize.TEXT
        },
        invoice_number: {
          type: Sequelize.TEXT
        },
        tax_amount: {
          type: Sequelize.DECIMAL(10, 2)
        },
        subtotal: {
          type: Sequelize.DECIMAL(10, 2)
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('billing_history', { transaction: t });
    });
  }
};
