"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function TaxCalculator() {
  const t = useTranslations("Calculator");
  const locale = useLocale();

  // 1. State for user inputs (2026 ready)
  const [brutto, setBrutto] = useState(70000);
  const [taxClass, setTaxClass] = useState(1);
  const [isMarried, setIsMarried] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [insuranceType, setInsuranceType] = useState("public");
  const [includePension, setIncludePension] = useState(false);
  const [age, setAge] = useState<number>(30); // Added age state

  // Handler for manual input to prevent typing letters or symbols
  const handleBruttoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const cleanValue = e.target.value.replace(/\D/g, "");
    setBrutto(Number(cleanValue));
  };

  // Smart handler to enforce German tax class logic
  const handleTaxClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = Number(e.target.value);
    setTaxClass(newClass);

    // Enforce Marriage rules
    if ([3, 4, 5].includes(newClass)) {
      setIsMarried(true);
    } else if ([1, 2].includes(newClass)) {
      setIsMarried(false);
    }

    // Enforce Children rules
    if (newClass === 2) {
      setHasChildren(true);
    }
  };

  // 2. Pro-level Tax Calculation Logic
  const calculations = useMemo(() => {
    let tax = 0;
    let health = 0;
    let pension = 0;

    // --- Helper Function: Official German Income Tax Formula (Grundtarif) ---
    const calculateBaseTax = (taxableIncome: number) => {
      if (taxableIncome <= 12348) return 0; // Zone 1: Grundfreibetrag

      if (taxableIncome <= 17005) {
        // Zone 2
        const y = (taxableIncome - 12348) / 10000;
        return (979.18 * y + 1400) * y;
      }

      if (taxableIncome <= 69878) {
        // Zone 3
        const z = (taxableIncome - 17005) / 10000;
        return (212.02 * z + 2397) * z + 1045;
      }

      if (taxableIncome <= 277825) {
        // Zone 4: 42% Spitzensteuersatz
        return 0.42 * taxableIncome - 10564;
      }

      // Zone 5: 45% Reichensteuer
      return 0.45 * taxableIncome - 18899;
    };

    // --- A. Apply Tax Class Rules to calculate Income Tax ---
    if (taxClass === 1 || taxClass === 4) {
      tax = calculateBaseTax(brutto);
    } else if (taxClass === 2) {
      const adjustedIncome = Math.max(0, brutto - 4260);
      tax = calculateBaseTax(adjustedIncome);
    } else if (taxClass === 3) {
      tax = calculateBaseTax(brutto / 2) * 2;
    } else if (taxClass === 5 || taxClass === 6) {
      tax = calculateBaseTax(brutto + 12348);
    } else {
      tax = calculateBaseTax(brutto);
    }

    // --- B. Calculate Health & Care Insurance for 2026 ---
    if (insuranceType === "public") {
      const healthBase = Math.min(brutto, 69750); // Beitragsbemessungsgrenze
      health = healthBase * 0.197;
    } else {
      // PKV logic: base cost + increase based on age
      const basePKV = 350 * 12; // 4200€ / year base
      const ageSurcharge = Math.max(0, age - 25) * 15 * 12; // +15€/mo for every year over 25
      health = basePKV + ageSurcharge;
    }

    // --- C. Calculate Pension Insurance for 2026 ---
    if (includePension) {
      const pensionBase = Math.min(brutto, 101400); // Beitragsbemessungsgrenze
      pension = pensionBase * 0.186;
    }

    // --- D. Final Netto Calculation ---
    const netto = brutto - tax - health - pension;

    return {
      tax: Math.round(tax),
      health: Math.round(health),
      pension: Math.round(pension),
      netto: Math.round(netto),
    };
  }, [
    brutto,
    taxClass,
    isMarried,
    hasChildren,
    insuranceType,
    includePension,
    age,
  ]);

  const { tax, health, pension, netto } = calculations;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans antialiased text-gray-900">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">
          {t("title")}
        </h1>
        <p className="text-gray-600 mt-3 text-lg">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column: Inputs */}
        <div className="flex-[3] bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            {t("details")}
          </h2>

          {/* Brutto Input & Slider */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
              <label className="block text-base font-semibold text-gray-800">
                {t("bruttoLabel")}
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  €
                </span>
                <input
                  type="text"
                  value={brutto === 0 ? "" : brutto}
                  onChange={handleBruttoChange}
                  className="w-full sm:w-40 pl-9 pr-4 py-2 text-lg font-bold text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={brutto}
              onChange={(e) => setBrutto(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
              <span>0 €</span>
              <span>200.000+ €</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tax Class Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                {t("taxClass")}
              </label>

              <div className="relative">
                <select
                  value={taxClass}
                  onChange={handleTaxClassChange}
                  className="w-full py-4 pl-4 pr-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((cl) => (
                    <option key={cl} value={cl}>
                      {t("classPrefix")} {cl}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Family Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                {t("familyStatus")}
              </label>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${
                    [1, 2, 3, 4, 5].includes(taxClass)
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-70"
                      : "bg-gray-50 border-gray-100 cursor-pointer hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isMarried}
                    onChange={(e) => setIsMarried(e.target.checked)}
                    disabled={[1, 2, 3, 4, 5].includes(taxClass)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-gray-800 font-medium">
                    {t("married")}
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border rounded-xl transition-colors ${
                    taxClass === 2
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-70"
                      : "bg-gray-50 border-gray-100 cursor-pointer hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => setHasChildren(e.target.checked)}
                    disabled={taxClass === 2}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-gray-800 font-medium">
                    {t("children")}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Insurance Type */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              {t("healthInsurance")}
            </label>
            <div className="flex flex-col sm:flex-row gap-5">
              <label className="flex-1 flex items-center gap-3 cursor-pointer p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-200">
                <input
                  type="radio"
                  name="insurance"
                  value="public"
                  checked={insuranceType === "public"}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-800">{t("public")}</span>
              </label>
              <label className="flex-1 flex flex-col p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-200 relative group">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="insurance"
                    value="private"
                    checked={insuranceType === "private"}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-800">
                    {t("private")}
                  </span>
                  <span className="text-blue-500 font-bold cursor-help ml-1">
                    [i]
                  </span>
                </div>
                <div className="absolute bottom-full mb-3 left-0 bg-gray-900 text-white text-xs p-4 rounded-xl shadow-xl w-72 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {t("pvkWarning")}
                  <div className="absolute top-full left-5 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </label>
            </div>

            {/* Age Selection - Logic added here */}
            {insuranceType === "private" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-blue-900">
                    {t("ageLabel")}
                  </label>
                  <span className="text-lg font-bold text-blue-600">
                    {age} {t("years")}
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="65"
                  step="1"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[10px] text-blue-700 mt-2 uppercase tracking-wide italic">
                  {t("ageWarning")}
                </p>
              </div>
            )}
          </div>

          {/* Pension Checkbox */}
          <div className="mb-4 p-6 border border-gray-100 rounded-2xl bg-white shadow-inner">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={includePension}
                onChange={(e) => setIncludePension(e.target.checked)}
                className="w-6 h-6 text-blue-600 rounded-lg focus:ring-blue-500"
              />
              <div>
                <span className="block text-base font-semibold text-gray-950">
                  {t("pension")}
                </span>
                <span className="block text-sm text-gray-500">
                  {t("pensionDesc")}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex-[2] bg-gray-950 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between self-start sticky top-8">
          <div>
            <h2 className="text-2xl font-bold mb-8 border-b border-gray-800 pb-4">
              {t("result")}
            </h2>

            <div className="bg-emerald-500 text-gray-950 p-8 rounded-3xl mb-10 text-center shadow-inner">
              <span className="block text-gray-950 text-sm font-semibold uppercase tracking-wider mb-2">
                {t("netto")}
              </span>
              <span className="text-5xl font-extrabold tracking-tighter">
                €{netto.toLocaleString(locale)}
              </span>
              <span className="block text-gray-950/80 text-base mt-2">
                {t("perYear")}
              </span>
            </div>

            <div className="space-y-5 text-gray-100">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">{t("tax")}</span>
                <span className="font-semibold text-rose-400 text-lg">
                  - €{tax.toLocaleString(locale)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-300">{t("healthInsurance")}</span>
                <span className="font-semibold text-blue-400 text-lg">
                  - €{health.toLocaleString(locale)}
                </span>
              </div>
              {includePension && (
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300">{t("pension")}</span>
                  <span className="font-semibold text-purple-400 text-lg">
                    - €{pension.toLocaleString(locale)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 bg-white/5 p-6 rounded-2xl text-center border border-white/10">
            <p className="text-sm text-gray-300 mb-4">{t("cta")}</p>
            <button className="w-full bg-white text-gray-950 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors text-lg">
              {/* {t("btn")} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
