const formatDate = (value) => {
  if (!value) {
    return 'Just now';
  }

  return new Date(value).toLocaleString();
};

const StudentTable = ({ students, onView, onEdit, onDelete }) => {
  if (!students.length) {
    return (
      <div className="panel p-6">
        <p className="font-display text-xl font-semibold text-white">No students yet</p>
        <p className="mt-2 text-sm text-slate-400">Add your first student record to start building the list.</p>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-white/5">
            <tr>
              {['Student', 'Class', 'Contact', 'Status', 'Created', 'Actions'].map((column) => (
                <th key={column} className="table-cell text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-white/5">
                <td className="table-cell">
                  <p className="font-semibold text-white">{student.fullName}</p>
                  <p className="text-xs text-slate-400">
                    {student.studentId} • Roll {student.rollNumber}
                  </p>
                </td>
                <td className="table-cell">
                  Class {student.class} - {student.section}
                </td>
                <td className="table-cell">
                  <p>{student.email}</p>
                  <p className="text-xs text-slate-400">{student.phone}</p>
                </td>
                <td className="table-cell capitalize">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                    {student.status}
                  </span>
                </td>
                <td className="table-cell text-slate-400">{formatDate(student.createdAt)}</td>
                <td className="table-cell">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onView(student)} className="btn-secondary px-3 py-2 text-xs">
                      View
                    </button>
                    <button type="button" onClick={() => onEdit(student)} className="btn-secondary px-3 py-2 text-xs">
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(student)} className="btn-danger px-3 py-2 text-xs">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
