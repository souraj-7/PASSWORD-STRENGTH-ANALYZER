// One single requirement row: check mark when met, cross when not met.
function RequirementItem({ label, met }) {
  return (
    <li className={met ? "requirement requirement--met" : "requirement"}>
      <span className="requirement__icon" aria-hidden="true">
        {met ? "✓" : "✕"}
      </span>
      <span className="requirement__label">{label}</span>
      <span className="requirement__status">{met ? "Passed" : "Missing"}</span>
    </li>
  );
}

export default RequirementItem;
