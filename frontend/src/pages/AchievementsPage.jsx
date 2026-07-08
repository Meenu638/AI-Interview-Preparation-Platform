import { useEffect, useState } from 'react';
import * as Icons from 'react-icons/fa';
import { achievementService } from '../services/misc.service';
import { useAuth } from '../context/AuthContext';
import { Card, Skeleton } from '../components/ui/Shared';
import Avatar from '../components/ui/Avatar';

const tierColors = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-gray-400 to-gray-200',
  gold: 'from-yellow-500 to-yellow-300',
  platinum: 'from-primary-500 to-accent-teal',
};

const AchievementsPage = () => {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [achRes, boardRes] = await Promise.all([
        achievementService.list(),
        achievementService.leaderboard(10),
      ]);
      setUnlocked(achRes.data.data.achievements);
      setAllBadges(achRes.data.data.allBadges);
      setLeaderboard(boardRes.data.data.leaderboard);
      setLoading(false);
    };
    load();
  }, []);

  const unlockedKeys = new Set(unlocked.map((a) => a.key));

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Achievements</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedKeys.has(badge.key);
          const Icon = Icons[badge.icon] || Icons.FaMedal;
          return (
            <Card key={badge.key} className={!isUnlocked ? 'opacity-40' : ''}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierColors[badge.tier]} flex items-center justify-center text-white text-xl mb-3`}>
                <Icon />
              </div>
              <p className="font-semibold text-sm">{badge.title}</p>
              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold text-gray-400">{badge.tier}</span>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.userId === user?._id ? 'bg-primary-600/10 border border-primary-500/30' : 'bg-surface-light'
              }`}
            >
              <span className="w-6 text-center font-bold text-gray-400">{idx + 1}</span>
              <Avatar user={entry} size="sm" />
              <span className="flex-1 text-sm font-medium">{entry.name}</span>
              <span className="text-sm font-display font-bold text-primary-400">{entry.achievementCount} badges</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AchievementsPage;
