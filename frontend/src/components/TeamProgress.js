import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaCalendarAlt, FaGithub, FaComments, FaUsers, FaCodeBranch } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';
import './TeamProgress.css';
import API from './api';

function TeamProgress() {
    const navigate = useNavigate();
    const { teamId } = useParams();  
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const [teamDetails, setTeamDetails] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [githubActivity, setGithubActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        API.get(`/teams/${teamId}/progress`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                const data = response.data;
                console.log("API Response:", data);  
    
                setTeamDetails({
                    teamName: data.teamName,
                    members: data.members,
                    githubRepo: data.githubRepo,
                    projectId: data.projectId, 
                });
                setMilestones(data.milestones);
                setGithubActivity(data.githubActivity);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching team progress:", error);
                setError("Failed to load team progress");
                setLoading(false);
            });
    }, [teamId]);
    
    

    const openFeedbackModal = (milestone) => {
        console.log("Opening Feedback Modal for milestone:", milestone);  
        console.log("Project ID in TeamProgress:", teamDetails?.projectId);  
    
        if (milestone && teamDetails?.projectId) {
            setSelectedMilestone(milestone);
            setIsFeedbackModalOpen(true);
        } else {
            console.error("Milestone or Project ID is missing!");
        }
    };

    const closeFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="team-progress-container">
            <header className="team-progress-header">
                <h1>{teamDetails.teamName} - Project Progress</h1>
                <a href={teamDetails.githubRepo} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FaGithub />&nbsp; GitHub Repository
                </a>
            </header>

            <section className="team-section">
                <h2><FaUsers /> Team Members</h2>
                <ul className="team-list">
                    {teamDetails.members.map((member, index) => (
                        <li key={index}>
                            <span className="team-member-name">{member.name}</span>
                            <span className="team-member-email">{member.email}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="milestone-section">
                <h2>Milestones</h2>
                <div className="milestone-grid">
                    {milestones.map((milestone) => (
                        <div key={milestone.id} className={`milestone-card ${milestone.status.toLowerCase().replace(" ", "-")}`}>
                            <h3>{milestone.title}</h3>
                            <div className="milestone-details">
                                {milestone.status === "Completed" ? (
                                    <span><FaCheckCircle className="completed-icon" /> {milestone.status}</span>
                                ) : milestone.status === "Not Submitted" ? (
                                    <span className="not-submitted"><FaExclamationCircle /> {milestone.status}</span>
                                ) : (
                                    <span className="in-progress"><FaExclamationCircle className="in-progress-icon" /> {milestone.status}</span>
                                )}
                                {milestone.status !== "Completed" && (
                                    <span><FaCalendarAlt className="due-icon" /> Due: {milestone.dueDate}</span>
                                )}
                            </div>
                            <button className="feedback-button" onClick={() => openFeedbackModal(milestone)}>
                                <FaComments /> Feedback
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="github-activity-section">
                <h2>Recent GitHub Activity</h2>
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

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={closeFeedbackModal}
                milestone={selectedMilestone}
                projectId={teamDetails?.projectId}
            />
        </div>
    );
}

export default TeamProgress;
