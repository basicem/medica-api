const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  User.init(
    {

      id: {
        field: "id",
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      firstName: {
        field: "first_name",
        type: DataTypes.STRING,
      },

      lastName: {
        field: "last_name",
        type: DataTypes.STRING,
      },

      email: {
        field: "email",
        type: DataTypes.STRING,
      },

      role: {
        field: "role",
        type: DataTypes.ENUM,
        values: ["Admin", "Doctor"]
      },

      password: {
        field: "password",
        type: DataTypes.STRING,
      },

      isVerified: {
        field: "is_verified",
        type: DataTypes.BOOLEAN,
      },

      isActive: {
        field: "is_active",
        type: DataTypes.BOOLEAN,
      },

      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
      },

      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,

      modelName: "User",

      // instanceMethods: {
      //   validPassword: (password) => bcrypt.compareSync(password, this.password)
      // }

    }
  );
  // User.prototype.validPassword = async (password, hash) => {
  //   const result = await bcrypt.compareSync(password, hash);
  //   return result;
  // };

  return User;
};
