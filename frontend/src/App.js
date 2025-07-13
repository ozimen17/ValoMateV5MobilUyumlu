import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('valorant');
  const [filters, setFilters] = useState({
    gameMode: 'Tümü',
    minRank: '',
    maxRank: '',
    voiceOnly: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
    fetchPlayers();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [selectedGame, filters]);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_URL}/api/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/players?game=${selectedGame}`;
      
      if (filters.gameMode !== 'Tümü') {
        url += `&game_mode=${encodeURIComponent(filters.gameMode)}`;
      }
      if (filters.minRank) {
        url += `&min_rank=${filters.minRank}`;
      }
      if (filters.maxRank) {
        url += `&max_rank=${filters.maxRank}`;
      }
      if (filters.voiceOnly) {
        url += `&voice_only=true`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} sa önce`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-white text-2xl font-bold">
              <span className="text-purple-400">PREMATE</span><span className="text-white">.gg</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Rapor et partner</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Skin Sıralaması</a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Game Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {games.map((game) => (
              <button
                key={game.slug}
                onClick={() => setSelectedGame(game.slug)}
                className={`relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 h-32 flex flex-col items-center justify-center border-2 transition-all hover:scale-105 ${
                  selectedGame === game.slug 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-600/20 to-pink-600/20' 
                    : 'border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <span className="text-white text-sm font-medium text-center">{game.name}</span>
                {game.slug === 'valorant' && selectedGame === game.slug && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">YOU</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Oyun Modu</label>
              <select 
                value={filters.gameMode}
                onChange={(e) => handleFilterChange('gameMode', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="Tümü">Tümü</option>
                <option value="Derecelik">Derecelik</option>
                <option value="Derecesiz">Derecesiz</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">Minimum Rank</label>
              <select 
                value={filters.minRank}
                onChange={(e) => handleFilterChange('minRank', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="">Demir</option>
                <option value="1">Bronz</option>
                <option value="2">Gümüş</option>
                <option value="3">Altın</option>
                <option value="4">Platin</option>
                <option value="5">Elmas</option>
                <option value="6">Asens</option>
                <option value="7">Ölümsüz</option>
                <option value="8">Radyant</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Maksimum Rank</label>
              <select 
                value={filters.maxRank}
                onChange={(e) => handleFilterChange('maxRank', e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="">Radyant</option>
                <option value="1">Bronz</option>
                <option value="2">Gümüş</option>
                <option value="3">Altın</option>
                <option value="4">Platin</option>
                <option value="5">Elmas</option>
                <option value="6">Asens</option>
                <option value="7">Ölümsüz</option>
                <option value="8">Radyant</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => setFilters({gameMode: 'Tümü', minRank: '', maxRank: '', voiceOnly: false})}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                🎮 Uygula / Yenile
              </button>
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left text-white px-6 py-4 font-medium">KULLANICI</th>
                  <th className="text-left text-white px-6 py-4 font-medium">OYUN MODU</th>
                  <th className="text-left text-white px-6 py-4 font-medium">LON KODU</th>
                  <th className="text-left text-white px-6 py-4 font-medium">MiK - MAKS RANK</th>
                  <th className="text-left text-white px-6 py-4 font-medium">YAŞ ARALIĞI</th>
                  <th className="text-left text-white px-6 py-4 font-medium">ARSİRAN</th>
                  <th className="text-left text-white px-6 py-4 font-medium">TAMIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">Yükleniyor...</td>
                  </tr>
                ) : players.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-400">Oyuncu bulunamadı</td>
                  </tr>
                ) : (
                  players.map((player, index) => (
                    <tr key={player.id || index} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{player.username}</div>
                            <div className="text-gray-400 text-sm">•• {getTimeAgo(player.created_at)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{player.game_mode}</td>
                      <td className="px-6 py-4">
                        <span className="text-cyan-400 font-mono">{player.rank}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">◆</span>
                          </div>
                          <span className="text-gray-300">-</span>
                          <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs">◆</span>
                          </div>
                          <span className="text-gray-300">-</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{player.age > 0 ? `${player.age} +` : '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">+ 1</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className={`p-1 rounded ${player.voice_enabled ? 'text-green-400' : 'text-gray-500'}`}>
                            🎧
                          </button>
                          <button className={`p-1 rounded ${player.mic_enabled ? 'text-green-400' : 'text-gray-500'}`}>
                            🎤
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Create Lobby Button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105">
            ✨ Oyuncu ara
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;