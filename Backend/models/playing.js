/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playing', {
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
    start: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id_petrecere: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'playing',
    timestamps: false
  });
};
