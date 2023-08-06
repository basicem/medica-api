module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Medications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      dose_value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      dose_measurement: {
        type: Sequelize.STRING,
        allowNull: false
      },

      frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },

      prescribed_on: {
        type: Sequelize.DATE,
        allowNull: false
      },

      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients",
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
    await queryInterface.dropTable("Medications");
  }
};
