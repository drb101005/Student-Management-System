import { useEffect, useMemo, useState } from 'react';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import {
  createStudent,
  deleteStudent,
  subscribeToStudents,
  updateStudent
} from '../services/studentService';

const detailRows = [
  ['Student ID', 'studentId'],
  ['Email', 'email'],
  ['Phone', 'phone'],
  ['Class', 'class'],
  ['Section', 'section'],
  ['Roll Number', 'rollNumber'],
  ['Parent Name', 'parentName'],
  ['Status', 'status']
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToStudents((records) => {
      setStudents(records);

      setSelectedStudent((current) => {
        if (!records.length) {
          return null;
        }

        if (!current) {
          return records[0];
        }

        return records.find((student) => student.id === current.id) ?? records[0];
      });
    });

    return unsubscribe;
  }, []);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return students;
    }

    return students.filter((student) =>
      [student.fullName, student.studentId, student.email, student.class, student.section, student.rollNumber]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm, students]);

  const handleSaveStudent = async (formValues) => {
    setFeedback('');
    setIsSaving(true);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formValues);
        setFeedback('Student updated successfully.');
      } else {
        await createStudent(formValues);
        setFeedback('Student added successfully.');
      }

      setEditingStudent(null);
      return true;
    } catch (error) {
      setFeedback(error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async (student) => {
    const shouldDelete = window.confirm(`Delete ${student.fullName}? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteStudent(student.id);
      setFeedback('Student deleted successfully.');

      if (selectedStudent?.id === student.id) {
        setSelectedStudent(null);
      }
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <StudentForm
          initialValues={editingStudent}
          onSubmit={handleSaveStudent}
          onCancel={() => setEditingStudent(null)}
          isSubmitting={isSaving}
        />

        <div className="panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Student Directory</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">Search and review profiles</h3>
            </div>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="field w-full sm:max-w-xs"
              placeholder="Search by name, class, ID..."
            />
          </div>

          {feedback ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {feedback}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="panel-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Filtered Students</p>
              <p className="mt-2 font-display text-3xl font-bold text-white">{filteredStudents.length}</p>
            </div>
            <div className="panel-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Records</p>
              <p className="mt-2 font-display text-3xl font-bold text-white">{students.length}</p>
            </div>
          </div>
        </div>
      </section>

      <StudentTable
        students={filteredStudents}
        onView={setSelectedStudent}
        onEdit={setEditingStudent}
        onDelete={handleDeleteStudent}
      />

      <section className="panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Student Details</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">
              {selectedStudent?.fullName ?? 'Select a student'}
            </h3>
          </div>

          {selectedStudent ? (
            <button
              type="button"
              onClick={() => setEditingStudent(selectedStudent)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Edit this student
            </button>
          ) : null}
        </div>

        {selectedStudent ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {detailRows.map(([label, key]) => (
              <div key={key} className="panel-muted p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white capitalize">{selectedStudent[key]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-400">Use the table above to open a student profile.</p>
        )}
      </section>
    </div>
  );
};

export default Students;
