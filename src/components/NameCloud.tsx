import React, { useState } from 'react';
import { TagCloud } from 'react-tagcloud';
import { BotName } from '../types';
import { useSound } from '../hooks/useSound';
import { useVoteThrottle } from '../hooks/useVoteThrottle';
import { motion, AnimatePresence } from 'framer-motion';

interface NameCloudProps {
  names: BotName[];
  onVote: (id: string) => void;
}

const NameCloud: React.FC<NameCloudProps> = ({ names, onVote }) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [lastVotedId, setLastVotedId] = useState<string | null>(null);
  const { playVoteSound } = useSound();
  const { isThrottled, throttledVote } = useVoteThrottle(1000);

  const data = names.map(name => ({
    value: name.text,
    count: name.votes,
    key: name.id
  }));

  const handleVote = (tag: any) => {
    const name = names.find(n => n.text === tag.value);
    if (name) {
      throttledVote(() => {
        onVote(name.id);
        setLastVotedId(name.id);
        playVoteSound();
        
        setTimeout(() => setLastVotedId(null), 1000);
      });
    }
  };

  return (
    <div className="w-full h-[60vh] flex items-start justify-center p-2 sm:p-4">
      <TagCloud
        minSize={12}
        maxSize={32}
        tags={data}
        onClick={handleVote}
        className={`cursor-pointer select-none ${isThrottled ? 'pointer-events-none' : ''}`}
        renderer={(tag: any, size: number, color: string) => {
          const isHovered = hoveredTag === tag.key;
          const isLastVoted = lastVotedId === tag.key;
          const name = names.find(n => n.id === tag.key);
          const voteCount = name?.votes || 0;

          return (
            <motion.div
              key={tag.key}
              className="inline-block m-1 sm:m-2 relative"
              onHoverStart={() => setHoveredTag(tag.key)}
              onHoverEnd={() => setHoveredTag(null)}
              animate={{
                scale: isLastVoted ? [1, 1.4, 1] : 1,
                rotate: isLastVoted ? [0, -10, 10, 0] : 0
              }}
              transition={{
                duration: isLastVoted ? 0.5 : 0.3,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            >
              <motion.span
                className={`
                  inline-block relative z-10 cursor-pointer
                  transition-colors duration-300
                  ${isHovered ? 'text-indigo-600' : ''}
                  ${isThrottled ? 'opacity-50' : ''}
                `}
                style={{
                  fontSize: `${size}px`,
                  color: isHovered ? undefined : `hsl(${(voteCount * 60) % 360}, 70%, 50%)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  y: isHovered ? -5 : 0,
                }}
                whileHover={{
                  scale: 1.2,
                  y: -5,
                }}
                whileTap={{
                  scale: 0.95,
                  y: 0,
                }}
              >
                {tag.value}
              </motion.span>

              <AnimatePresence>
                {isLastVoted && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-indigo-500"
                        variants={{
                          hidden: { scale: 0, opacity: 0 },
                          visible: {
                            scale: 0,
                            opacity: 0,
                            x: Math.cos(i * Math.PI / 4) * 30,
                            y: Math.sin(i * Math.PI / 4) * 30,
                            transition: {
                              duration: 0.5,
                              ease: "easeOut"
                            }
                          }
                        }}
                        initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default NameCloud;