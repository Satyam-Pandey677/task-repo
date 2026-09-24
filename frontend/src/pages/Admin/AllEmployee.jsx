import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import LoadingContainer from "../../Components/LoadingContainer";
import EditEmployeeModal from "../../Components/EditEmployeeModal";
import EmployeeHeaderBanner from "../../Components/EmployeeHeaderBanner";
import EmployeeStatsCards from "../../Components/EmployeeStatsCards";
import EmployeeFilterBar from "../../Components/EmployeeFilterBar";
import EmployeeTable from "../../Components/EmployeeTable";

const getDepartmentName = (department) =>
  typeof department === "object" ? department?.name || "Unassigned" : department || "Unassigned";

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

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

  const handleDelete = async (employee) => {
    const employeeName = employee.name || 'this employee';
    if (!window.confirm(`Delete ${employeeName}? This will also remove their attendance records.`)) {
      return;
    }

    try {
      setDeletingId(employee._id);
      const token = Cookies.get('token');
      const { data } = await axios.delete(`/api/employee/${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((current) => current.filter((item) => item._id !== employee._id));
      toast.success(data.message || 'Employee deleted successfully');
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Failed to delete employee');
    } finally {
      setDeletingId(null);
    }
  };

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
      <EmployeeHeaderBanner />

      <EmployeeStatsCards employees={employees} departments={departments} />

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <EmployeeFilterBar
          search={search}
          setSearch={setSearch}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departments={departments}
          totalShown={filteredEmployees.length}
          totalEmployees={employees.length}
        />

        {error ? (
          <div className="px-6 py-12 text-center text-sm text-rose-600">
            {error}
          </div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            deletingId={deletingId}
            onEdit={(employee) => setEditingEmployee(employee)}
            onDelete={handleDelete}
          />
        )}
      </section>

      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSuccess={(updatedEmp) => {
          setEmployees((current) =>
            current.map((item) => (item._id === updatedEmp._id ? updatedEmp : item))
          );
        }}
      />
    </div>
  );
};

export default AllEmployee;
