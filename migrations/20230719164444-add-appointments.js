module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Appointments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      is_virtual: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      link: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      is_confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
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
  }
};
