import { Caller } from '../models/Caller.js';

export const getAllCallers = async (req, res) => {
	try {
		const callers = await Caller.find().sort({ staffName: 1 });
		res.json(callers);
	} catch (error) {
		console.error('Error fetching caller details:', error);
		res.status(500).json({ error: 'Failed to fetch caller details' });
	}
};
