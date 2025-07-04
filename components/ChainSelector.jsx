import React from "react";

function ChainSelector({ label, value, onChange, chains, id }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {chains.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ChainSelector;
