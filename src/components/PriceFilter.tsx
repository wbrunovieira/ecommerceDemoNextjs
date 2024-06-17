"use client";
import { useState } from "react";

const PriceFilter = () => {
  const [valorMin, setValorMin] = useState(0);
  const [valorMax, setValorMax] = useState(1000);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMin = Math.min(Number(e.target.value), valorMax - 1);

    setValorMin(novoMin);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMax = Math.max(Number(e.target.value), valorMin + 1);

    setValorMax(novoMax);
  };

  return (
    <div className="flex flex-col w-48 border border-light p-4 mt-2 rounded bg-primaryLight">
      <h2 className="text-primaryDark text-base tracking-wider rounded mb-2">
        Preço
      </h2>
      <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mb-4" />
      <div className="relative ">
        <div className="mb-4">
          <label
            htmlFor="min"
            className="block text-xs font-medium text-gray-700"
          >
            Mínimo
          </label>
          <input
            id="min"
            type="range"
            min="0"
            max="1000"
            value={valorMin}
            onChange={handleMinChange}
            className="slider-min"
          />
          <div className="text-xs text-center">{valorMin}</div>
        </div>

        <div>
          <label
            htmlFor="max"
            className="block text-xs font-medium text-gray-700"
          >
            Máximo
          </label>
          <input
            id="max"
            type="range"
            min="0"
            max="1000"
            value={valorMax}
            onChange={handleMaxChange}
            className="slider-max"
          />

          <div className="text-xs text-center">{valorMax}</div>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
