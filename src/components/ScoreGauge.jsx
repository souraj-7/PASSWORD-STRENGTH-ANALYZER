// Circular 0-100 security score indicator.
// It is drawn with plain SVG using a stroke-dasharray trick, so no
// extra library is needed and it stays easy to explain.
function ScoreGauge({ score, label }) {
  // Geometry of the circle.
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // Clamp the score between 0 and 100 before using it.
  const safeScore = Math.min(Math.max(score, 0), 100);

  // The visible part of the circle, from 0 to the full circumference.
  const dashOffset = circumference - (safeScore / 100) * circumference;

  // Colour palette used for the ring, matching the strength levels.
  const getColor = () => {
    if (safeScore === 0) return "#64748b";
    if (safeScore < 25) return "#f43f5e";
    if (safeScore < 45) return "#fb923c";
    if (safeScore < 65) return "#facc15";
    if (safeScore < 85) return "#22d3ee";
    return "#34d399";
  };

  const color = getColor();
  const isEmpty = safeScore === 0;

  return (
    <div className="score-gauge">
      <svg
        className="score-gauge__svg"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Security score ${safeScore} out of 100`}
      >
        {/* Background ring */}
        <circle
          className="score-gauge__track"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
        />

        {/* Progress ring */}
        <circle
          className="score-gauge__progress"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="score-gauge__center">
        <span className="score-gauge__value" style={{ color }}>
          {safeScore}
        </span>
        <span className="score-gauge__total">/ 100</span>
      </div>

      <span className="score-gauge__label" style={{ color }}>
        {isEmpty ? "No password" : label}
      </span>
    </div>
  );
}

export default ScoreGauge;
