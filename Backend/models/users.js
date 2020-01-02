/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nume: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prenume: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    parola: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};
