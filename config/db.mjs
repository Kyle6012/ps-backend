import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.join(__dirname, '../.env') });

const sqz = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync(path.resolve("./config/ca.pem")),
        },
    },
    logging: false
});

(async () => {
    try {
        await sqz.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

export default sqz;
