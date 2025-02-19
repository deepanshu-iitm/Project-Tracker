import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamCreationModal.css';
import API from './api';

function TeamCreationModal({ isOpen, onClose }) {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [repoUrl, setRepoUrl] = useState(""); 
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    useEffect(() => {
        if (isOpen) {
            API.get('/teams/students')
            .then((response) => {
                setStudents(response.data.students);
                setProjects(response.data.projects);
            })
            .catch((error) => console.error("Error fetching data:", error));
        }
    }, [isOpen]);

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleRepoUrlChange = (e) => {
        setRepoUrl(e.target.value);  
    };

    const handleProjectSelection = (e) => setSelectedProject(e.target.value);

    const handleFinalizeTeam = () => {
        if (!repoUrl) {
            alert("Please provide a repository URL.");
            return;
        }

        API.post('/teams/create', { project_id: selectedProject, member_ids: selectedStudents, repository_url: repoUrl })
            .then(() => {
                alert("Team created successfully!");
                onClose();
            })
            .catch((error) => {
                console.error("Error creating team:", error);
                alert("There was an error creating the team.");
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="team-modal">
    <h2>Create Your Team</h2>

    <label htmlFor="projectSelect">Select Project</label>
    <select id="projectSelect" value={selectedProject} onChange={handleProjectSelection}>
        <option value="">-- Select a Project --</option>
        {projects.map((project) => (
            <option key={project.id} value={project.id}>
                {project.title}
            </option>
        ))}
    </select>

    <ul className="student-list">
        {students.map((student) => (
            <li key={student.id} className="student-item">
                <label>
                    <input
                        type="checkbox"
                        value={student.id}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                    />
                    {student.name} ({student.email})
                </label>
            </li>
        ))}
    </ul>

    <div className="repo-url-container">
        <label htmlFor="repoUrl">Repository URL</label>
        <input
            id="repoUrl"
            type="text"
            value={repoUrl}
            onChange={handleRepoUrlChange}
            placeholder="Enter GitHub repository URL"
        />
    </div>

    <div className="modal-actions">
        <button className="finalize-button" onClick={handleFinalizeTeam}>
            Finalize Team
        </button>
        <button className="cancel-button" onClick={onClose}>
            Cancel
        </button>
    </div>
</div>

        </div>
    );
}

export default TeamCreationModal;
