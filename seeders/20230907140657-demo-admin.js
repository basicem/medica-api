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
    const adminUserExists = await queryInterface.rawSelect(
      "Users",
      {
        where: {
          email: "admin@medica.com",
        },
      },
      ["id"]
    );

    const doctorUserExists = await queryInterface.rawSelect(
      "Users",
      {
        where: {
          email: "doctor@medica.com",
        },
      },
      ["id"]
    );

    if (!adminUserExists) {
      await queryInterface.bulkInsert("Users", [
        {
          first_name: "Admin",
          last_name: "Admin",
          email: "admin@medica.com",
          role: "Admin",
          password: bcrypt.hashSync("testtest", salt),
          is_verified: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }

    if (!doctorUserExists) {
      await queryInterface.bulkInsert("Users", [
        {
          first_name: "Doctor",
          last_name: "Doctor",
          email: "doctor@medica.com",
          role: "Doctor",
          password: bcrypt.hashSync("testtest", salt),
          is_verified: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  }
};
