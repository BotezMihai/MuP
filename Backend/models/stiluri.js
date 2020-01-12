/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('stiluri', {
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
    stil: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_petrecere: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }

  }, {
    tableName: 'stiluri',
    timestamps: false
  });
};
