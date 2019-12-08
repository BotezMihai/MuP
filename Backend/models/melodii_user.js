/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('melodii_user', {
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
    titlu_melodie: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'melodii_user',
    timestamps: false
  });
};
