import { useEffect, useMemo, useState } from 'react';
import {
  deleteAttendanceRecord,
  saveAttendanceRecord,
  subscribeToAttendance
} from '../services/attendanceService';
import { subscribeToStudents } from '../services/studentService';

const today = new Date().toISOString().split('T')[0];

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [filters, setFilters] = useState({ date: today, search: '' });
  const [formData, setFormData] = useState({
    studentId: '',
    date: today,
    status: 'present'
  });

  useEffect(() => {
    const unsubscribeStudents = subscribeToStudents(setStudents);
    const unsubscribeAttendance = subscribeToAttendance(setRecords);

    return () => {
      unsubscribeStudents();
      unsubscribeAttendance();
    };
  }, []);

  useEffect(() => {
    if (students.length && !formData.studentId) {
      setFormData((current) => ({
        ...current,
        studentId: students[0].studentId
      }));
    }
  }, [formData.studentId, students]);

  const studentMap = useMemo(
    () =>
      students.reduce((accumulator, student) => {
        accumulator[student.studentId] = student;
        return accumulator;
      }, {}),
    [students]
  );

  const visibleRecords = useMemo(() => {
    const dateQuery = filters.date.trim();
    const searchQuery = filters.search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesDate = dateQuery ? record.date === dateQuery : true;
      const student = studentMap[record.studentId];
      const searchable = `${record.studentId} ${student?.fullName ?? ''}`.toLowerCase();
      const matchesSearch = searchQuery ? searchable.includes(searchQuery) : true;
      return matchesDate && matchesSearch;
    });
  }, [filters.date, filters.search, records, studentMap]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    setIsSaving(true);

    try {
      await saveAttendanceRecord(formData);
      setFeedback('Attendance saved successfully.');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (recordId) => {
    const shouldDelete = window.confirm('Delete this attendance record?');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteAttendanceRecord(recordId);
      setFeedback('Attendance record deleted.');
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Attendance Entry</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Mark daily attendance</h2>
          </div>

          <div>
            <label className="label" htmlFor="attendanceStudent">
              Student
            </label>
            <select
              id="attendanceStudent"
              className="field"
              value={formData.studentId}
              onChange={(event) => setFormData((current) => ({ ...current, studentId: event.target.value }))}
              required
            >
              {students.map((student) => (
                <option key={student.id} value={student.studentId}>
                  {student.fullName} ({student.studentId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="attendanceDate">
              Date
            </label>
            <input
              id="attendanceDate"
              type="date"
              className="field"
              value={formData.date}
              onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="attendanceStatus">
              Status
            </label>
            <select
              id="attendanceStatus"
              className="field"
              value={formData.status}
              onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <button type="submit" disabled={isSaving || !students.length} className="btn-primary w-full">
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>

          {!students.length ? (
            <p className="text-sm text-slate-400">Add at least one student before recording attendance.</p>
          ) : null}
        </form>

        <div className="panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Date-wise Records</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Track attendance by day</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                className="field"
                value={filters.date}
                onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
              />
              <input
                className="field"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Search student..."
              />
            </div>
          </div>

          {feedback ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {feedback}
            </div>
          ) : null}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr>
                  {['Student', 'Date', 'Status', 'Action'].map((heading) => (
                    <th key={heading} className="table-cell text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRecords.length ? (
                  visibleRecords.map((record) => {
                    const student = studentMap[record.studentId];

                    return (
                      <tr key={record.id} className="border-t border-white/5">
                        <td className="table-cell">
                          <p className="font-semibold text-white">{student?.fullName ?? 'Unknown Student'}</p>
                          <p className="text-xs text-slate-400">{record.studentId}</p>
                        </td>
                        <td className="table-cell">{record.date}</td>
                        <td className="table-cell capitalize">{record.status}</td>
                        <td className="table-cell">
                          <button
                            type="button"
                            onClick={() => handleDelete(record.id)}
                            className="btn-danger px-3 py-2 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="table-cell text-slate-400">
                      No attendance records found for the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attendance;

