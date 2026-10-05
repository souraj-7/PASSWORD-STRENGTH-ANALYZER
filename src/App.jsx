import { useState } from 'react'
import PasswordInput from './components/PasswordInput'
import StrengthMeter from './components/StrengthMeter'
import ScoreGauge from './components/ScoreGauge'
import RequirementList from './components/RequirementList'
import Suggestions from './components/Suggestions'
import PasswordGenerator from './components/PasswordGenerator'
import {
  STRENGTH_LEVELS,
  getRequirements,
  getScore,
  getSecurityScore,
  getScoreLabel,
  getFeedback,
} from './utils/passwordStrength'
import './App.css'

function App() {
  // The password lives only in this component state, in memory, in the browser.
  // It is never logged, sent to an API or saved in localStorage.
  const [password, setPassword] = useState('')

  // All values below are derived on every render, so the analysis is real time.
  const requirements = getRequirements(password)
  const score = getScore(requirements)
  const securityScore = getSecurityScore(password, requirements)
  const strengthLabel = STRENGTH_LEVELS[Math.max(score - 1, 0)]
  const scoreLabel = getScoreLabel(securityScore)
  const { problems, positives } = getFeedback(password, requirements)
  const hasPassword = password.length > 0

  return (
    <main className="app">
      {/* Decorative background glows, purely visual. */}
      <div className="app__glow app__glow--one" aria-hidden="true"></div>
      <div className="app__glow app__glow--two" aria-hidden="true"></div>

      <div className="card">
        <header className="card__header">
          <span className="card__badge">
            <span className="card__badge-dot" aria-hidden="true"></span>
            Client-side security tool
          </span>
          <h1 className="card__title">Password Strength Analyzer</h1>
          <p className="card__subtitle">
            Analyze, explain and generate strong passwords. Everything runs
            locally in your browser and is never sent anywhere.
          </p>
        </header>

        {/* Analyzer section */}
        <section className="card__section">
          <PasswordInput
            password={password}
            onChange={setPassword}
            onClear={() => setPassword('')}
          />

          <div className="score-row">
            <ScoreGauge score={securityScore} label={scoreLabel} />
            <StrengthMeter
              label={strengthLabel}
              score={score}
              maxScore={STRENGTH_LEVELS.length}
            />
          </div>

          <RequirementList requirements={requirements} />
        </section>

        <Suggestions
          problems={problems}
          positives={positives}
          hasPassword={hasPassword}
        />

        {/* Generator section, kept separate from the analyzer. */}
        <PasswordGenerator />
      </div>

      <footer className="app__footer">
        Privacy: passwords are analyzed in memory only — no API, no
        localStorage, no logging.
      </footer>
    </main>
  )
}

export default App
