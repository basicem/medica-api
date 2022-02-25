module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "practice_area",
      [
        {
          id: 1,
          name: "Urologist",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "Surgeon",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("practice_area", null, {});
  },
};
