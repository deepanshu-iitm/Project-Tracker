import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaGithub, FaCodeBranch } from 'react-icons/fa';
import MilestoneSubmissionModal from './MilestoneSubmissionModal';
import TeamCreationModal from './TeamCreationModal';
import './StudentDashboard.css';
import API from './api';

function StudentDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [studentName, setStudentName] = useState("");
    const [teamName, setTeamName] = useState("");
    const [teamId, setTeamId] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [githubRepo, setGithubRepo] = useState("");
    const [githubActivity, setGithubActivity] = useState([]);
    const [projectId, setProjectId] = useState(null);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

    useEffect(() => {
        API.get('/student/dashboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then((response) => {
                const { student, team, milestones, githubRepo, githubActivity } = response.data;
                setStudentName(student.name);
                setTeamName(team ? team.name : "");
                setTeamId(team ? team.id : null);
                setMilestones(milestones);
                setGithubRepo(githubRepo);
                setGithubActivity(githubActivity);
                setProjectId(projectId);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const openModal = (id) => {
        setIsModalOpen(true);
        setSelectedMilestoneId(id); 
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMilestoneId(null); 
    };

    const openTeamModal = () => setIsTeamModalOpen(true);
    const closeTeamModal = () => setIsTeamModalOpen(false);

    const handleTeamCreated = () => {
        API.get('/student/dashboard')  
            .then((response) => {
                const { team } = response.data;
                setTeamName(team ? team.name : "");
                setTeamId(team ? team.id : null);
            })
            .catch((error) => console.error('Error fetching updated data:', error));
    };

    const currentDate = new Date();

    return (
        <div className="student-dashboard">
            <header className="student-dashboard-header">
                <h1>Welcome, <span>{studentName}</span></h1>
                {teamName ? (
                    <p>Team: {teamName}</p>
                ) : (
                    <div className="no-team-message">
                        <p>You are not in any team yet. Please create a team.</p>
                        <button className="create-team-button" onClick={openTeamModal}>
                            Create Team
                        </button>
                    </div>
                )}
            </header>

            {teamName && (
                <>
                    <section className="student-dashboard-project">
                        <h2>Project Overview</h2>
                        <p>Your project is active. Complete and submit each milestone to contribute to your final assessment.</p>
                        <a href={githubRepo} target="_blank" rel="noopener noreferrer" className="github-link">
                            <FaGithub />&nbsp; GitHub Repository
                        </a>
                    </section>

                    <section className="student-dashboard-milestones">
                        <h2>Milestones</h2>
                        <div className="milestone-grid">
                            {milestones.map((milestone) => {
                                const isPastDue = new Date(milestone.dueDate) < currentDate && milestone.status !== "Completed";
                                return (
                                    <div key={milestone.id} className={`milestone-card ${milestone.status.toLowerCase().replace(" ", "-")}`}>
                                        <h3>{milestone.title}</h3>
                                        <span className={`status-tag ${milestone.status.toLowerCase().replace(" ", "-")}`}>{milestone.status}</span>
                                        <p className="due-date"><FaCalendarAlt />&nbsp; Due: {milestone.dueDate}</p>
                                        {milestone.status === "Completed" ? (
                                            <div className="feedback-section">
                                                {milestone.instructorFeedback && (
                                <p><strong>Instructor Feedback:</strong> {milestone.instructorFeedback}</p>
                            )}
                            {milestone.aiFeedback && (
                                <p><strong>AI Feedback:</strong> {milestone.aiFeedback}</p>
                            )}
                                            </div>
                                        ) : (
                                            !isPastDue && (
                                                <button 
    onClick={() => openModal(milestone.id)} 
    className="submit-button"
>
    Submit Milestone
</button>
                                            )
                                        )}
                                        {isPastDue && <p className="due-warning">Past Due</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="student-dashboard-activity">
                        <h2>GitHub Activity</h2>
                        <ul className="github-activity-list">
                            {githubActivity.map((activity, index) => (
                                <li key={index} className="activity-item">
                                    <div className="activity-details">
                                        <FaCodeBranch className="activity-icon" />
                                        <div>
                                            <p className="activity-description"><strong>{activity.type}:</strong> {activity.description}</p>
                                            <p className="activity-branch">Branch: {activity.branch || "N/A"}</p>
                                        </div>
                                    </div>
                                    <span className="activity-date">{activity.date}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}

            <MilestoneSubmissionModal isOpen={isModalOpen} onClose={closeModal} milestoneId={selectedMilestoneId} teamId={teamId} />
            <TeamCreationModal isOpen={isTeamModalOpen} onClose={closeTeamModal} onTeamCreated={handleTeamCreated} projectId={projectId} />
        </div>
    );
}

export default StudentDashboard;
