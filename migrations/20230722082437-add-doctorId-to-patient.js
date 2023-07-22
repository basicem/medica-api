module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Patients", "doctor_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    const rawQuery = `
    UPDATE "Patients"
    SET "doctor_id" = (
      SELECT "id" 
      FROM "Users" 
      ORDER BY RANDOM()
      LIMIT 1
    )
    WHERE "doctor_id" IS NULL;
  `;

    queryInterface.sequelize.query(rawQuery);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Patients", "doctor_id");
  }
};
