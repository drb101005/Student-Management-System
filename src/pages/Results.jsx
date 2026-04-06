import { useEffect, useMemo, useState } from 'react';
import { createResult, deleteResult, subscribeToResults } from '../services/resultService';
import { subscribeToStudents } from '../services/studentService';

const calculateGrade = (marks, totalMarks) => {
  const percentage = (Number(marks) / Number(totalMarks)) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

const Results = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    marks: '',
    totalMarks: '',
    examName: ''
  });

  useEffect(() => {
    const unsubscribeStudents = subscribeToStudents(setStudents);
    const unsubscribeResults = subscribeToResults(setResults);

    return () => {
      unsubscribeStudents();
      unsubscribeResults();
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

  const visibleResults = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return results;
    }

    return results.filter((result) => {
      const student = studentMap[result.studentId];
      return `${student?.fullName ?? ''} ${result.studentId} ${result.subject} ${result.examName}`
        .toLowerCase()
        .includes(query);
    });
  }, [results, searchTerm, studentMap]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');
    setIsSaving(true);

    try {
      const grade = calculateGrade(formData.marks, formData.totalMarks);

      await createResult({
        ...formData,
        marks: Number(formData.marks),
        totalMarks: Number(formData.totalMarks),
        grade
      });

      setFeedback('Result saved successfully.');
      setFormData((current) => ({
        ...current,
        subject: '',
        marks: '',
        totalMarks: '',
        examName: ''
      }));
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (resultId) => {
    const shouldDelete = window.confirm('Delete this result record?');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteResult(resultId);
      setFeedback('Result deleted successfully.');
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Results Module</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Add exam marks</h2>
          </div>

          <div>
            <label className="label" htmlFor="resultStudent">
              Student
            </label>
            <select
              id="resultStudent"
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
            <label className="label" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              className="field"
              value={formData.subject}
              onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
              placeholder="Mathematics"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="marks">
                Marks
              </label>
              <input
                id="marks"
                type="number"
                min="0"
                className="field"
                value={formData.marks}
                onChange={(event) => setFormData((current) => ({ ...current, marks: event.target.value }))}
                placeholder="88"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="totalMarks">
                Total Marks
              </label>
              <input
                id="totalMarks"
                type="number"
                min="1"
                className="field"
                value={formData.totalMarks}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, totalMarks: event.target.value }))
                }
                placeholder="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="examName">
              Exam Name
            </label>
            <input
              id="examName"
              className="field"
              value={formData.examName}
              onChange={(event) => setFormData((current) => ({ ...current, examName: event.target.value }))}
              placeholder="Mid Term"
              required
            />
          </div>

          <button type="submit" disabled={isSaving || !students.length} className="btn-primary w-full">
            {isSaving ? 'Saving...' : 'Add Result'}
          </button>

          {!students.length ? (
            <p className="text-sm text-slate-400">Add students first so results can be linked correctly.</p>
          ) : null}
        </form>

        <div className="panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Stored Results</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Review result entries</h2>
            </div>
            <input
              className="field w-full sm:max-w-xs"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search student, subject, exam..."
            />
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
                  {['Student', 'Exam', 'Subject', 'Marks', 'Grade', 'Action'].map((heading) => (
                    <th key={heading} className="table-cell text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleResults.length ? (
                  visibleResults.map((result) => {
                    const student = studentMap[result.studentId];

                    return (
                      <tr key={result.id} className="border-t border-white/5">
                        <td className="table-cell">
                          <p className="font-semibold text-white">{student?.fullName ?? 'Unknown Student'}</p>
                          <p className="text-xs text-slate-400">{result.studentId}</p>
                        </td>
                        <td className="table-cell">{result.examName}</td>
                        <td className="table-cell">{result.subject}</td>
                        <td className="table-cell">
                          {result.marks}/{result.totalMarks}
                        </td>
                        <td className="table-cell">{result.grade}</td>
                        <td className="table-cell">
                          <button
                            type="button"
                            onClick={() => handleDelete(result.id)}
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
                    <td colSpan="6" className="table-cell text-slate-400">
                      No results found for the current search.
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

export default Results;

