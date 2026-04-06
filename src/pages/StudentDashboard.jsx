import { useEffect, useState } from 'react';
import { subscribeToAttendanceByStudentId } from '../services/attendanceService';
import { subscribeToResultsByStudentId } from '../services/resultService';
import { getCurrentStudentRecord } from '../services/studentService';

const StudentDashboard = ({ user, profile }) => {
  const [studentRecord, setStudentRecord] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let attendanceUnsubscribe = () => undefined;
    let resultsUnsubscribe = () => undefined;

    const loadStudent = async () => {
      const record = await getCurrentStudentRecord();
      setStudentRecord(record);

      const studentId = record?.studentId ?? profile?.studentId;

      if (!studentId) {
        return;
      }

      attendanceUnsubscribe = subscribeToAttendanceByStudentId(studentId, setAttendanceRecords);
      resultsUnsubscribe = subscribeToResultsByStudentId(studentId, setResults);
    };

    loadStudent();

    return () => {
      attendanceUnsubscribe();
      resultsUnsubscribe();
    };
  }, [profile?.studentId, user?.id]);

  const presentCount = attendanceRecords.filter((record) => record.status === 'present').length;
  const averageMarks = results.length
    ? Math.round(
        results.reduce((sum, result) => sum + (result.marks / result.totalMarks) * 100, 0) / results.length
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="panel p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Student Dashboard</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-white lg:text-4xl">
          Welcome back, {profile?.fullName ?? studentRecord?.fullName ?? 'Student'}
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Track your attendance, review exam results, and keep your class information in one place.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          ['Attendance Entries', attendanceRecords.length],
          ['Present Days', presentCount],
          ['Average Score', `${averageMarks}%`]
        ].map(([label, value]) => (
          <article key={label} className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
            <p className="mt-5 font-display text-5xl font-bold text-white">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">My Profile</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ['Student ID', studentRecord?.studentId ?? profile?.studentId ?? 'Not set'],
              ['Full Name', studentRecord?.fullName ?? profile?.fullName ?? 'Not set'],
              ['Email', user?.email ?? 'Not set'],
              ['Class', studentRecord?.class ?? 'Not set'],
              ['Section', studentRecord?.section ?? 'Not set'],
              ['Roll Number', studentRecord?.rollNumber ?? 'Not set']
            ].map(([label, value]) => (
              <div key={label} className="panel-muted p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Recent Results</p>
          <div className="mt-6 space-y-4">
            {results.length ? (
              results.slice(0, 5).map((result) => (
                <div key={result.id} className="panel-muted flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold text-white">{result.subject}</p>
                    <p className="text-sm text-slate-400">{result.examName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {result.marks}/{result.totalMarks}
                    </p>
                    <p className="text-sm text-amber-300">{result.grade}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No results available yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
