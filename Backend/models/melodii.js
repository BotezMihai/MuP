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
      
    },
    artist: {
      type: DataTypes.STRING(100),
     
    },
    an: {
      type: DataTypes.STRING(100),
      
    },
    durata: {
      type: DataTypes.INTEGER(11),
     
    },
    album: {
      type: DataTypes.STRING(100),
      
    },
    path: {
      type: DataTypes.STRING(100),
     
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
