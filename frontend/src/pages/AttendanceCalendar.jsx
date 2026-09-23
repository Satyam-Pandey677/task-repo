import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppData } from "../context/userApi";
import LoadingContainer from "../Components/LoadingContainer";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

const statusLabel = (record) => {
  if (record.status === "absent") return "Absent";
  if (!record.checkIn) return "Absent";
  const checkIn = new Date(record.checkIn);
  return checkIn.getHours() > 9 ||
    (checkIn.getHours() === 9 && checkIn.getMinutes() > 30)
    ? "Late"
    : "Present";
};

const statusClasses = {
  Present: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Late: "bg-amber-100 text-amber-700 ring-amber-200",
  Absent: "bg-rose-100 text-rose-700 ring-rose-200",
};

const AttendanceCalendar = () => {
  const { user } = useAppData();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isEmployee = user?.user?.role === "employee";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const token = Cookies.get("token");
        const { data } = await axios.get("/api/employee/attendance/history", {
          params: {
            month: viewDate.getMonth() + 1,
            year: viewDate.getFullYear(),
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(data?.data || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load attendance calendar",
        );
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [viewDate]);

  const recordsByDate = useMemo(
    () =>
      records.reduce((result, record) => {
        const key = dateKey(record.date);
        result[key] = result[key] || [];
        result[key].push(record);
        return result;
      }, {}),
    [records],
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1,
    ).getDay();
    const daysInMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
    ).getDate();
    return Array.from(
      { length: Math.ceil((firstDay + daysInMonth) / 7) * 7 },
      (_, index) => {
        const dayNumber = index - firstDay + 1;
        return dayNumber > 0 && dayNumber <= daysInMonth
          ? new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNumber)
          : null;
      },
    );
  }, [viewDate]);

  const selectedRecords = recordsByDate[selectedDate] || [];
  const presentCount = records.filter(
    (record) => statusLabel(record) === "Present",
  ).length;
  const lateCount = records.filter(
    (record) => statusLabel(record) === "Late",
  ).length;
  const absentCount = records.filter(
    (record) => statusLabel(record) === "Absent",
  ).length;

  const changeMonth = (offset) => {
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Attendance tracking
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {isEmployee ? "My attendance calendar" : "Attendance calendar"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View attendance records by day and month.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            aria-label="Previous month"
          >
            &lt;
          </button>
          <p className="min-w-36 text-center text-sm font-bold text-slate-800">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Present</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {presentCount}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-700">Late</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">{lateCount}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm text-rose-700">Absent</p>
          <p className="mt-1 text-2xl font-bold text-rose-800">{absentCount}</p>
        </div>
      </div>

      {loading ? (
        <LoadingContainer rows={5} title="Loading attendance calendar..." />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="grid grid-cols-7 border-b border-slate-100 pb-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (!day)
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-20 rounded-lg bg-slate-50/60 sm:min-h-24"
                    />
                  );
                const key = dateKey(day);
                const dayRecords = recordsByDate[key] || [];
                const statuses = dayRecords.map(statusLabel);
                const dayStatus = statuses.includes("Present")
                  ? "Present"
                  : statuses.includes("Late")
                    ? "Late"
                    : statuses[0];
                const isSelected = selectedDate === key;
                const isToday = dateKey(today) === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    className={`min-h-20 rounded-lg border p-2 text-left transition hover:border-emerald-400 sm:min-h-24 ${isSelected ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-100"} ${isToday ? "bg-emerald-50/60" : "bg-white"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${isToday ? "text-emerald-700" : "text-slate-700"}`}
                      >
                        {day.getDate()}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold text-emerald-600">
                          Today
                        </span>
                      )}
                    </div>
                    {dayStatus && (
                      <span
                        className={`mt-3 inline-flex rounded-full px-1.5 py-1 text-[10px] font-bold ring-1 ring-inset ${statusClasses[dayStatus]}`}
                      >
                        {dayStatus}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>
                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Present
              </span>
              <span>
                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                Late
              </span>
              <span>
                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
                Absent
              </span>
            </div>
          </section>

          <section className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Selected day
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString([], {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            {selectedRecords.length ? (
              <div className="mt-5 space-y-3">
                {selectedRecords.map((record) => (
                  <div key={record.id} className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800">
                        {isEmployee
                          ? "My record"
                          : record.employee?.name || "Employee"}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ${statusClasses[statusLabel(record)]}`}
                      >
                        {statusLabel(record)}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Check in</p>
                        <p className="mt-1 text-slate-700">
                          {formatTime(record.checkIn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Check out</p>
                        <p className="mt-1 text-slate-700">
                          {formatTime(record.checkOut)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                No attendance record for this day.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
