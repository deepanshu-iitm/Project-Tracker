import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProject.css';
import { FaPlus, FaTrash } from 'react-icons/fa';
import API from './api';

function CreateProject() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [milestones, setMilestones] = useState([{ title: '', description: '', dueDate: '' }]);

    const handleAddMilestone = () => {
        setMilestones([...milestones, { title: '', description: '', dueDate: '' }]);
    };

    const handleMilestoneChange = (index, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[index][field] = value;
        setMilestones(newMilestones);
    };

    const handleRemoveMilestone = (index) => {
        const newMilestones = milestones.filter((_, i) => i !== index);
        setMilestones(newMilestones);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            
            const response = await API.post('/instructor/projects', { title, description });
            const projectId = response.data.project_id;
    
            
            for (const milestone of milestones) {
                await API.post(`/instructor/projects/${projectId}/milestones`, {
                    title: milestone.title,
                    description: milestone.description,
                    due_date: milestone.dueDate,
                });
            }
    
            alert('Project and milestones created successfully!');
            navigate('/instructor-dashboard');
        } catch (error) {
            console.error('Error creating project:', error.response.data);
            alert('Failed to create project. Please try again.');
        }
    };

    return (
        <div className="create-project-container">
            <h1>Create New Project</h1>
            <form onSubmit={handleSubmit} className="create-project-form">
                <div className="form-group">
                    <label>Project Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the project"
                        required
                    />
                </div>

                <div className="form-group milestones-section">
                    <label>Milestones</label>
                    {milestones.map((milestone, index) => (
                        <div key={index} className="milestone-card">
                            <div className="milestone-header">
                                <h4>Milestone {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMilestone(index)}
                                    className="remove-milestone-button"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Milestone Title"
                                value={milestone.title}
                                onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Milestone Description"
                                value={milestone.description}
                                onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                required
                            />
                            <input
                                type="date"
                                value={milestone.dueDate}
                                onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddMilestone} className="add-milestone-button">
                        <FaPlus /> Add Milestone
                    </button>
                </div>

                <button type="submit" className="submit-button">Create Project</button>
            </form>
        </div>
    );
}

export default CreateProject;
