import  { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiFileText } from 'react-icons/fi';

const MedicalHistoryModal = ({ patient, history, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    followUpDate: '',
    severity: 'moderate'
  });

  useEffect(() => {
    if (history) {
      setFormData({
        ...history,
        date: history.date ? history.date.split('T')[0] : new Date().toISOString().split('T')[0],
        followUpDate: history.followUpDate ? history.followUpDate.split('T')[0] : ''
      });
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {history ? 'Edit Medical Record' : 'Add Medical Record'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-primary-50 rounded-lg">
            <h3 className="font-medium text-primary-900">Patient: {patient?.name}</h3>
            <p className="text-sm text-primary-700">
              Age: {patient?.age} • Gender: {patient?.gender} • Blood Group: {patient?.bloodGroup || 'N/A'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Date *
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">
                Symptoms *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
                rows={3}
                className="form-input"
                placeholder="Describe the patient's symptoms..."
              />
            </div>

            <div>
              <label className="form-label">
                Diagnosis *
              </label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter diagnosis"
              />
            </div>

            <div>
              <label className="form-label">
                Treatment *
              </label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                required
                rows={3}
                className="form-input"
                placeholder="Describe the treatment plan..."
              />
            </div>

            <div>
              <label className="form-label">
                Prescription
              </label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                rows={3}
                className="form-input"
                placeholder="List medications and dosages..."
              />
            </div>

            <div>
              <label className="form-label">
                Follow-up Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Additional Notes
              </label>
              <div className="relative">
                <FiFileText className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="form-input pl-10"
                  placeholder="Any additional notes or observations..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {history ? 'Update Record' : 'Add Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;