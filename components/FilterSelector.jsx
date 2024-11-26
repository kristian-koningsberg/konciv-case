import React from "react";

export const FilterSelector = ({
  filterValue,
  options = {},
  handleChange,
  label,
  id,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full p-4 bg-slate-900 hover:bg-slate-950 text-white rounded-md transition-all shadow-md scale-100">
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        value={filterValue}
        title="Velg fra nedtrekksmeny"
        className="bg-white/10 p-4 w-full rounded-md cursor-pointer"
        onChange={handleChange}>
        <option value="Alle">Alle</option>
        {Object.keys(options).map((key) => (
          <option
            key={key}
            value={options[key]}>
            {options[key]}
          </option>
        ))}
      </select>
    </div>
  );
};
export const FilterSelectorSimple = ({
  filterValue,
  options = {},
  handleChange,
  label,
  id,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full text-white transition-all shadow-md scale-100">
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        value={filterValue}
        className="bg-white/10 p-4 w-full text-base rounded-md cursor-pointer"
        onChange={handleChange}>
        <option value="Alle">Alle</option>
        {Object.keys(options).map((key) => (
          <option
            key={key}
            value={options[key]}>
            {options[key]}
          </option>
        ))}
      </select>
    </div>
  );
};
