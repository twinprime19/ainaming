import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Layout/Header';
import MobileMenu from './components/Layout/MobileMenu';
import ErrorMessage from './components/Layout/ErrorMessage';
import NameInput from './components/NameInput';
import NameCloud from './components/NameCloud';
import RankingList from './components/RankingList';
import NameSubmissionModal from './components/NameSubmissionModal';
import { containsProfanity } from './utils/profanityFilter';
import { isVotingPeriod } from './utils/dateConstants';
import { BotName } from './types';

function App() {
  const [names, setNames] = useState<BotName[]>([
    { id: '1', text: 'Estella', votes: 1 },
  ]);
  const [error, setError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewName = (name: string) => {
    if (!isVotingPeriod()) {
      setError('Cuộc bỏ phiếu chưa bắt đầu, hoặc đã kết thúc!');
      return;
    }

    if (containsProfanity(name)) {
      setError('Xin chỉ đề xuất những tên phù hợp!');
      return;
    }

    if (names.some(n => n.text.toLowerCase() === name.toLowerCase())) {
      setError('Tên này có người đề xuất rồi, bạn hãy click vào tên đó để bỏ phiếu!');
      return;
    }

    setPendingSubmission(name);
    setIsModalOpen(true);
  };

  const handleSubmitterName = (submitterName: string) => {
    if (pendingSubmission) {
      setNames(prev => [...prev, {
        id: Date.now().toString(),
        text: pendingSubmission,
        votes: 1,
        submitter: submitterName
      }]);
      setIsModalOpen(false);
      setPendingSubmission(null);
      setError('');
    }
  };

  const handleVote = useCallback((id: string) => {
    if (!isVotingPeriod()) {
      setError('Chưa bỏ phiếu được. Cuộc thi chưa bắt đầu, hoặc đã kết thúc!');
      return;
    }

    setNames(prev => prev.map(name =>
      name.id === id ? { ...name, votes: name.votes + 1 } : name
    ));
    setError('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          names={names}
          onNameSubmit={handleNewName}
        />

        <div className="hidden md:block">
          <NameInput onSubmit={handleNewName} />
          <RankingList names={names} />
        </div>

        <ErrorMessage message={error} />

        <main className="flex-1 flex flex-col items-center mt-4 px-4">
          <div className="w-full max-w-5xl">
            <NameCloud names={names} onVote={handleVote} />
          </div>
        </main>

        <NameSubmissionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPendingSubmission(null);
          }}
          onSubmit={handleSubmitterName}
          botName={pendingSubmission || ''}
        />
      </div>
    </div>
  );
}

export default App;