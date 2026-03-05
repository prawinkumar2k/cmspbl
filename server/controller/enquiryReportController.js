import Enquiry from '../models/Enquiry.js';

export const getEnquiryReportData = async (req, res) => {
    try {
        const rows = await Enquiry.find().sort({ createdAt: -1 });
        res.json(rows);
    } catch (error) {
        console.error('Error fetching enquiry report data:', error);
        res.status(500).json({ error: 'Failed to fetch enquiry report data' });
    }
};
