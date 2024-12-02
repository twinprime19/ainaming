import React, { useState } from 'react';
import { X } from 'lucide-react';

interface NameSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submitterName: string) => void;
  botName: string;
}

const NameSubmissionModal: React.FC<NameSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  botName
}) => {
  const [submitterName, setSubmitterName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitterName.trim()) {
      onSubmit(submitterName.trim());
      setSubmitterName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Sẵn sàng nha...
        </h3>
        <p className="text-gray-600 mb-4">
          Bạn đề xuất tên "{botName}". Hãy cho chúng tôi biết tên bạn (để nhận giải thưởng) nha!
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
            maxLength={50}
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Đồng ý!
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameSubmissionModal;