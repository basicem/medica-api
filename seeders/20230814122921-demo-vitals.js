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

    const vitalsToInsert = [{
      name: "Weight",
      unit_measurement: "kg",
      lower_limit: 30,
      upper_limit: 120,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Heart Rate",
      unit_measurement: "bpm",
      lower_limit: 60,
      upper_limit: 100,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Temperature",
      unit_measurement: "Celsius",
      lower_limit: 36,
      upper_limit: 38,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Systolic  Blood Pressure",
      unit_measurement: "mmHg",
      lower_limit: 90,
      upper_limit: 130,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: "Diastolic Blood Pressure",
      unit_measurement: "mmHg",
      lower_limit: 70,
      upper_limit: 90,
      created_at: new Date(),
      updated_at: new Date(),
    }];

    try {
      for (const item of vitalsToInsert) {
        const existingRecord = await queryInterface.rawSelect("Vitals", {
          where: { name: item.name },
        }, ["id"]);

        if (!existingRecord) {
          await queryInterface.bulkInsert("Vitals", [item], {});
        }
      }
    } catch (error) {
    }
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
