import React, { useState } from 'react';
import './EditProjectPopup.css';
import API from './api';

function EditProjectPopup({ project, onClose, onSave }) {
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);

    const handleSave = async () => {
        try {
            const response = await API.put(`/instructor/projects/${project.id}`, { title, description });
            if (response.status === 200) {
                alert("Project updated successfully.");
                onSave({ ...project, title, description });
                onClose();
            }
        } catch (error) {
            console.error("Error updating project:", error.response?.data || error.message);
            alert("Failed to update project.");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Project</h2>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />

                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />

                <div className="popup-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default EditProjectPopup;
