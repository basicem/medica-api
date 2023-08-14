module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("Vitals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      unit_measurement: {
        type: Sequelize.STRING,
        allowNull: false
      },

      lower_limit: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      upper_limit: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable(
      "PatientVitals",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },

        patient_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Patients",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        vital_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Vitals",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        value: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },

        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },

        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },

        is_archived: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },

        archived_at: {
          allowNull: false,
          type: Sequelize.DATE
        },

      },
    );

    await queryInterface.addConstraint("PatientVitals", {
      type: "unique",
      fields: ["patient_id", "vital_id"],
      name: "unique_patient_vital_constraint",
      where: {
        is_archived: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("PatientVitals", "unique_patient_vital_constraint");
    await queryInterface.dropTable("PatientVitals");
    await queryInterface.dropTable("Vitals");
  }
};
