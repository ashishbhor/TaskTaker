
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full animate-fade-in">
      {label && <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>}
      <input 
        className={`px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/10 ${
          error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-0.5 ml-1">{error}</span>}
    </div>
  );
};
