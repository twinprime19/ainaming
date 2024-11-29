import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { VOTING_START, VOTING_END, isVotingPeriod, isVotingEnded } from '../utils/dateConstants';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = isVotingPeriod() ? VOTING_END : VOTING_START;
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const padNumber = (num: number): string => num.toString().padStart(2, '0');

  if (isVotingEnded()) {
    return (
      <div className="text-center text-red-600 font-bold animate-pulse">
        Voting has ended!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-5 h-5 animate-pulse" />
        <span>{isVotingPeriod() ? "Bỏ phiếu sẽ kết thúc sau:" : "Bỏ phiếu sẽ bắt đầu sau:"}</span>
      </div>
      <div className="flex gap-4 text-center">
        {[
          { label: 'Ngày', value: timeLeft.days },
          { label: 'Giờ', value: timeLeft.hours },
          { label: 'Phút', value: timeLeft.minutes },
          { label: 'Giây', value: timeLeft.seconds }
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col">
            <span className="text-2xl font-bold text-indigo-600">{padNumber(value)}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;