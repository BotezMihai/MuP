/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('melodii', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    titlu: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    artist: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    an: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    album: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    durata: {
      type: "DOUBLE",
      allowNull: true
    },
    id_petrecere: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'melodii',
    timestamps: false
  });
};
