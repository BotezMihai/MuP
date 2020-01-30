/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('youtube', {
    id_video: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_petrecere: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'youtube',
    timestamps: false
  });
};
