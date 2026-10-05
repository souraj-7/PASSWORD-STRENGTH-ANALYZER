// Visual score bar with a colour and label that match the strength score.
function StrengthMeter({ label, score, maxScore }) {
  // Score 0 means nothing has been typed yet.
  const isEmpty = score === 0;
  const percentage = (score / maxScore) * 100;

  // Maps each score to a colour used by the bar.
  const barColors = ["#f43f5e", "#fb923c", "#facc15", "#22d3ee", "#34d399"];
  const color = isEmpty ? "#64748b" : barColors[score - 1];

  return (
    <div className="strength-meter">
      <div className="strength-meter__header">
        <span className="strength-meter__title">Strength level</span>
        <span className="strength-meter__label" style={{ color }}>
          {isEmpty ? "No password" : label}
        </span>
      </div>

      <div
        className="strength-meter__track"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label="Password strength"
      >
        <div
          className="strength-meter__fill"
          style={{ width: `${percentage}%`, background: color }}
        ></div>
      </div>

      <p className="strength-meter__hint">
        {isEmpty
          ? "Start typing to see how strong your password is."
          : `Level ${score} of ${maxScore} checks passed`}
      </p>
    </div>
  );
}

export default StrengthMeter;
