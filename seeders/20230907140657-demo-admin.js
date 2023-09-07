const bcrypt = require("bcrypt");

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
    const salt = await bcrypt.genSaltSync(10, "a");
    await queryInterface.bulkInsert("User", [{
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@medica.com",
      role: "Admin",
      password: bcrypt.hashSync("testtest", salt),
      isVerified: true,
      isActive: true
    },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
