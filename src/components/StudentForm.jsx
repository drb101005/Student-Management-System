import { useEffect, useState } from 'react';

const defaultValues = {
  studentId: '',
  fullName: '',
  email: '',
  phone: '',
  class: '',
  section: '',
  rollNumber: '',
  parentName: '',
  status: 'active'
};

const normalizeValues = (values) => ({
  studentId: values?.studentId ?? '',
  fullName: values?.fullName ?? '',
  email: values?.email ?? '',
  phone: values?.phone ?? '',
  class: values?.class ?? '',
  section: values?.section ?? '',
  rollNumber: values?.rollNumber ?? '',
  parentName: values?.parentName ?? '',
  status: values?.status ?? 'active'
});

const StudentForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    setFormData(initialValues ? normalizeValues(initialValues) : defaultValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const wasSuccessful = await onSubmit(formData);

    if (!initialValues && wasSuccessful) {
      setFormData(defaultValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300">
            {initialValues ? 'Edit Student' : 'Add Student'}
          </p>
          <h3 className="mt-1 font-display text-2xl font-bold text-white">
            {initialValues ? 'Update student profile' : 'Create a student record'}
          </h3>
        </div>
        {initialValues ? (
          <button type="button" onClick={onCancel} className="btn-secondary px-4 py-2 text-sm">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="studentId">
            Student ID
          </label>
          <input
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="field"
            placeholder="STU-1001"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="rollNumber">
            Roll Number
          </label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            className="field"
            placeholder="12"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="field"
            placeholder="Aarav Sharma"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="field"
            placeholder="student@example.com"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="field"
            placeholder="+91 9876543210"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="class">
            Class
          </label>
          <input
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="field"
            placeholder="10"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="section">
            Section
          </label>
          <input
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="field"
            placeholder="A"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="parentName">
            Parent Name
          </label>
          <input
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            className="field"
            placeholder="Priya Sharma"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="field"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialValues ? 'Update Student' : 'Add Student'}
      </button>
    </form>
  );
};

export default StudentForm;
