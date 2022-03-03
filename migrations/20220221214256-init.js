module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("doctor", {
      id: {
        allowNull: false,

        autoIncrement: true,

        primaryKey: true,

        type: Sequelize.INTEGER,
      },

      image: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      address: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      city: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      zip: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      country: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      phone_number: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      website: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,

        allowNull: false,

        unique: true,
      },

      created_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("practice_area", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      created_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("doctor_practice_area", {
      id: {
        allowNull: false,

        autoIncrement: true,

        primaryKey: true,

        type: Sequelize.INTEGER,
      },

      doctor_id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
          model: "doctor",
          key: "id",
        },
      },

      practice_area_id: {
        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
          model: "practice_area",
          key: "id",
        },
      },

      created_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("working_hours", {
      id: {
        allowNull: false,

        autoIncrement: true,

        primaryKey: true,

        type: Sequelize.INTEGER,
      },

      day: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      work_time_start: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      work_time_end: {
        type: Sequelize.STRING,

        allowNull: false,
      },

      doctor_id: {
        type: Sequelize.INTEGER,

        references: {
          model: "doctor",
          key: "id",
        },
      },

      created_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,

        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  },
};
