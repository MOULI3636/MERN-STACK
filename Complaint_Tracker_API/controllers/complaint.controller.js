let complaints = [];
let complaintId = 1;

export const getAllComplaints = (req, res) => {
    res.json(complaints);
};

export const createComplaint = (req, res) => {
    const { title, description } = req.body;
    const newComplaint = {
        id: complaintId++,
        title,
        description,
        status: "open"
    };
    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
};

export const resolveComplaint = (req, res) => {
    const id = Number(req.params.id);
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
        complaint.status = "resolved";
        res.json(complaint);
    } else {
        res.status(404).json({ message: "Complaint not found" });
    }
};

export const deleteComplaint = (req, res) => {
    const id = Number(req.params.id);
    complaints = complaints.filter(c => c.id !== id);
    res.json({ message: "Complaint deleted" });
};
