module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("AppointmentReminders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      error: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },

      minutes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      execute_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("AppointmentReminders");
  }
};
