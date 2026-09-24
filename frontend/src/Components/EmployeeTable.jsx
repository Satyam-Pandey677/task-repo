import React from "react";
import { Link } from "react-router-dom";
import { Trash, Pencil } from "lucide-react";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "On Leave": "bg-amber-50 text-amber-700 ring-amber-200",
  Resigned: "bg-slate-100 text-slate-600 ring-slate-200",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EM";

const getDepartmentName = (department) =>
  typeof department === "object" ? department?.name || "Unassigned" : department || "Unassigned";

const EmployeeTable = ({
  employees = [],
  deletingId,
  onEdit,
  onDelete,
}) => {
  if (employees.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-base font-semibold text-slate-700">
          No employees match these filters
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Try clearing the search or selecting a different filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-200 text-left">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-bold">Employee</th>
              <th className="px-4 py-4 font-bold">Department</th>
              <th className="px-4 py-4 font-bold">Role</th>
              <th className="px-4 py-4 font-bold">Contact</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => {
              const status = employee.status || "Active";
              return (
                <tr
                  key={employee._id || employee.employeeID}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700">
                        {getInitials(employee.name)}
                      </span>
                      <div>
                        <Link
                          to={`/employees/${employee._id}`}
                          className="font-semibold text-slate-800 hover:text-emerald-700"
                        >
                          {employee.name || "Unnamed employee"}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {employee.employeeID || "No ID"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {getDepartmentName(employee.department)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {employee.designation || "Not specified"}
                  </td>
                  <td className="px-4 py-4">
                    <p className="max-w-55 truncate text-sm text-slate-600">
                      {employee.user?.email || "No email"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {employee.phone || "No phone"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.Resigned}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(employee)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                        title="Edit Employee"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(employee)}
                        disabled={deletingId === employee._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50/50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete Employee"
                      >
                        {deletingId === employee._id ? (
                          "..."
                        ) : (
                          <Trash className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {employees.map((employee) => {
          const status = employee.status || "Active";
          return (
            <article key={employee._id || employee.employeeID} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700">
                    {getInitials(employee.name)}
                  </span>
                  <div className="min-w-0">
                    <Link
                      to={`/employees/${employee._id}`}
                      className="truncate font-semibold text-slate-800 hover:text-emerald-700"
                    >
                      {employee.name || "Unnamed employee"}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {employee.employeeID || "No ID"}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.Resigned}`}
                >
                  {status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Department</p>
                  <p className="mt-1 text-slate-700">
                    {getDepartmentName(employee.department)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Role</p>
                  <p className="mt-1 truncate text-slate-700">
                    {employee.designation || "Not specified"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-400">Contact</p>
                  <p className="mt-1 truncate text-slate-700">
                    {employee.user?.email ||
                      employee.phone ||
                      "No contact details"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(employee)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Edit employee
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(employee)}
                  disabled={deletingId === employee._id}
                  className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === employee._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default EmployeeTable;
