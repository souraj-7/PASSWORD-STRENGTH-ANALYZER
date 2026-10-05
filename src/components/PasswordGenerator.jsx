
import { useState } from "react";
import {
  generatePassword,
  getRequirements,
  getSecurityScore,
  getScoreLabel,
} from "../utils/passwordStrength";

// Options the user can tick before generating a password.
const OPTION_LABELS = [
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "numbers", label: "Numbers (0-9)" },
  { key: "special", label: "Special (!@#$)" },
];

// Strong password generator.
// Everything happens in the browser with the crypto API and the
// generated password is never sent anywhere or stored.
function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  const [generated, setGenerated] = useState("");
  const [showGenerated, setShowGenerated] = useState(true);
  const [copied, setCopied] = useState(false);

  // Ticks or unticks one character type.
  const toggleOption = (key) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  // Creates a new password locally and resets the copy message.
  const handleGenerate = () => {
    const password = generatePassword({ length, ...options });
    setGenerated(password);
    setShowGenerated(true);
    setCopied(false);
  };

  // Copies the password to the clipboard. The password never leaves
  // the browser: only the clipboard on this device receives it.
  const handleCopy = async () => {
    if (!generated) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // Score of the generated password, calculated with the same logic
  // used by the analyzer above.
  const generatedScore = generated
    ? getSecurityScore(generated, getRequirements(generated))
    : 0;

  return (
    <section className="panel panel--generator">
      <h2 className="panel__title">
        <span className="panel__title-icon" aria-hidden="true">
          ⚡
        </span>
        Generate Strong Password
      </h2>

      <div className="generator__length">
        <div className="generator__length-header">
          <label className="generator__length-label" htmlFor="length">
            Password length
          </label>
          <span className="generator__length-value">{length}</span>
        </div>
        <input
          id="length"
          className="generator__slider"
          type="range"
          min="8"
          max="40"
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
        />
      </div>

      <div className="generator__options">
        {OPTION_LABELS.map((option) => (
          <label key={option.key} className="generator__option">
            <input
              type="checkbox"
              checked={options[option.key]}
              onChange={() => toggleOption(option.key)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        className="button button--primary button--full"
        onClick={handleGenerate}
      >
        Generate Password
      </button>

      {generated ? (
        <div className="generator__result">
          <div className="generator__output-row">
            <output className="generator__output">
              {showGenerated ? generated : "•".repeat(generated.length)}
            </output>
          </div>

          <div className="generator__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setShowGenerated((visible) => !visible)}
            >
              {showGenerated ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="generator__score">
            Score: <strong>{generatedScore} / 100 — </strong>
            {getScoreLabel(generatedScore)}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default PasswordGenerator;
