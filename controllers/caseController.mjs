import Case from '../models/Case.mjs';
import User from '../models/User.mjs';
import { sendNotification } from './notificationController.mjs';

export const createCase = async ( req, res) => {
    try {
        const { title, description, user_id } = req.body;
        let media_url = req.file ? `${process.env.BASE_URL}/${req.file.path}`: null;
        
        const newCase = await Case.create({
            title,
            description,
            user_id,
            media_url
        });

        res.status(201).json({ message: 'Case reported successflly', case: newCase });
    }catch(e) {
        res.status(500).json({ error: e.message });
    }
};

export const getCases = async (req, res) => {
    try{
        const cases = await Case.findAll({
            include: [{
                model: User,
                attributes: ['name', 'phone', 'email'],
            }]
        });

        res.status(200).json({ cases });
    }catch(e){
        res.status(500).json({ error: e.message });
    }
};

export const getCaseById = async (req, res) => {
    try {
        const caseDetail = await Case.findByPk(req.params.id);
        if(!caseDetail) return res.status(404).json({ message: 'Case not found' });
        res.status(200).json({ case: caseDetail });
    } catch(e){
        res.status(500).json({ error: e.message });
    }
};

export const assignCase = async (req, res) => {
    try {
        const caseToUpdate = await Case.findByPk(req.params.id);
        if(!caseToUpdate) return res.status(404).json({ message: 'Case not Found' });

        const { officer_id } = req.body;
        caseToUpdate.officer_id = officer_id;
        caseToUpdate.status = 'Investigating';
        await caseToUpdate.save();

        const user = await User.findByPk(req.params.user_id);
        if(user) {
            await sendNotification({
                email: user.email,
                phone: user.phone,
                subject: 'Case Assigned',
                message: `Your case with title ${caseToUpdate.title} has been assigned to an officer(s).`
            });
        }

        res.status(200).json({ message: 'Case Assigned Successfully', case: caseToUpdate });

    } catch(e){
        res.status(500).json({ error: e.message });
    }
};

export const updateCaseStatus = async (req, res) => {
    try {
        const caseStatusUpdate  = await Case.findByPk(req.params.id);
        if(!caseStatusUpdate) return res.status(404).json({ message: 'Case not found' });

        const { status } = req.body;
        caseStatusUpdate.status = status;
        await caseStatusUpdate.save();

        const user = await User.findByPk(caseStatusUpdate.user_id);
        if (user) {
            await sendNotification({
                email: user.email,
                phone: user.phone,
                subject: 'Case Status Update',
                message: `Your case with title ${caseStatusUpdate.title} has been updated to ${status}.`
            });
        }
        res.status(200).json({ message: 'Case status updated successfully', case: caseStatusUpdate });
    } catch (e) {
        res.status(500).json({ error: e.message });
    } 
};