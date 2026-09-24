import React from "react";
import { Link } from "react-router-dom";

const EmployeeHeaderBanner = () => {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-200 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
            People operations
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            All employees
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            A clear view of your team, roles, and current availability.
          </p>
        </div>
        <Link
          to="/employees/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
        >
          <span className="text-lg leading-none">+</span>
          Add employee
        </Link>
      </div>
    </section>
  );
};

export default EmployeeHeaderBanner;
