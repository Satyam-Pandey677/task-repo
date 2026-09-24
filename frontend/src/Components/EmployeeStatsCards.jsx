import React from "react";

const EmployeeStatsCards = ({ employees = [], departments = [] }) => {
  const activeCount = employees.filter(
    (employee) => (employee.status || "Active") === "Active"
  ).length;

  const onLeaveCount = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const stats = [
    {
      label: "Total team",
      value: employees.length,
      caption: "All employee records",
      color: "text-slate-900",
      dot: "bg-slate-400",
    },
    {
      label: "Active",
      value: activeCount,
      caption: "Currently working",
      color: "text-emerald-700",
      dot: "bg-emerald-400",
    },
    {
      label: "On leave",
      value: onLeaveCount,
      caption: "Temporarily away",
      color: "text-amber-700",
      dot: "bg-amber-400",
    },
    {
      label: "Departments",
      value: departments.length,
      caption: "Across the organisation",
      color: "text-sky-700",
      dot: "bg-sky-400",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, caption, color, dot }) => (
        <div
          key={label}
          className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          </div>
          <p className={`mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl ${color}`}>{value}</p>
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">{caption}</p>
        </div>
      ))}
    </section>
  );
};

export default EmployeeStatsCards;
