/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participanti', {
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
    id_petrecere: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'petreceri',
        key: 'id'
      }
    }
  }, {
    tableName: 'participanti',
    timestamps: false
  });
};
