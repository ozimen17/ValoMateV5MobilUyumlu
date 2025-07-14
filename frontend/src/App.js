import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Profile images for random assignment
const PROFILE_IMAGES = [
  'https://premate.gg/media/ProfilePhoto/6555f050fde654c6e1470b67_fronted-pep_07.webp',
  'https://premate.gg/media/ProfilePhoto/13926044.webp',
  'https://premate.gg/media/ProfilePhoto/6555f04faec7caa690ffe92e_fronted-pep_03.webp',
  'https://premate.gg/media/ProfilePhoto/ec4d0b3ecb9585568283b34a2b673885.webp',
  'https://premate.gg/media/ProfilePhoto/6555f050306f1ab1294b72b7_fronted-pep_05.webp',
  'https://premate.gg/media/ProfilePhoto/6555f0501b5a124003df1440_fronted-pep_08.webp'
];

// Function to get random profile image based on username
const getRandomProfileImage = (username) => {
  const hash = username.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % PROFILE_IMAGES.length;
  return PROFILE_IMAGES[index];
};

// Rank images mapping
const RANK_IMAGES = {
  'Demir': 'https://premate.gg/media/Rank/Iron_3_Rank.webp',
  'Bronz': 'https://premate.gg/media/Rank/Bronze_3_Rank.webp',
  'Gümüş': 'https://premate.gg/media/Rank/Silver_3_Rank.webp',
  'Altın': 'https://premate.gg/media/Rank/Gold_3_Rank.webp',
  'Platin': 'https://premate.gg/media/Rank/Platinum_3_Rank.webp',
  'Elmas': 'https://premate.gg/media/Rank/Diamond_3_Rank.webp',
  'Asens': 'https://premate.gg/media/Rank/Ascendant_3_Rank.webp',
  'Ölümsüz': 'https://premate.gg/media/Rank/Immortal_3_Rank.webp',
  'Radyant': 'https://premate.gg/media/Rank/Radiant_Rank.webp'
};

// Rank colors for styling
const RANK_COLORS = {
  'Demir': 'from-gray-600 to-gray-800',
  'Bronz': 'from-amber-600 to-amber-800',
  'Gümüş': 'from-gray-300 to-gray-500',
  'Altın': 'from-yellow-400 to-yellow-600',
  'Platin': 'from-blue-400 to-blue-600',
  'Elmas': 'from-cyan-400 to-cyan-600',
  'Asens': 'from-purple-400 to-purple-600',
  'Ölümsüz': 'from-red-500 to-red-700',
  'Radyant': 'from-pink-400 to-pink-600'
};

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Enhanced Toast Component
const Toast = ({ show, message, type = 'success' }) => {
  if (!show) return null;
  
  const bgColor = type === 'success' ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700';
  const icon = type === 'success' ? '✓' : '⚠';
  
  return (
    <div className={`fixed top-4 right-4 bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in backdrop-blur-md border border-white/10`}>
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
          {icon}
        </div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// Enhanced Search Component
const AdvancedSearch = ({ onSearch, playerCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (term) => {
    setIsSearching(true);
    setTimeout(() => {
      onSearch(term);
      setIsSearching(false);
    }, 300);
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Oyuncu ara..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          className="w-full bg-black/50 text-white rounded-xl px-4 py-3 pl-12 border border-gray-700 focus:border-red-500 focus:outline-none transition-all backdrop-blur-sm"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>
      <div className="absolute right-2 top-2 bg-red-600/20 text-red-400 px-2 py-1 rounded-lg text-xs font-medium">
        {playerCount} oyuncu
      </div>
    </div>
  );
};

// Multi-step Form Component
const MultiStepForm = ({ show, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    tag: '',
    lobby_code: '',
    min_rank: 'Demir',
    max_rank: 'Radyant',
    looking_for: '1 Kişi',
    game_mode: 'Dereceli',
    mic_enabled: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = [
    { title: 'Oyuncu Bilgileri', icon: '👤' },
    { title: 'Rank Tercihleri', icon: '🏆' },
    { title: 'Oyun Ayarları', icon: '⚙️' }
  ];
  
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.username.trim()) {
          newErrors.username = 'Kullanıcı adı gerekli';
        } else if (formData.username.length < 3) {
          newErrors.username = 'Kullanıcı adı en az 3 karakter olmalı';
        } else if (formData.username.length > 20) {
          newErrors.username = 'Kullanıcı adı en fazla 20 karakter olmalı';
        }
        
        if (!formData.tag.trim()) {
          newErrors.tag = 'Tag gerekli';
        } else if (!formData.tag.startsWith('#')) {
          newErrors.tag = 'Tag # ile başlamalı';
        } else if (formData.tag.length < 4) {
          newErrors.tag = 'Tag en az 4 karakter olmalı (# dahil)';
        } else if (formData.tag.length > 10) {
          newErrors.tag = 'Tag en fazla 10 karakter olmalı';
        }
        
        if (formData.lobby_code && formData.lobby_code.length > 10) {
          newErrors.lobby_code = 'Lobi kodu en fazla 10 karakter olmalı';
        }
        break;
      case 1:
        // Rank validation
        const ranks = Object.keys(RANK_IMAGES);
        const minRankIndex = ranks.indexOf(formData.min_rank);
        const maxRankIndex = ranks.indexOf(formData.max_rank);
        
        if (minRankIndex > maxRankIndex) {
          newErrors.rank = 'Minimum rank maksimum rank\'tan yüksek olamaz';
        }
        break;
      case 2:
        // Game settings validation
        if (!formData.looking_for) {
          newErrors.looking_for = 'Aranan kişi sayısı seçiniz';
        }
        if (!formData.game_mode) {
          newErrors.game_mode = 'Oyun modu seçiniz';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setCurrentStep(0);
        setFormData({
          username: '',
          tag: '',
          lobby_code: '',
          min_rank: 'Demir',
          max_rank: 'Radyant',
          looking_for: '1 Kişi',
          game_mode: 'Dereceli',
          mic_enabled: true
        });
        onClose();
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl border border-gray-800/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Oyuncu Ara
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 ${
                  index <= currentStep ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {index < currentStep ? '✓' : step.icon}
                </div>
                <span className="hidden sm:block font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 0: Player Info */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Kullanıcı Adı <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.username ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                    placeholder="Kullanıcı adınız"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Tag <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({...prev, tag: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.tag ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                    placeholder="#ABC123"
                  />
                  {errors.tag && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">{errors.tag}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Lobi Kodu
                  <span className="text-gray-400 text-xs ml-2">(boş bırakılırsa otomatik oluşur)</span>
                </label>
                <input
                  type="text"
                  value={formData.lobby_code}
                  onChange={(e) => setFormData(prev => ({...prev, lobby_code: e.target.value}))}
                  className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                    errors.lobby_code ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                  } focus:outline-none`}
                  placeholder="ABC12"
                />
                {errors.lobby_code && (
                  <p className="text-red-400 text-sm mt-1 animate-shake">{errors.lobby_code}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Step 1: Rank Preferences */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Minimum Rank</label>
                  <select
                    value={formData.min_rank}
                    onChange={(e) => setFormData(prev => ({...prev, min_rank: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.rank ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                  >
                    {Object.keys(RANK_IMAGES).map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Maksimum Rank</label>
                  <select
                    value={formData.max_rank}
                    onChange={(e) => setFormData(prev => ({...prev, max_rank: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.rank ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                  >
                    {Object.keys(RANK_IMAGES).map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {errors.rank && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm animate-shake">{errors.rank}</p>
                </div>
              )}
              
              {/* Rank Preview */}
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <p className="text-white text-sm font-medium mb-3">Seçilen Rank Aralığı:</p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img src={RANK_IMAGES[formData.min_rank]} alt={formData.min_rank} className="w-8 h-8" />
                    <span className="text-white font-medium">{formData.min_rank}</span>
                  </div>
                  <span className="text-gray-400 font-medium">→</span>
                  <div className="flex items-center space-x-2">
                    <img src={RANK_IMAGES[formData.max_rank]} alt={formData.max_rank} className="w-8 h-8" />
                    <span className="text-white font-medium">{formData.max_rank}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Game Settings */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Aranan Kişi</label>
                  <select
                    value={formData.looking_for}
                    onChange={(e) => setFormData(prev => ({...prev, looking_for: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.looking_for ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                  >
                    <option value="1 Kişi">1 Kişi</option>
                    <option value="2 Kişi">2 Kişi</option>
                    <option value="3 Kişi">3 Kişi</option>
                    <option value="4 Kişi">4 Kişi</option>
                    <option value="5 Kişi">5 Kişi</option>
                  </select>
                  {errors.looking_for && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">{errors.looking_for}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Oyun Modu</label>
                  <select
                    value={formData.game_mode}
                    onChange={(e) => setFormData(prev => ({...prev, game_mode: e.target.value}))}
                    className={`w-full bg-black/50 text-white rounded-xl px-4 py-3 border transition-all backdrop-blur-sm ${
                      errors.game_mode ? 'border-red-500' : 'border-gray-700 focus:border-red-500'
                    } focus:outline-none`}
                  >
                    <option value="Dereceli">Dereceli</option>
                    <option value="Premier">Premier</option>
                    <option value="Derecesiz">Derecesiz</option>
                    <option value="Tam Gaz">Tam Gaz</option>
                    <option value="Özel Oyun">Özel Oyun</option>
                    <option value="1vs1">1vs1</option>
                    <option value="2vs2">2vs2</option>
                  </select>
                  {errors.game_mode && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">{errors.game_mode}</p>
                  )}
                </div>
              </div>
              
              {/* Enhanced Microphone Section */}
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">Mikrofon Ayarları</h3>
                  <span className="text-2xl">🎤</span>
                </div>
                
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700/30 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.mic_enabled}
                    onChange={(e) => setFormData(prev => ({...prev, mic_enabled: e.target.checked}))}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">Mikrofon mevcut</div>
                    <div className="text-gray-400 text-sm">Sesli iletişim kurabilirim</div>
                  </div>
                </label>
                
                {formData.mic_enabled && (
                  <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-700/50">
                    <div className="flex items-center space-x-2 text-green-400">
                      <span className="text-sm">✓</span>
                      <span className="text-sm font-medium">Mikrofon aktif - Sesli iletişim kurabilirsiniz</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Game Mode Info */}
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-700/50">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-400">ℹ️</span>
                  <span className="text-blue-400 font-medium">Oyun Modu Bilgisi</span>
                </div>
                <div className="text-gray-300 text-sm">
                  <strong>{formData.game_mode}</strong> modunda <strong>{formData.looking_for}</strong> arıyorsunuz.
                  {formData.mic_enabled ? " Mikrofon ile iletişim kurabilirsiniz." : " Mikrofon kullanmayacaksınız."}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 0 
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Geri
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105"
              >
                İleri
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ekleniyor...</span>
                  </>
                ) : (
                  <span>Ekle</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filters, setFilters] = useState({
    gameMode: 'Tümü',
    lookingFor: 'Tümü',
    micOnly: false
  });
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [filters]);

  useEffect(() => {
    // Filter players based on search term
    if (searchTerm) {
      const filtered = players.filter(player =>
        player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchTerm, players]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/players?game=valorant`;
      
      if (filters.gameMode !== 'Tümü') {
        url += `&game_mode=${encodeURIComponent(filters.gameMode)}`;
      }
      if (filters.lookingFor !== 'Tümü') {
        url += `&looking_for=${encodeURIComponent(filters.lookingFor)}`;
      }
      if (filters.micOnly) {
        url += `&mic_only=true`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
      showToast('Oyuncular yüklenirken hata oluştu!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const copyLobbyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast('Lobi kodu kopyalandı!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Lobi kodu kopyalandı!');
    }
  };

  const handleAddPlayer = async (playerData) => {
    try {
      const response = await fetch(`${API_URL}/api/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...playerData,
          game: 'valorant'
        }),
      });
      
      if (response.ok) {
        fetchPlayers();
        showToast('Oyuncu başarıyla eklendi!');
      } else {
        showToast('Oyuncu eklenirken hata oluştu!', 'error');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      showToast('Oyuncu eklenirken hata oluştu!', 'error');
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes === 1) return '1 dk geçti';
    if (diffInMinutes < 180) return `${diffInMinutes} dk geçti`;
    
    // 180 dakikadan sonra saat olarak göster
    const hours = Math.floor(diffInMinutes / 60);
    if (hours === 1) return '1 sa geçti';
    return `${hours} sa geçti`;
  };

  const RankBadge = ({ rank, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10'
    };
    
    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };

    return (
      <div className="flex items-center space-x-2">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-700/50 shadow-lg bg-gray-900/50`}>
          <img 
            src={RANK_IMAGES[rank] || 'https://premate.gg/media/Rank/Iron_3_Rank.webp'} 
            alt={rank}
            className={`${sizeClasses[size]} object-contain`}
            style={{
              filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))'
            }}
          />
        </div>
        <span className={`font-semibold bg-gradient-to-r ${RANK_COLORS[rank]} bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          {rank}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* Header */}
      <header className="bg-[#030407]/90 backdrop-blur-xl border-b border-red-600/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src="https://i.hizliresim.com/14i4qc2.gif" 
              alt="VALOMATE" 
              className="h-10 w-auto"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Enhanced Search and Filters */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-gray-800/50 shadow-2xl">
          <div className="space-y-6">
            {/* Search Bar */}
            <AdvancedSearch 
              onSearch={setSearchTerm}
              playerCount={filteredPlayers.length}
            />
            
            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-white text-sm font-semibold">Oyun Modu</label>
                <select 
                  value={filters.gameMode}
                  onChange={(e) => setFilters(prev => ({...prev, gameMode: e.target.value}))}
                  className="w-full bg-black/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-red-500 focus:outline-none transition-all backdrop-blur-sm"
                >
                  <option value="Tümü">Tümü</option>
                  <option value="Dereceli">Dereceli</option>
                  <option value="Premier">Premier</option>
                  <option value="Derecesiz">Derecesiz</option>
                  <option value="Tam Gaz">Tam Gaz</option>
                  <option value="Özel Oyun">Özel Oyun</option>
                  <option value="1vs1">1vs1</option>
                  <option value="2vs2">2vs2</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-white text-sm font-semibold">Aranan Kişi</label>
                <select 
                  value={filters.lookingFor}
                  onChange={(e) => setFilters(prev => ({...prev, lookingFor: e.target.value}))}
                  className="w-full bg-black/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-red-500 focus:outline-none transition-all backdrop-blur-sm"
                >
                  <option value="Tümü">Tümü</option>
                  <option value="1 Kişi">1 Kişi</option>
                  <option value="2 Kişi">2 Kişi</option>
                  <option value="3 Kişi">3 Kişi</option>
                  <option value="4 Kişi">4 Kişi</option>
                  <option value="5 Kişi">5 Kişi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-white text-sm font-semibold">Mikrofon</label>
                <div className="flex items-center space-x-3 h-12">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.micOnly}
                      onChange={(e) => setFilters(prev => ({...prev, micOnly: e.target.checked}))}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <span className="text-white font-medium">🎤 Sadece mikrofonlu</span>
                  </label>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={fetchPlayers}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 w-full shadow-lg flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Yenile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 overflow-hidden shadow-2xl">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 backdrop-blur-sm">
                <tr>
                  <th className="text-left text-white px-6 py-4 font-semibold">KULLANICI</th>
                  <th className="text-left text-white px-6 py-4 font-semibold">LOBİ KODU</th>
                  <th className="text-left text-white px-6 py-4 font-semibold">RANK</th>
                  <th className="text-left text-white px-6 py-4 font-semibold">ARANAN</th>
                  <th className="text-left text-white px-6 py-4 font-semibold">OYUN MODU</th>
                  <th className="text-left text-white px-6 py-4 font-semibold">MİKROFON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-6">
                      <SkeletonLoader />
                    </td>
                  </tr>
                ) : filteredPlayers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg font-medium">Oyuncu bulunamadı</p>
                        <p className="text-sm">Arama kriterlerinizi değiştirin veya yeni oyuncu ekleyin</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPlayers.map((player, index) => (
                    <tr key={player.id || index} className="hover:bg-gray-800/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-gray-700/50 group-hover:ring-red-600/50 transition-all">
                            <img 
                              src={getRandomProfileImage(player.username)} 
                              alt="User Avatar" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-white font-semibold">{player.username}</div>
                            <div className="text-red-400 text-sm font-mono">#{player.tag}</div>
                            <div className="text-gray-400 text-xs">{getTimeAgo(player.created_at)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => copyLobbyCode(player.lobby_code)}
                          className="text-red-400 font-mono font-bold text-lg hover:text-red-300 transition-colors cursor-pointer bg-gray-800/50 px-3 py-1 rounded-lg hover:bg-gray-700/50 hover:scale-105 transform"
                        >
                          {player.lobby_code}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-3">
                          <RankBadge rank={player.min_rank} size="md" />
                          <span className="text-gray-400 font-medium">→</span>
                          <RankBadge rank={player.max_rank} size="md" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm">{player.looking_for}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{player.game_mode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <span className={`text-2xl transition-all ${player.mic_enabled ? 'text-red-400 animate-pulse' : 'text-gray-600'}`}>
                            🎤
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4 p-4">
            {loading ? (
              <SkeletonLoader />
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium">Oyuncu bulunamadı</p>
                  <p className="text-sm">Arama kriterlerinizi değiştirin veya yeni oyuncu ekleyin</p>
                </div>
              </div>
            ) : (
              filteredPlayers.map((player, index) => (
                <div key={player.id || index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-red-600/50 transition-all hover:transform hover:scale-102">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-gray-700/50">
                      <img 
                        src={getRandomProfileImage(player.username)} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{player.username}</div>
                      <div className="text-red-400 text-sm font-mono">#{player.tag}</div>
                      <div className="text-gray-400 text-xs">{getTimeAgo(player.created_at)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${player.mic_enabled ? 'text-red-400' : 'text-gray-600'}`}>🎤</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-400">Lobi:</span>
                      <button
                        onClick={() => copyLobbyCode(player.lobby_code)}
                        className="ml-2 text-red-400 font-mono font-bold hover:text-red-300 transition-colors"
                      >
                        {player.lobby_code}
                      </button>
                    </div>
                    <div>
                      <span className="text-gray-400">Mod:</span>
                      <span className="ml-2 text-gray-300">{player.game_mode}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Aranan:</span>
                      <span className="ml-2 text-gray-300">{player.looking_for}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RankBadge rank={player.min_rank} size="sm" />
                      <span className="text-gray-400 text-xs">→</span>
                      <RankBadge rank={player.max_rank} size="sm" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Auto-cleanup notice */}
        <div className="mt-6 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30 inline-block">
            <p className="text-gray-400 text-sm flex items-center space-x-2">
              <span className="text-yellow-400">⏰</span>
              <span>Oyuncu aramaları 30 dakika sonra otomatik olarak silinir</span>
            </p>
          </div>
        </div>

        {/* Multi-step Form Modal */}
        <MultiStepForm 
          show={showAddPlayer}
          onClose={() => setShowAddPlayer(false)}
          onSubmit={handleAddPlayer}
        />

        {/* Enhanced Floating Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <button 
            onClick={() => setShowAddPlayer(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-110 flex items-center space-x-3 border-2 border-red-500/30 backdrop-blur-sm"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span>Oyuncu Ara</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;