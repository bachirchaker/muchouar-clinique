"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import { debounce } from "@/lib/utils";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({ onSearch, debounceMs = 300, className, ...props }: SearchInputProps) {
  const [value, setValue] = useState(props.defaultValue?.toString() || "");
  
  const debouncedSearch = useRef(
    debounce((searchTerm: string) => {
      onSearch(searchTerm);
    }, debounceMs)
  ).current;

  useEffect(() => {
    return () => {
      // Cleanup might be needed if debounce implementation retains state
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Rechercher..."
        leftIcon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 focus:outline-none pointer-events-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    </div>
  );
}
