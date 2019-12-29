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
    id_dansator: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'dansatori',
        key: 'id'
      }
    },
    start: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'playing'
  });
};
