import React, { useState } from 'react';
import { FaUpload, FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './MilestoneSubmissionModal.css';
import API from './api';

function MilestoneSubmissionModal({ isOpen, onClose, milestoneId, teamId }) {
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleCommentChange = (e) => setComments(e.target.value);

    const handleSubmit = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }
        if (!teamId) {
            alert("Team ID is missing.");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to submit a milestone.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("comments", comments);
        formData.append("milestoneId", milestoneId);
        formData.append("teamId", teamId);  

        try {
            setIsSubmitting(true);
            const response = await API.post("/milestone/submit", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",  
                }
            });

            alert("Milestone submitted successfully!");
            onClose();
        } catch (error) {
            console.error("Error submitting milestone:", error);
            alert("Error submitting milestone. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-modal-button" onClick={onClose}><FaTimes /></button>
                    <h2 className="modal-title">Milestone Submission</h2>
                    <p className="modal-subtitle">Submit your milestone file and add any notes for the instructor.</p>
                    <div className="modal-body">
                        <div className="file-upload-section">
                            <label htmlFor="file-upload" className="upload-button">
                                <FaUpload />&nbsp; Select File
                            </label>
                            <input id="file-upload" type="file" onChange={handleFileChange} hidden />
                            {file && <span className="file-name">{file.name}</span>}
                        </div>
                        <textarea
                            placeholder="Add comments or notes..."
                            value={comments}
                            onChange={handleCommentChange}
                            className="comment-box"
                        ></textarea>
                        <button
                            onClick={handleSubmit}
                            className="submit-modal-button"
                            disabled={isSubmitting}
                        >
                            <FaPaperPlane />&nbsp; Submit Milestone
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

export default MilestoneSubmissionModal;
