import { DataTypes } from "sequelize";
import sqz from '../config/db.mjs';
import User from './User.mjs';

const Officer = sqz.define ('Officer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    badge_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

User.hasOne(Officer, { foreignKey: 'user_id' });
Officer.belongsTo(User, { foreignKey: 'user_id'});

export default Officer;