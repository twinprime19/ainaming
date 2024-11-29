import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import CountdownTimer from '../CountdownTimer';

const Header: React.FC = () => {
  return (
    <header className="pt-4 sm:pt-6 md:pt-12 pb-4 sm:pb-6 bg-gradient-to-b from-white/50 to-transparent relative px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Bot className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-indigo-600" />
          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-500 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Đặt tên cho Trợ Lý AI của chúng ta nào!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-4 mb-4 sm:mb-6">
          Bỏ phiếu bằng cách click vào tên mình thích nhé!
        </p>
        <CountdownTimer />
      </div>
    </header>
  );
};

export default Header;