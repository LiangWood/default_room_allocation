import React, { useState, useEffect } from "react";

interface CustomInputNumberProps {
  min: number;
  max: number;
  step: number;
  name: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disableMinus?: boolean;
  disablePlus?: boolean;
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({
  min,
  max,
  step,
  name,
  value,
  onChange,
  onBlur,
  disableMinus,
  disablePlus,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setInternalValue(newValue);
    onChange(e);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBlur(e);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        className="w-12 h-12 flex items-center justify-center text-2xl border border-blue-300 text-blue-500 rounded-lg bg-transparent hover:bg-blue-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
        onClick={() => {
          if (!disableMinus && internalValue > min) {
            const newValue = internalValue - step;
            setInternalValue(newValue);
            onChange({
              target: { value: newValue, name },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        disabled={disableMinus || internalValue <= min}
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        name={name}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-16 h-12 text-center border border-gray-300 rounded-lg"
      />
      <button
        className="w-12 h-12 flex items-center justify-center text-2xl border border-blue-300 text-blue-500 rounded-lg bg-transparent hover:bg-blue-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200"
        onClick={() => {
          if (!disablePlus && internalValue < max) {
            const newValue = internalValue + step;
            setInternalValue(newValue);
            onChange({
              target: { value: newValue, name },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        disabled={disablePlus || internalValue >= max}
      >
        +
      </button>
    </div>
  );
};

export default CustomInputNumber;
