import { DataTypes } from 'sequelize';
import sqz from '../config/db.mjs';

const User = sqz.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'officer', 'admin'),
        defaultValue: 'user'
    }
}, {
    timestamps: true
});

export default User;
