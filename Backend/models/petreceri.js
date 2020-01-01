/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('petreceri', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    latitudine: {
      type: "DOUBLE",
      allowNull: false
    },
    longitudine: {
      type: "DOUBLE",
      allowNull: false
    },
    nume: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'petreceri',
    timestamps: false
  });
};
