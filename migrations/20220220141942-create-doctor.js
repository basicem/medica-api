module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctors", {
      id: {
        allowNull: false,

        autoIncrement: true,

        primaryKey: true,

        type: Sequelize.INTEGER,
      },

      image: {
        type: Sequelize.STRING,
      },

      title: {
        type: Sequelize.STRING,
      },

      firstName: {
        type: Sequelize.STRING,
      },

      lastName: {
        type: Sequelize.STRING,
      },

      practiceArea: {
        type: Sequelize.STRING,
      },

      adress: {
        type: Sequelize.STRING,
      },

      city: {
        type: Sequelize.STRING,
      },

      zip: {
        type: Sequelize.STRING,
      },

      country: {
        type: Sequelize.STRING,
      },

      phoneNumber: {
        type: Sequelize.STRING,
      },

      website: {
        type: Sequelize.STRING,
      },

      workingHours: {
        type: Sequelize.STRING,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
      },

      createdAt: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("doctors");
  },
};
