module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Appointments", "start_date", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    });

    await queryInterface.addColumn("Appointments", "end_date", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    });

    // have to fill the null ones

    await queryInterface.renameColumn("Appointments", "doctorId", "doctor_id");
    await queryInterface.renameColumn("Appointments", "patientId", "patient_id");
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Appointments", "start_date");
    await queryInterface.removeColumn("Appointments", "end_date");

    await queryInterface.renameColumn("Appointments", "doctor_id", "doctorId");
    await queryInterface.renameColumn("Appointments", "patient_id", "patientId");
  }
};
