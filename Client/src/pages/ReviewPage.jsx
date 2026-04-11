import { useState } from "react";
import Navbar from "../components/Navbar";
import "../index.css";

function ReviewPage() {
  const [filmName, setFilmName] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    // sort later
  };

  return (
    <div className="reviewpage-container">
      <div className="review-card">
        <h1>Review a Film!</h1>
        <div className="review-title-line"></div>

        <div className="review-form">
          <label>Film Name:</label>
          <input
            type="text"
            value={filmName}
            onChange={(e) => setFilmName(e.target.value)}
          />

          <label>Your thoughts on this film:</label>
          <div className="review-textarea-box">
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
            />

            <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                    key={star}
                    className="star"
                    onClick={() => setRating(star)}
                    >
                    {star <= rating ? "★" : "☆"}
                    </span>
                ))}
            </div>
          </div>

          <button className="submit-review-btn" onClick={handleSubmit}>
            Submit Review
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default ReviewPage;