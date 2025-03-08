import { DataTypes } from 'sequelize';
import sqz from '../config/database';
import User from'./User';

const Case = sqz.define('Case', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Investigating', 'Solved', 'Closed'),
        defaultValue: 'Pending'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    officer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

User.hasMany(Case, { foreignKey: 'user_id' });
Case.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Case, { foreignKey: 'officer_id' });
Case.belongsTo(User, { foreignKey: 'officer_id' });

export default Case;
