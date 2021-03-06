/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dansatori', {
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
    durata: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    id_playing: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
  }, {
    tableName: 'dansatori',
    timestamps: false
  });
};
