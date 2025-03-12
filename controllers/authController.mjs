import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import { Client } from '../utils/twilio.mjs';
import { transporter } from '../utils/mailer.mjs';

export const register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const hashedPassword = bcrypt(password, 10);

        const user = await User.create({
            name,
            email,
            phone_number: phone,
            password: hashedPassword,
            role
        });

        const otp = Math.floor(100000 + Math.random() * 900000);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        });

        await Client.message.create ({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phone
        });

        res.status(201).json({ message: 'User registered. OTP sent', otp });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};
export const login = async(req, res) => {
    try {
        const { phone, email, password } = req.body;
        const user = await User.findOne({ where: { phone_number: phone } });
        if (!user) return res.status(404).json({ message: 'user not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ userId: user.id, role: user.role}, process.env.JWT_SCERET, { expiresIn: '1d' });
        res.json({ message: 'Login successful', token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};