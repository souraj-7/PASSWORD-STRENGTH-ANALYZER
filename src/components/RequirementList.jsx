import RequirementItem from "./RequirementItem";

// Renders the full checklist of password requirements.
function RequirementList({ requirements }) {
  return (
    <section className="panel">
      <h2 className="panel__title">Requirements</h2>

      <ul className="requirement-list">
        {requirements.map((requirement) => (
          <RequirementItem
            key={requirement.id}
            label={requirement.label}
            met={requirement.met}
          />
        ))}
      </ul>
    </section>
  );
}

export default RequirementList;
