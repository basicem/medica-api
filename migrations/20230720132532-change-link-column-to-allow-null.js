module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Appointments", "link", {
      type: Sequelize.DataTypes.STRING,
      allowNull: true, // Change to true to allow null
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Appointments", "link", {
      type: Sequelize.DataTypes.STRING,
      allowNull: false, // Change back to false to disallow null
    });
  }
};
