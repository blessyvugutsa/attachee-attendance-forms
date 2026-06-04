import express from 'express';
const router = express.Router();

// Mock database storage array until database connection is completed
const attendanceLogs = [];

// Route to handle checking in
router.post('/clock-in', (req, res) => {
    const { email, name } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const newLog = {
        id: attendanceLogs.length + 1,
        name: name || 'Attachee',
        email: email,
        date: new Date().toLocaleDateString(),
        timeIn: new Date().toLocaleTimeString(),
        timeOut: '-'
    };

    attendanceLogs.push(newLog);
    
    res.status(201).json({ 
        success: true, 
        message: `Successfully clocked in! Welcome, ${name || email}.`,
        log: newLog
    });
});
// Route to handle checking out
router.post('/clock-out', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    // Find the active log for this user
    const activeLog = attendanceLogs.find(log => log.email === email && log.timeOut === '-');

    if (!activeLog) {
        return res.status(404).json({ success: false, message: 'No active clock-in session found for this user.' });
    }

    // Update the record with the current time
    activeLog.timeOut = new Date().toLocaleTimeString();
    
    res.status(200).json({ 
        success: true, 
        message: 'Successfully clocked out! Have a great day!',
        log: activeLog
    });
});
export default router;