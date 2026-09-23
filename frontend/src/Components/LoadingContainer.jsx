import React from 'react';

const LoadingContainer = ({ rows = 4, title = 'Loading...' }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="h-6 w-36 rounded bg-slate-200" />
        <div className="mt-6 h-24 rounded-2xl bg-slate-100" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[...Array(rows)].map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-slate-100" />
          ))}
        </div>
        {title && (
          <div className="mt-4 text-center text-sm text-slate-500">{title}</div>
        )}
      </div>
    </div>
  );
};

export default LoadingContainer;
