import { motion } from 'framer-motion';
import { Stats } from '../api/rateTeam';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { BADGES } from '../constants/gamification';

interface Props {
  stats: Stats;
  onDismiss: () => void;
}

export const RatingOverlay = ({ stats, onDismiss }: Props) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const badge = BADGES.find(b => b.threshold === stats.teamsRated);

  useEffect(() => {
    let timer = setTimeout(onDismiss, 1000);
    if (badge) {
      setShowConfetti(true);
      timer = setTimeout(() => {
        setShowConfetti(false);
        onDismiss();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [onDismiss, badge]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="bg-white rounded-lg p-4 shadow-lg text-center w-64">
        <p className="font-semibold mb-2">Thanks for rating!</p>
        <div className="text-sm space-y-1">
          <p>Teams Rated: {stats.teamsRated}</p>
          <p>Streak: {stats.streak} 🔥</p>
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <motion.div
              className="bg-green-500 h-2"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xp / 100) * 100}%` }}
            />
          </div>
          <p>Level {stats.level}</p>
          <p>Top {stats.percentile}% today</p>
        </div>
        {badge && <p className="mt-2 font-bold">Unlocked: {badge.name}</p>}
      </div>
    </motion.div>
  );
};
