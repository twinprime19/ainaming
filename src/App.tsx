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
import { loadNamesFromSupabase, saveNameToSupabase, updateVoteInSupabase, supabase } from './utils/supabase';
import { BotName } from './types';

function App() {
  const [names, setNames] = useState<BotName[]>([]);
  const [error, setError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialNames = await loadNamesFromSupabase();
      setNames(initialNames);
      setIsLoading(false);
    };

    loadInitialData();

    const subscription = supabase
      .channel('bot_names_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bot_names' },
        (payload) => {
          setNames(currentNames => {
            const updatedNames = [...currentNames];
            const index = updatedNames.findIndex(n => n.id === payload.new.id);
            
            if (index !== -1) {
              updatedNames[index] = payload.new;
            } else {
              updatedNames.push(payload.new);
            }
            
            return updatedNames.sort((a, b) => b.votes - a.votes);
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNewName = (name: string) => {
    if (!isVotingPeriod()) {
      setError('Voting has not started yet or has already ended!');
      return;
    }

    if (containsProfanity(name)) {
      setError('Please suggest appropriate names only!');
      return;
    }

    if (names.some(n => n.text.toLowerCase() === name.toLowerCase())) {
      setError('This name has already been suggested. Click it to vote!');
      return;
    }

    setPendingSubmission(name);
    setIsModalOpen(true);
  };

  const handleSubmitterName = async (submitterName: string) => {
    if (pendingSubmission) {
      const newName: BotName = {
        id: Date.now().toString(),
        text: pendingSubmission,
        votes: 1,
        submitter: submitterName
      };

      const success = await saveNameToSupabase(newName);
      if (!success) {
        setError('Failed to save the name. Please try again.');
        return;
      }

      setIsModalOpen(false);
      setPendingSubmission(null);
      setError('');
    }
  };

  const handleVote = useCallback(async (id: string) => {
    if (!isVotingPeriod()) {
      setError('Voting has not started yet or has already ended!');
      return;
    }

    const nameToUpdate = names.find(name => name.id === id);
    if (nameToUpdate) {
      const updatedVotes = nameToUpdate.votes + 1;
      const success = await updateVoteInSupabase(id, updatedVotes);
      
      if (!success) {
        setError('Failed to update vote. Please try again.');
        return;
      }
    }
    setError('');
  }, [names]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

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