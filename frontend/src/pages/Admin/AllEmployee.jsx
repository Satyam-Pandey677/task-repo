import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import LoadingContainer from "../../Components/LoadingContainer";

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

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get("/api/employee/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(data?.data || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load employees",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const departments = useMemo(
    () =>
      [
        ...new Set(
          employees.map((employee) => getDepartmentName(employee.department)).filter((department) => department !== "Unassigned"),
        ),
      ].sort(),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const status = employee.status || "Active";
      const matchesSearch =
        !query ||
        [
          employee.name,
          employee.employeeID,
          employee.designation,
          getDepartmentName(employee.department),
          employee.user?.email,
        ].some((value) => value?.toLowerCase().includes(query));
      const matchesDepartment =
        departmentFilter === "All" || getDepartmentName(employee.department) === departmentFilter;
      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [departmentFilter, employees, search, statusFilter]);

  if (loading) {
    return <LoadingContainer rows={5} title="Loading employees..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [
            "Total team",
            employees.length,
            "All employee records",
            "text-slate-900",
          ],
          [
            "Active",
            employees.filter(
              (employee) => (employee.status || "Active") === "Active",
            ).length,
            "Currently working",
            "text-emerald-700",
          ],
          [
            "On leave",
            employees.filter((employee) => employee.status === "On Leave")
              .length,
            "Temporarily away",
            "text-amber-700",
          ],
          [
            "Departments",
            departments.length,
            "Across the organisation",
            "text-sky-700",
          ],
        ].map(([label, value, caption, color]) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${label === "Active" ? "bg-emerald-400" : label === "On leave" ? "bg-amber-400" : label === "Departments" ? "bg-sky-400" : "bg-slate-400"}`}
              />
            </div>
            <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-slate-400">{caption}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Employee directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredEmployees.length} of {employees.length} employees shown
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_auto_auto]">
              <label className="relative block">
                <span className="sr-only">Search employees</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, ID, or role"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />
              </label>
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-500"
              >
                <option value="All">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-emerald-500"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          <div className="px-6 py-12 text-center text-sm text-rose-600">
            {error}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-base font-semibold text-slate-700">
              No employees match these filters
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing the search or selecting a different filter.
            </p>
          </div>
        ) : (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => {
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
                              <p className="font-semibold text-slate-800">
                                {employee.name || "Unnamed employee"}
                              </p>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredEmployees.map((employee) => {
                const status = employee.status || "Active";
                return (
                  <article
                    key={employee._id || employee.employeeID}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700">
                          {getInitials(employee.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {employee.name || "Unnamed employee"}
                          </p>
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
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AllEmployee;
