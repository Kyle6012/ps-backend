import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sqz from './config/db.mjs';
import User from'./models/User.mjs';
import Case from './models/Case.mjs';
import Officer from './models/Officer.mjs';
import authRoutes from './routes/authRoutes.mjs';
import caseRoutes from './routes/caseRoutes.mjs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test API Route
app.get('/', (req, res) => {
    res.send("Police System Backend is Running!");
});

app.use('/api/auth', authRoutes);
app.use('/api/case', caseRoutes);

sqz.sync({ alter: true }) 
    .then(() => console.log("Database synced successfully."))
    .catch(err => console.error("Error syncing database:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
