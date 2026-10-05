import { useState } from "react";

// Password field with Show/Hide and Clear buttons.
function PasswordInput({ password, onChange, onClear }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input">
      <label className="password-input__label" htmlFor="password">
        <span className="password-input__label-icon" aria-hidden="true">
          🔒
        </span>
        Enter a password
      </label>

      <div className="password-input__row">
        <input
          id="password"
          className="password-input__field"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Type your password..."
          autoComplete="off"
          spellCheck="false"
          onChange={(event) => onChange(event.target.value)}
        />

        {/* Toggles between showing and hiding the typed password. */}
        <button
          type="button"
          className="button button--ghost"
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button
        type="button"
        className="button button--clear"
        onClick={() => {
          onClear();
          // Also hide the password again after clearing.
          setShowPassword(false);
        }}
        disabled={password.length === 0}
      >
        Clear
      </button>
    </div>
  );
}

export default PasswordInput;
