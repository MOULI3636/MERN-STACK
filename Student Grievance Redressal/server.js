import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (no database)
let complaints = [];
let nextId = 1;

// Generate unique complaint ID
function generateComplaintId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const seq = String(nextId).padStart(3, '0');
    nextId++;
    return `CT${year}${month}${day}${seq}`;
}

// API Routes

// GET all complaints
app.get('/api/complaints', (req, res) => {
    res.json(complaints);
});

// GET single complaint by ID
app.get('/api/complaints/:id', (req, res) => {
    const complaint = complaints.find(c => c.id === req.params.id);
    if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
});

// POST create new complaint
app.post('/api/complaints', (req, res) => {
    const {
        name,
        email,
        phone,
        hostelType,
        hostelRoom,
        subject,
        description
    } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newComplaint = {
        id: generateComplaintId(),
        name,
        email,
        phone,
        hostelType: hostelType || '',
        hostelRoom: hostelRoom || '',
        subject,
        description,
        status: 'pending', // default status
        date: new Date().toLocaleDateString('en-GB'),
        createdAt: new Date().toISOString()
    };

    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
});

// PUT update complaint status
app.put('/api/complaints/:id', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'open', 'resolved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const index = complaints.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Complaint not found' });
    }

    complaints[index].status = status;
    res.json(complaints[index]);
});

// DELETE complaint
app.delete('/api/complaints/:id', (req, res) => {
    const index = complaints.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Complaint not found' });
    }

    const deletedComplaint = complaints.splice(index, 1)[0];
    res.json({ message: 'Complaint deleted', complaint: deletedComplaint });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`User Portal: http://localhost:${PORT}`);
    console.log(`Admin Portal: http://localhost:${PORT}/admin`);
});
