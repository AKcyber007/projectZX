import React from 'react';
import { Award, TrendingUp, Gift, Star, Trophy, Target } from 'lucide-react';

const PointsRewardsPage: React.FC = () => {
  const achievements = [
    {
      title: 'First Contract',
      description: 'Complete your first contract successfully',
      points: 100,
      achieved: true,
      icon: Target
    },
    {
      title: 'Speed Demon',
      description: 'Complete 5 contracts within a week',
      points: 250,
      achieved: true,
      icon: TrendingUp
    },
    {
      title: 'Top Performer',
      description: 'Maintain 95%+ success rate for 10 contracts',
      points: 500,
      achieved: false,
      icon: Trophy,
      progress: 8
    },
    {
      title: 'Volume Master',
      description: 'Handle contracts worth ₹10 lakhs+',
      points: 750,
      achieved: false,
      icon: Star,
      progress: 6.2
    }
  ];

  const recentActivities = [
    { action: 'Contract Completed', contract: 'Steel Rods Purchase', points: '+50', date: '2 hours ago' },
    { action: 'Verification Complete', contract: 'Logistics Service', points: '+25', date: '1 day ago' },
    { action: 'Quick Response Bonus', contract: 'Electronic Components', points: '+15', date: '2 days ago' },
    { action: 'Contract Posted', contract: 'Aluminum Sheets', points: '+10', date: '3 days ago' },
    { action: 'Profile Completion', contract: 'Account Setup', points: '+20', date: '1 week ago' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', company: 'MetalWorks Industries', points: 2850 },
    { rank: 2, name: 'Priya Sharma', company: 'TechSource Ltd', points: 2650 },
    { rank: 3, name: 'You', company: 'Your Company', points: 1250 },
    { rank: 4, name: 'Amit Patel', company: 'Global Trading Co', points: 1180 },
    { rank: 5, name: 'Sneha Reddy', company: 'LogiCorp Solutions', points: 1050 }
  ];

  const rewards = [
    { name: 'Premium Membership (3 months)', cost: 1000, available: true },
    { name: 'Featured Contract Listing', cost: 500, available: true },
    { name: 'Priority Support Access', cost: 750, available: true },
    { name: 'Advanced Analytics Dashboard', cost: 1200, available: false },
    { name: 'Custom Branding Package', cost: 2000, available: false }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Points & Rewards</h1>
        <p className="text-gray-600 mt-2">Track your achievements and redeem exciting rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100">Total Points</p>
              <p className="text-3xl font-bold mt-2">1,250</p>
              <p className="text-sm text-primary-100 mt-1">+125 this month</p>
            </div>
            <Award className="w-12 h-12 text-primary-200" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Current Rank</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">#3</p>
              <p className="text-sm text-green-600 mt-1">↑ 2 positions</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Achievements</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">2/4</p>
              <p className="text-sm text-gray-500 mt-1">Unlocked</p>
            </div>
            <Star className="w-12 h-12 text-accent-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Achievements */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
              <p className="text-sm text-gray-600 mt-1">Complete challenges to earn points</p>
            </div>
            <div className="p-6 space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-lg border ${achievement.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${achievement.achieved ? 'bg-green-100' : 'bg-gray-200'}`}>
                        <achievement.icon className={`w-5 h-5 ${achievement.achieved ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        {achievement.progress && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${(achievement.progress / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${achievement.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.points} pts
                      </span>
                      {achievement.achieved && (
                        <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest point-earning actions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.contract}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{activity.points}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
              <p className="text-sm text-gray-600 mt-1">Top performers this month</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${user.name === 'You' ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{user.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Store */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Reward Store</h2>
              <p className="text-sm text-gray-600 mt-1">Redeem your points for benefits</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{reward.name}</p>
                      <p className="text-sm text-primary-600 font-semibold">{reward.cost} points</p>
                    </div>
                    <button 
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        reward.available 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!reward.available}
                    >
                      {reward.available ? 'Redeem' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsRewardsPage;