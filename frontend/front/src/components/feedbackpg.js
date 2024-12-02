import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/feedback", {
        feedback,
      });
      setSuccessMessage("Feedback submitted successfully");
      setFeedback(""); // Clear feedback field after submission
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="feedback-container">
      <h2>Submit Your Feedback</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            placeholder="Write your feedback here..."
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
      <p>
        Want to go back? <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}

export default Feedback;
