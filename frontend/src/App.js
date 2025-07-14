import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('find-team');
  const [filters, setFilters] = useState({
    gameMode: 'Tümü',
    minRank: 'Demir',
    maxRank: 'Radyant'
  });
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    username: '',
    age: 18,
    voice_enabled: true,
    mic_enabled: true
  });

  useEffect(() => {
    fetchGames();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (selectedGame === 'find-team') {
      fetchPlayers();
    }
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
      let url = `${API_URL}/api/players?game=valorant`;
      
      if (filters.gameMode !== 'Tümü') {
        url += `&game_mode=${encodeURIComponent(filters.gameMode)}`;
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

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPlayer,
          game: 'valorant',
          game_mode: 'Derecelik',
          rank_level: Math.floor(Math.random() * 8) + 1
        }),
      });
      
      if (response.ok) {
        setNewPlayer({ username: '', age: 18, voice_enabled: true, mic_enabled: true });
        setShowAddPlayer(false);
        fetchPlayers();
        alert('Oyuncu başarıyla eklendi!');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Oyuncu eklenirken hata oluştu!');
    }
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

  const getRankIcon = (rankLevel) => {
    const rankIcons = {
      1: '🥉', 2: '🥈', 3: '🥇', 4: '💎', 5: '💎', 6: '🔥', 7: '👑', 8: '⭐'
    };
    return rankIcons[rankLevel] || '💎';
  };

  const getGameIcon = (slug) => {
    const game = games.find(g => g.slug === slug);
    return game ? game.icon : '🎮';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-white text-2xl font-bold">
              <span className="text-blue-400">PREMATE</span><span className="text-white">.gg</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors border-b border-pink-400">Rapor et partner</a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors border-b border-blue-400">Skin Sıralaması</a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Game Selection Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {games.map((game) => (
              <button
                key={game.slug}
                onClick={() => setSelectedGame(game.slug)}
                className={`relative bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 h-32 flex flex-col items-center justify-center border-2 transition-all hover:scale-105 ${
                  selectedGame === game.slug 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                    : 'border-gray-600 hover:border-blue-400'
                }`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <span className="text-white text-sm font-medium text-center leading-tight">{game.name}</span>
                {game.slug === 'find-team' && selectedGame === game.slug && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">YOU</span>
                  </div>
                )}
                {game.slug === 'find-team' && (
                  <div className="absolute top-2 left-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedGame === 'find-team' ? (
          <>
            {/* Filters */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Oyun Modu</label>
                  <select 
                    value={filters.gameMode}
                    onChange={(e) => setFilters(prev => ({...prev, gameMode: e.target.value}))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
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
                    onChange={(e) => setFilters(prev => ({...prev, minRank: e.target.value}))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Demir">Demir</option>
                    <option value="Bronz">Bronz</option>
                    <option value="Gümüş">Gümüş</option>
                    <option value="Altın">Altın</option>
                    <option value="Platin">Platin</option>
                    <option value="Elmas">Elmas</option>
                    <option value="Asens">Asens</option>
                    <option value="Ölümsüz">Ölümsüz</option>
                    <option value="Radyant">Radyant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Maksimum Rank</label>
                  <select 
                    value={filters.maxRank}
                    onChange={(e) => setFilters(prev => ({...prev, maxRank: e.target.value}))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Demir">Demir</option>
                    <option value="Bronz">Bronz</option>
                    <option value="Gümüş">Gümüş</option>
                    <option value="Altın">Altın</option>
                    <option value="Platin">Platin</option>
                    <option value="Elmas">Elmas</option>
                    <option value="Asens">Asens</option>
                    <option value="Ölümsüz">Ölümsüz</option>
                    <option value="Radyant">Radyant</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={fetchPlayers}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all w-full"
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
                      <th className="text-left text-white px-6 py-4 font-medium">MİK - MAKS RANK</th>
                      <th className="text-left text-white px-6 py-4 font-medium">YAŞ ARALIĞI</th>
                      <th className="text-left text-white px-6 py-4 font-medium">ARSİRAN</th>
                      <th className="text-left text-white px-6 py-4 font-medium">TAMİN</th>
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
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
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
                            <span className="text-cyan-400 font-mono font-bold">{player.rank}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
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
                              <span className={`text-lg ${player.voice_enabled ? 'text-green-400' : 'text-gray-500'}`}>
                                🎧
                              </span>
                              <span className={`text-lg ${player.mic_enabled ? 'text-green-400' : 'text-gray-500'}`}>
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
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{getGameIcon(selectedGame)}</div>
            <h2 className="text-white text-2xl font-bold mb-2">
              {games.find(g => g.slug === selectedGame)?.name}
            </h2>
            <p className="text-gray-400">Bu özellik yakında gelecek!</p>
          </div>
        )}

        {/* Add Player Modal */}
        {showAddPlayer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-white text-xl font-bold mb-4">Yeni Oyuncu Ekle</h3>
              <form onSubmit={handleAddPlayer} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newPlayer.username}
                    onChange={(e) => setNewPlayer(prev => ({...prev, username: e.target.value}))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Yaş</label>
                  <input
                    type="number"
                    min="12"
                    max="50"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer(prev => ({...prev, age: parseInt(e.target.value)}))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlayer.voice_enabled}
                      onChange={(e) => setNewPlayer(prev => ({...prev, voice_enabled: e.target.checked}))}
                      className="rounded"
                    />
                    <span className="text-white text-sm">🎧 Sesli</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newPlayer.mic_enabled}
                      onChange={(e) => setNewPlayer(prev => ({...prev, mic_enabled: e.target.checked}))}
                      className="rounded"
                    />
                    <span className="text-white text-sm">🎤 Mikrofon</span>
                  </label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Create Player Button */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => setShowAddPlayer(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 flex items-center space-x-2"
          >
            <span>👥</span>
            <span>Oyuncu ara</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;