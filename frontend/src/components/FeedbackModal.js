import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimesCircle, FaPaperPlane, FaUserEdit, FaFileAlt } from 'react-icons/fa';
import './FeedbackModal.css';
import API from './api';

function FeedbackModal({ isOpen, onClose, milestone, projectId }) {
    const [instructorFeedback, setInstructorFeedback] = useState("");
    const [aiFeedback, setAiFeedback] = useState("");
    const [submission, setSubmission] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(true);
    const [teamId, setTeamId] = useState(null);

    useEffect(() => {
        console.log("Waiting for milestone and projectId to be available...");
        console.log("Milestone:", milestone);
        console.log("Project ID:", projectId);

        const fetchTeamId = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("No token found. Please log in again.");
                return;
            }

        };
        
        if (milestone && projectId) {
            setLoadingSubmission(true);
            console.log(`Fetching submission for milestone: ${milestone.id} with projectId: ${projectId}`);

            fetchTeamId();

            API.get(`/instructor/projects/${projectId}/milestones/${milestone.id}/submission`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then((response) => {
                    console.log("Submission response:", response.data);
                    setSubmission(response.data.submission);
                    setLoadingSubmission(false);
                })
                .catch((err) => {
                    console.error("Error fetching submission:", err);
                    setSubmission(null);
                    setLoadingSubmission(false);
                });
        } else {
            console.log("Milestone or Project ID missing in useEffect.");
        }
    }, [milestone, projectId]);

    const handleInstructorFeedbackSubmit = async () => {
        console.log("Submitting instructor feedback:", instructorFeedback);
        if (instructorFeedback.trim() === "") {
            alert("Please provide feedback before submitting.");
            return;
        }

        try {
            const response = await API.post(
                `/instructor/projects/${projectId}/milestones/${milestone.id}/feedback`,
                { feedback: instructorFeedback },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log("Instructor feedback submitted successfully:", response.data);
            alert("Instructor feedback has been submitted successfully!");
            setInstructorFeedback("");
            onClose();
        } catch (error) {
            console.error("Error submitting instructor feedback", error);
            alert("There was an error submitting feedback.");
        }
    };

    const handleAIFeedbackSubmit = async () => {
        console.log("Generating AI feedback...");
        try {
            const response = await API.get(
                `/instructor/projects/${projectId}/milestones/${milestone.id}/ai-feedback`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log("AI Feedback:", response.data.feedback);
            setAiFeedback(response.data.feedback);
            alert("AI feedback generated successfully!");
        } catch (error) {
            console.error("Error generating AI feedback:", error);
            alert("An error occurred while generating AI feedback.");
        }
    };

    const openDocument = async () => {
        const fileUrl = submission?.fileUrl;
    
        if (!fileUrl) {
            alert("No document available to view.");
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("No token found. Please log in again.");
                return;
            }
    
            const response = await fetch(fileUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, '_blank');
            } else {
                alert("Failed to fetch the document.");
            }
        } catch (error) {
            console.error("Error opening the document:", error);
            alert("An error occurred while opening the document.");
        }
    };
    
    

    if (!isOpen || !milestone) {
        console.log("Modal not open or milestone missing");
        return null;
    }

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal-content animated">
                <button className="modal-close-button" onClick={onClose}>
                    <FaTimesCircle />
                </button>
                <h2>Feedback for {milestone.title}</h2>

                <div className="submission-section">
                    <h3>Submitted Document</h3>
                    {loadingSubmission ? (
                        <p>Loading submission...</p>
                    ) : submission ? (
                        <div className="submitted-document">
                            <p><strong>Comments:</strong> {submission.content}</p>
                            <button className="view-document-button" onClick={openDocument}>
                                <FaFileAlt /> View Submitted Document
                            </button>
                        </div>
                    ) : (
                        <p>No submission available for this milestone.</p>
                    )}
                </div>

                <div className="feedback-section">
                    <h3><FaUserEdit /> Instructor Feedback</h3>
                    <textarea
                        className="feedback-input"
                        placeholder="Enter instructor feedback here..."
                        value={instructorFeedback}
                        onChange={(e) => setInstructorFeedback(e.target.value)}
                    />
                    <button className="submit-feedback-button" onClick={handleInstructorFeedbackSubmit}>
                        <FaPaperPlane /> Submit Feedback
                    </button>
                </div>

                <hr className="section-divider" />

                <div className="feedback-section">
                    <h3><FaRobot /> AI Suggestions</h3>
                    <button className="ai-feedback-button" onClick={handleAIFeedbackSubmit}>
                        Generate AI Feedback
                    </button>
                    {aiFeedback && <p className="feedback-content ai-feedback">{aiFeedback}</p>}
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;
