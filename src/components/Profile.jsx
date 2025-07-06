import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, Target, TrendingUp, DollarSign, PieChart, Bell, Save, Edit3, Calendar, CreditCard, Briefcase, MapPin, Camera, Award, Star, Activity, Shield, Globe } from 'lucide-react';
import './Profile.css';
import Navbar from './Navbar';

const Profile = () => {
  // Initialize user data from localStorage or defaults
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: 0,
    preferredCurrency: 'USD',
    financialGoal: '',
    joinDate: '',
    membershipLevel: 'Basic',
    bio: '',
  });
  
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Financial summary data from localStorage
  const [financialData, setFinancialData] = useState({
    totalSaved: 0,
    savingsGoal: 0,
    monthlySpent: 0,
    savingsRate: 0,
    creditScore: 0,
    investments: 0,
    netWorth: 0,
  });

  // Achievement data from localStorage
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Savings Champion', description: 'Maintained 60%+ savings rate for 6 months', icon: '🏆', earned: false },
    { id: 2, title: 'Budget Master', description: 'Stayed within budget for 12 consecutive months', icon: '📊', earned: false },
    { id: 3, title: 'Investment Guru', description: 'Portfolio grew by 15% this year', icon: '📈', earned: false },
    { id: 4, title: 'Goal Achiever', description: 'Reached 90% of annual savings goal', icon: '🎯', earned: false },
  ]);

  // Load data from localStorage on component mount
  useEffect(() => {
    loadUserData();
    loadFinancialData();
    loadAchievements();
    setDataLoaded(true);
  }, []);

  // Save user data to localStorage whenever user state changes
  useEffect(() => {
    if (dataLoaded) {
      saveUserData();
    }
  }, [user, dataLoaded]);

  // Save financial data to localStorage whenever it changes
  useEffect(() => {
    if (dataLoaded) {
      saveFinancialData();
    }
  }, [financialData, dataLoaded]);

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    if (dataLoaded) {
      saveAchievements();
    }
  }, [achievements, dataLoaded]);

  const loadUserData = () => {
    const savedUser = {
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      phone: localStorage.getItem('userPhone') || '',
      address: localStorage.getItem('userAddress') || '',
      profileImage: localStorage.getItem('profileImage') || '',
      dateOfBirth: localStorage.getItem('userDateOfBirth') || '',
      occupation: localStorage.getItem('userOccupation') || '',
      monthlyIncome: parseInt(localStorage.getItem('userMonthlyIncome')) || 0,
      preferredCurrency: localStorage.getItem('userCurrency') || 'USD',
      financialGoal: localStorage.getItem('userFinancialGoal') || '',
      joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString().split('T')[0],
      membershipLevel: localStorage.getItem('userMembershipLevel') || 'Basic',
      bio: localStorage.getItem('userBio') || '',
    };
    setUser(savedUser);
  };

  const loadFinancialData = () => {
    const savedFinancialData = {
      totalSaved: parseInt(localStorage.getItem('totalSaved')) || 0,
      savingsGoal: parseInt(localStorage.getItem('savingsGoal')) || 0,
      monthlySpent: parseInt(localStorage.getItem('monthlySpent')) || 0,
      savingsRate: parseFloat(localStorage.getItem('savingsRate')) || 0,
      creditScore: parseInt(localStorage.getItem('creditScore')) || 0,
      investments: parseInt(localStorage.getItem('investments')) || 0,
      netWorth: parseInt(localStorage.getItem('netWorth')) || 0,
    };
    setFinancialData(savedFinancialData);
  };

  const loadAchievements = () => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  };

  const saveUserData = () => {
    Object.keys(user).forEach(key => {
      if (key === 'monthlyIncome') {
        localStorage.setItem('userMonthlyIncome', user[key].toString());
      } else {
        localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, user[key]);
      }
    });
  };

  const saveFinancialData = () => {
    Object.keys(financialData).forEach(key => {
      localStorage.setItem(key, financialData[key].toString());
    });
  };

  const saveAchievements = () => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  };

  const toggleEdit = () => setEditing(!editing);

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  const handleFinancialChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.name === 'savingsRate' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0) : 
      e.target.value;
    setFinancialData({ ...financialData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeProfileImage = () => {
    setUser({ ...user, profileImage: '' });
  };

  const toggleAchievement = (id) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === id 
        ? { ...achievement, earned: !achievement.earned }
        : achievement
    ));
  };

  const getMembershipBadge = () => {
    switch(user.membershipLevel) {
      case 'Premium': return { color: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'Premium' };
      case 'Gold': return { color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', text: 'Gold' };
      default: return { color: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'Basic' };
    }
  };

  const calculateSavingsRate = () => {
    if (user.monthlyIncome > 0 && financialData.monthlySpent > 0) {
      return ((user.monthlyIncome - financialData.monthlySpent) / user.monthlyIncome * 100).toFixed(1);
    }
    return financialData.savingsRate;
  };

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      {label}
    </button>
  );

  const isProfileIncomplete = () => {
    return !user.name || !user.email || !user.phone || user.monthlyIncome === 0;
  };

  return (
    <>
     <Navbar />
    <div className="profile-container">
      {/* Animated Background Elements */}
      <div className="background-animation">
        <div className="floating-orb floating-orb-1"></div>
        <div className="floating-orb floating-orb-2"></div>
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="main-title">
              Profile Dashboard
            </h1>
            <p className="subtitle">Manage your personal information and track your financial journey</p>
            {isProfileIncomplete() && (
              <div className="incomplete-notice">
                <Bell size={16} />
                <span>Complete your profile to unlock all features</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-grid">
          {/* Profile Card */}
          <div className="profile-card-container">
            <div className="profile-card">
              {/* Profile Header with Dynamic Gradient */}
              <div className="profile-card-header">
                <div className="profile-header-overlay"></div>
                <div className="profile-header-content">
                  <div className="profile-image-container">
                    <div className="profile-image">
                      {user.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt="Profile" 
                          className="profile-img"
                        />
                      ) : (
                        <div className="profile-placeholder">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User size={48} />}
                        </div>
                      )}
                    </div>
                    
                    {editing && (
                      <label className="image-upload-btn">
                        <Camera size={16} />
                        <input
                          type="file"
                          className="hidden-input"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="profile-name">
                    {user.name || 'Set Your Name'}
                  </h2>
                  <p className="profile-occupation">{user.occupation || 'Add your occupation'}</p>
                  
                  <div className={`membership-badge ${getMembershipBadge().color}`}>
                    <Star size={14} />
                    {getMembershipBadge().text} Member
                  </div>
                  
                  {user.profileImage && editing && (
                    <button 
                      onClick={removeProfileImage} 
                      className="remove-photo-btn"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="profile-card-body">
                {user.bio && !editing && (
                  <div className="bio-section">
                    <p className="bio-text">{user.bio}</p>
                  </div>
                )}

                {editing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <div className="input-container">
                        <User className="input-icon" />
                        <input
                          name="name"
                          value={user.name}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="input-container">
                        <Mail className="input-icon" />
                        <input
                          name="email"
                          type="email"
                          value={user.email}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <div className="input-container">
                        <Phone className="input-icon" />
                        <input
                          name="phone"
                          value={user.phone}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your phone"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bio</label>
                      <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Tell us about yourself..."
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <div className="input-container">
                        <Calendar className="input-icon" />
                        <input
                          name="dateOfBirth"
                          type="date"
                          value={user.dateOfBirth}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Occupation</label>
                      <div className="input-container">
                        <Briefcase className="input-icon" />
                        <input
                          name="occupation"
                          value={user.occupation}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your occupation"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Monthly Income ($)</label>
                      <div className="input-container">
                        <DollarSign className="input-icon" />
                        <input
                          name="monthlyIncome"
                          type="number"
                          value={user.monthlyIncome}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter monthly income"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <div className="input-container">
                        <MapPin className="input-icon" />
                        <textarea
                          name="address"
                          value={user.address}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Enter your address"
                          rows="2"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Financial Goal</label>
                      <textarea
                        name="financialGoal"
                        value={user.financialGoal}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Describe your financial goals..."
                        rows="2"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Membership Level</label>
                      <select
                        name="membershipLevel"
                        value={user.membershipLevel}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Gold">Gold</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={toggleEdit} 
                      className="save-btn"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="profile-info">
                    {[
                      { icon: Mail, label: 'Email', value: user.email },
                      { icon: Phone, label: 'Phone', value: user.phone },
                      { icon: Calendar, label: 'Date of Birth', value: user.dateOfBirth },
                      { icon: Briefcase, label: 'Occupation', value: user.occupation },
                      { icon: DollarSign, label: 'Monthly Income', value: user.monthlyIncome ? `$${user.monthlyIncome.toLocaleString()}` : '' },
                      { icon: MapPin, label: 'Address', value: user.address },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="info-item">
                        <div className="info-icon">
                          <Icon size={16} />
                        </div>
                        <div className="info-content">
                          <p className="info-label">{label}</p>
                          <p className="info-value">{value || 'Not set'}</p>
                        </div>
                      </div>
                    ))}

                    {user.financialGoal && (
                      <div className="goal-section">
                        <p className="goal-label">Financial Goal</p>
                        <p className="goal-text">{user.financialGoal}</p>
                      </div>
                    )}

                    <button 
                      onClick={toggleEdit} 
                      className="edit-btn"
                    >
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            {/* Navigation Tabs */}
            <div className="tabs-container">
              <div className="tabs">
                <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
                <TabButton id="financial" label="Financial" isActive={activeTab === 'financial'} onClick={setActiveTab} />
                <TabButton id="achievements" label="Achievements" isActive={activeTab === 'achievements'} onClick={setActiveTab} />
                <TabButton id="settings" label="Settings" isActive={activeTab === 'settings'} onClick={setActiveTab} />
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="tab-content">
                {/* Financial Overview Cards */}
                <div className="stats-grid">
                  <div className="stat-card stat-card-green">
                    <div className="stat-content">
                      <div className="stat-info">
                        <p className="stat-label">Net Worth</p>
                        <p className="stat-value stat-value-green">
                          ${financialData.netWorth.toLocaleString()}
                        </p>
                      </div>
                      <div className="stat-icon stat-icon-green">
                        <TrendingUp size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card stat-card-blue">
                    <div className="stat-content">
                      <div className="stat-info">
                        <p className="stat-label">Total Saved</p>
                        <p className="stat-value stat-value-blue">
                          ${financialData.totalSaved.toLocaleString()}
                        </p>
                      </div>
                      <div className="stat-icon stat-icon-blue">
                        <DollarSign size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="stat-card stat-card-purple">
                    <div className="stat-content">
                      <div className="stat-info">
                        <p className="stat-label">Credit Score</p>
                        <p className="stat-value stat-value-purple">
                          {financialData.creditScore || 'Not set'}
                        </p>
                      </div>
                      <div className="stat-icon stat-icon-purple">
                        <Shield size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goal Progress */}
                <div className="goal-progress-card">
                  <div className="goal-header">
                    <Target className="goal-icon" />
                    <h3 className="goal-title">Financial Goal Progress</h3>
                  </div>
                  
                  <div className="goal-content">
                    <div className="goal-stats">
                      <span className="goal-stat-label">Savings Goal</span>
                      <span className="goal-stat-value">
                        ${financialData.totalSaved.toLocaleString()} / ${financialData.savingsGoal.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${financialData.savingsGoal > 0 ? (financialData.totalSaved / financialData.savingsGoal) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    {user.financialGoal && (
                      <p className="goal-description">{user.financialGoal}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="tab-content">
                <div className="financial-grid">
                  <div className="financial-card">
                    <h3 className="financial-title">Monthly Breakdown</h3>
                    <div className="financial-items">
                      <div className="financial-item">
                        <span className="financial-label">Income</span>
                        <span className="financial-value financial-value-green">${user.monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="financial-item">
                        <span className="financial-label">Expenses</span>
                        <span className="financial-value financial-value-red">${financialData.monthlySpent.toLocaleString()}</span>
                      </div>
                      <div className="financial-item">
                        <span className="financial-label">Savings</span>
                        <span className="financial-value financial-value-blue">${Math.max(0, user.monthlyIncome - financialData.monthlySpent).toLocaleString()}</span>
                      </div>
                      <hr className="financial-divider" />
                      <div className="financial-item">
                        <span className="financial-label-bold">Savings Rate</span>
                        <span className="financial-value financial-value-indigo">{calculateSavingsRate()}%</span>
                      </div>
                    </div>

                    {editing && (
                      <div className="financial-edit">
                        <h4 className="edit-section-title">Edit Financial Data</h4>
                        <div className="form-group">
                          <label className="form-label">Monthly Expenses ($)</label>
                          <input
                            name="monthlySpent"
                            type="number"
                            value={financialData.monthlySpent}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter monthly expenses"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Savings Goal ($)</label>
                          <input
                            name="savingsGoal"
                            type="number"
                            value={financialData.savingsGoal}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter savings goal"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Total Saved ($)</label>
                          <input
                            name="totalSaved"
                            type="number"
                            value={financialData.totalSaved}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter total saved"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Credit Score</label>
                          <input
                            name="creditScore"
                            type="number"
                            min="300"
                            max="850"
                            value={financialData.creditScore}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter credit score (300-850)"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Investments ($)</label>
                          <input
                            name="investments"
                            type="number"
                            value={financialData.investments}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter total investments"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Net Worth ($)</label>
                          <input
                            name="netWorth"
                            type="number"
                            value={financialData.netWorth}
                            onChange={handleFinancialChange}
                            className="form-input"
                            placeholder="Enter net worth"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="financial-card">
                    <h3 className="financial-title">Investment Portfolio</h3>
                    <div className="investment-display">
                      <div className="investment-value">
                        ${financialData.investments.toLocaleString()}
                      </div>
                      <p className="investment-label">Total Investments</p>
                      <div className="investment-growth">
                        <TrendingUp size={16} />
                        <span>Portfolio Growth</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="achievements-card">
                <div className="achievements-header">
                  <Award className="achievements-icon" />
                  <h3 className="achievements-title">Achievements</h3>
                </div>
                
                <div className="achievements-grid">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`achievement-item ${achievement.earned ? 'achievement-earned' : 'achievement-locked'}`}
                      onClick={() => editing && toggleAchievement(achievement.id)}
                    >
                      <div className="achievement-content">
                        <div className="achievement-icon">{achievement.icon}</div>
                        <div className="achievement-info">
                          <h4 className="achievement-name">{achievement.title}</h4>
                          <p className="achievement-desc">{achievement.description}</p>
                          {achievement.earned && (
                            <div className="achievement-status">✓ Earned</div>
                          )}
                          {editing && (
                            <button 
                              className="achievement-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAchievement(achievement.id);
                              }}
                            >
                              {achievement.earned ? 'Mark as Not Earned' : 'Mark as Earned'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-card">
                <h3 className="settings-title">Account Settings</h3>
                
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Email Notifications</h4>
                      <p className="setting-desc">Receive updates about your financial goals</p>
                    </div>
                    <button className="setting-btn setting-btn-enabled">Enabled</button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Privacy Settings</h4>
                      <p className="setting-desc">Control who can see your financial data</p>
                    </div>
                    <button className="setting-btn setting-btn-private">Private</button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Data Export</h4>
                      <p className="setting-desc">Download your financial data</p>
                    </div>
                    <button className="setting-btn setting-btn-export">Export</button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Reset Profile</h4>
                      <p className="setting-desc">Clear all profile data and start fresh</p>
                    </div>
                    <button 
                      className="setting-btn setting-btn-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all profile data? This cannot be undone.')) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;