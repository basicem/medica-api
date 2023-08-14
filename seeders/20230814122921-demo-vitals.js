module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Vitals", [{
      name: "Weight",
      unit_measurement: "kg",
      lower_limit: 0,
      upper_limit: 700,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Heart Rate",
      unit_measurement: "bpm",
      lower_limit: 0,
      upper_limit: 200,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Temperature",
      unit_measurement: "Celsius",
      lower_limit: 30,
      upper_limit: 50,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Systolic  Blood Pressure",
      unit_measurement: "mmHg",
      lower_limit: 0,
      upper_limit: 300,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Diastolic Blood Pressure",
      unit_measurement: "mmHg",
      lower_limit: 0,
      upper_limit: 200,
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Vitals", null, {});
  }
};
