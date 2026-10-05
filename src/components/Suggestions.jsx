import { SCORE_DISCLAIMER } from "../utils/passwordStrength";

// Explains exactly why a password is weak (or strong).
// Problems are the unmet requirements, positives are the met ones.
function Suggestions({ problems, positives, hasPassword }) {
  // Nothing typed yet: show a friendly starting hint.
  if (!hasPassword) {
    return (
      <section className="panel panel--explanation">
        <h2 className="panel__title">
          <span className="panel__title-icon" aria-hidden="true">
            🔍
          </span>
          Analysis
        </h2>
        <p className="explanation__empty">
          Type a password above to see a detailed explanation of its
          strengths and weaknesses.
        </p>
      </section>
    );
  }

  return (
    <section className="panel panel--explanation">
      <h2 className="panel__title">
        <span className="panel__title-icon" aria-hidden="true">
          🔍
        </span>
        Why this score?
      </h2>

      {problems.length > 0 ? (
        <div className="explanation__group">
          <h3 className="explanation__heading explanation__heading--problem">
            Weaknesses to fix
          </h3>
          <ul className="explanation__list">
            {problems.map((problem) => (
              <li key={problem} className="explanation__item explanation__item--problem">
                <span className="explanation__icon" aria-hidden="true">
                  ✕
                </span>
                {problem}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="explanation__group">
          <p className="explanation__success">
            ✓ Excellent! This password meets all the checks below.
          </p>
        </div>
      )}

      {positives.length > 0 ? (
        <div className="explanation__group">
          <h3 className="explanation__heading explanation__heading--positive">
            What is already good
          </h3>
          <ul className="explanation__list">
            {positives.map((positive) => (
              <li key={positive} className="explanation__item explanation__item--positive">
                <span className="explanation__icon" aria-hidden="true">
                  ✓
                </span>
                {positive}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="explanation__disclaimer">{SCORE_DISCLAIMER}</p>
    </section>
  );
}

export default Suggestions;
