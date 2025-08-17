import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const StudyAnalytics = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'weekly', label: 'Weekly', icon: 'Calendar' },
    { id: 'categories', label: 'Categories', icon: 'PieChart' }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 3.5, tasks: 8 },
    { day: 'Tue', hours: 4.2, tasks: 12 },
    { day: 'Wed', hours: 2.8, tasks: 6 },
    { day: 'Thu', hours: 5.1, tasks: 15 },
    { day: 'Fri', hours: 3.9, tasks: 10 },
    { day: 'Sat', hours: 6.2, tasks: 18 },
    { day: 'Sun', hours: 4.5, tasks: 14 }
  ];

  const categoryData = [
    { name: 'Mathematics', value: 35, color: '#F472B6' },
    { name: 'Science', value: 28, color: '#3B82F6' },
    { name: 'Literature', value: 20, color: '#10B981' },
    { name: 'History', value: 17, color: '#F59E0B' }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface/50 rounded-lg p-4 text-center">
        <Icon name="Clock" size={24} className="text-accent mx-auto mb-2" />
        <div className="text-2xl font-bold text-foreground">{analytics?.totalHours}</div>
        <div className="text-sm text-muted-foreground">Total Hours</div>
      </div>
      <div className="bg-surface/50 rounded-lg p-4 text-center">
        <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
        <div className="text-2xl font-bold text-foreground">{analytics?.tasksCompleted}</div>
        <div className="text-sm text-muted-foreground">Tasks Done</div>
      </div>
      <div className="bg-surface/50 rounded-lg p-4 text-center">
        <Icon name="Target" size={24} className="text-secondary mx-auto mb-2" />
        <div className="text-2xl font-bold text-foreground">{analytics?.goalsAchieved}</div>
        <div className="text-sm text-muted-foreground">Goals Met</div>
      </div>
      <div className="bg-surface/50 rounded-lg p-4 text-center">
        <Icon name="TrendingUp" size={24} className="text-warning mx-auto mb-2" />
        <div className="text-2xl font-bold text-foreground">{analytics?.averageDaily}h</div>
        <div className="text-sm text-muted-foreground">Daily Avg</div>
      </div>
    </div>
  );

  const renderWeeklyChart = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="day" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1E293B', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="hours" fill="#F472B6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderCategoryChart = () => (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {categoryData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="morphic-card mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Study Analytics</h2>
        <div className="flex bg-surface rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab?.id 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-64">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'weekly' && renderWeeklyChart()}
        {activeTab === 'categories' && renderCategoryChart()}
      </div>
    </div>
  );
};

export default StudyAnalytics;