import React from 'react';
import { FaChalkboardTeacher, FaGithub, FaRobot, FaChartLine, FaClipboardList } from 'react-icons/fa';
import './HomePage.css';

const teamMembers = [
  {
    name: 'Abijeet',
    email: '21f1003267@ds.study.iitm.ac.in',
    photo: '/images/blank.jpg'
  },
  {
    name: 'Aditya',
    email: '22f1000873@ds.study.iitm.ac.in',
    photo: '/images/blank.jpg'
  },
  {
    name: 'Deepanshu',
    email: '21f3001217@ds.study.iitm.ac.in',
    photo: '/images/deepanshu.jpeg'
  },
  {
    name: 'Himanshu',
    email: '21f3001746@ds.study.iitm.ac.in',
    photo: '/images/blank.jpg'
  },
  {
    name: 'Prachi',
    email: '21f2001019@ds.study.iitm.ac.in',
    photo: '/images/blank.jpg'
  },
  {
    name: 'Saarthak',
    email: '21f3001154@ds.study.iitm.ac.in',
    photo: '/images/blank.jpg'
  }
];

const HomePage = () => {
  
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to ProjectTracker</h1>
          <p>Empowering instructors to effectively manage and monitor student progress in software projects.</p>
          <a href="/signup-login"><button className="cta-button">Get Started</button></a>
        </div>
      </header>

      <div className="team" id="team">
        <h2>Meet Our Team</h2>
        <div className="team-carousel">
          <div className="team-carousel-wrapper">
            {teamMembers.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.photo} alt={`${member.name}`} className="team-photo" />
                <h3>{member.name}</h3>
                <p>{member.email}</p>
              </div>
            ))}
            {teamMembers.map((member, index) => (
              <div className="team-member" key={`duplicate-${index}`}>
                <img src={member.photo} alt={`${member.name}`} className="team-photo" />
                <h3>{member.name}</h3>
                <p>{member.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <main>
        <section className="about" id="about">
          <div className="about-content">
            <div className="about-text">
              <h2>About ProjectTracker</h2>
              <p>
                ProjectTracker is a comprehensive web application designed to simplify project management for software development courses. 
                It enables instructors to easily define project milestones, track student progress via GitHub, and use AI to provide real-time feedback 
                on submitted documents. With ProjectTracker, managing large classes and promoting student success is easier than ever.
              </p>
              <p>
                This tool empowers educators to focus on mentoring, while the system takes care of tracking and analysis. 
                Streamline the process of project-based learning and ensure timely interventions when students need them most.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/project-tracking.png" alt="Project Tracking Illustration" />
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <h2>Transforming Project Management in Education</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <FaChalkboardTeacher className="feature-icon" />
              <h3>Intelligent Milestone Tracking</h3>
              <p>Create, assign, and monitor project milestones with ease. Our smart tracking system adapts to your teaching style.</p>
            </div>
            <div className="feature-item">
              <FaGithub className="feature-icon" />
              <h3>Seamless GitHub Integration</h3>
              <p>Monitor coding progress through real-time GitHub commit history. Visualize student contributions effortlessly.</p>
            </div>
            <div className="feature-item">
              <FaRobot className="feature-icon" />
              <h3>AI-Powered Insights</h3>
              <p>Leverage cutting-edge AI to analyze student documentation, predict project outcomes, and provide timely feedback.</p>
            </div>
            <div className="feature-item">
              <FaChartLine className="feature-icon" />
              <h3>Comprehensive Analytics Dashboard</h3>
              <p>Gain a bird's-eye view of all projects and teams with our intuitive, data-rich dashboard.</p>
            </div>
            <div className="feature-item">
              <FaClipboardList className="feature-icon" />
              <h3>Automated Feedback Generation</h3>
              <p>Receive instant feedback on submitted documents, identifying areas for improvement and streamlining communication.</p>
            </div>
            <div className="feature-item">
              <FaChalkboardTeacher className="feature-icon" />
              <h3>Enhanced Communication</h3>
              <p>Foster effective communication between instructors and students through automated analysis and feedback systems.</p>
            </div>
          </div>
        </section>
        
        <section className="how-it-works" id="how-it-works">
          <h2>How It Works</h2>
          <div className="how-it-works-grid">
            <div className="step">
              <h3>1. Define Milestones</h3>
              <p>Instructors create project milestones with deadlines, assigning them to students or teams.</p>
            </div>
            <div className="step">
              <h3>2. Integrate with GitHub</h3>
              <p>The system pulls commit histories from GitHub repositories, tracking coding activity automatically.</p>
            </div>
            <div className="step">
              <h3>3. Submit Documents</h3>
              <p>Students upload project proposals and reports for AI-based analysis and feedback.</p>
            </div>
            <div className="step">
              <h3>4. Analyze Progress</h3>
              <p>Instructors view real-time analytics on project status, coding activity, and team performance.</p>
            </div>
            <div className="step">
              <h3>5. Receive Feedback</h3>
              <p>Automated feedback is generated based on coding contributions and submitted documents.</p>
            </div>
            <div className="step">
              <h3>6. Monitor & Adjust</h3>
              <p>Instructors monitor ongoing progress and make necessary adjustments to team dynamics or project timelines.</p>
            </div>
          </div>
        </section>
        
        <section className="testimonials" id="testimonials">
          <h2>What Educators Are Saying</h2>
          <div className="testimonial-grid">
            <div className="testimonial-item">
              <p>"ProjectTracker has revolutionized how I manage student projects. It's an indispensable tool for any CS educator....."</p>
              <cite>- person 1</cite>
            </div>
            <div className="testimonial-item">
              <p>"The AI-powered insights have helped me identify struggling students early, allowing for timely interventions...."</p>
              <cite>- person 2</cite>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
