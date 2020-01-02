/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tag', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_melodie: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'melodii',
        key: 'id'
      }
    },
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'tag',
    timestamps: false
  });
};
