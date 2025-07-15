// VALOMATE JavaScript Application
// API Configuration
const API_BASE_URL = './api'; // PHP API endpoint'leri

// Profile images for random assignment
const PROFILE_IMAGES = [
    'https://premate.gg/media/ProfilePhoto/6555f050fde654c6e1470b67_fronted-pep_07.webp',
    'https://premate.gg/media/ProfilePhoto/13926044.webp',
    'https://premate.gg/media/ProfilePhoto/6555f04faec7caa690ffe92e_fronted-pep_03.webp',
    'https://premate.gg/media/ProfilePhoto/ec4d0b3ecb9585568283b34a2b673885.webp',
    'https://premate.gg/media/ProfilePhoto/6555f050306f1ab1294b72b7_fronted-pep_05.webp',
    'https://premate.gg/media/ProfilePhoto/6555f0501b5a124003df1440_fronted-pep_08.webp'
];

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

// Application State
let state = {
    players: [],
    filteredPlayers: [],
    totalPlayers: 0,
    filters: {
        gameMode: 'Tümü',
        lookingFor: 'Tümü',
        micOnly: false
    },
    searchTerm: '',
    loading: false,
    currentStep: 0,
    formData: {
        username: '',
        tag: '',
        lobby_code: '',
        min_rank: 'Demir',
        max_rank: 'Radyant',
        looking_for: '',
        game_mode: '',
        mic_enabled: true
    }
};

// Utility Functions
function getRandomProfileImage(username) {
    const hash = username.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    const index = Math.abs(hash) % PROFILE_IMAGES.length;
    return PROFILE_IMAGES[index];
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');
    
    const bgColor = type === 'success' ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700';
    const icon = type === 'success' ? '✓' : '⚠';
    
    toast.className = `fixed top-4 right-4 z-50 animate-slide-in`;
    toast.firstElementChild.className = `bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10`;
    
    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function updatePlayerCountBadge(count, total = 0) {
    const badge = document.getElementById('playerCountBadge');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const totalText = document.getElementById('totalText');
    const activeDot = document.getElementById('activeDot');
    const tooltipActive = document.getElementById('tooltipActive');
    const tooltipTotal = document.getElementById('tooltipTotal');
    const tooltipTotalText = document.getElementById('tooltipTotalText');
    
    // Update badge color
    let badgeColor = 'bg-red-600/20 text-red-400 border-red-500/30';
    let icon = '😴';
    
    if (count > 0) {
        if (count <= 5) {
            badgeColor = 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
            icon = '🎯';
        } else {
            badgeColor = 'bg-green-600/20 text-green-400 border-green-500/30';
            icon = '🔥';
        }
    }
    
    badge.className = `group relative ${badgeColor} border rounded-xl px-3 py-1.5 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm`;
    
    statusIcon.textContent = icon;
    statusText.textContent = count === 0 ? 'Oyuncu yok' : (count === 1 ? '1 oyuncu' : `${count} oyuncu`);
    
    // Show/hide active dot
    if (count > 0) {
        activeDot.classList.remove('hidden');
    } else {
        activeDot.classList.add('hidden');
    }
    
    // Update tooltip
    tooltipActive.textContent = `Aktif: ${count}`;
    
    if (total > 0 && state.searchTerm) {
        totalText.textContent = `/ ${total}`;
        totalText.classList.remove('hidden');
        tooltipTotalText.textContent = `Toplam: ${total}`;
        tooltipTotal.classList.remove('hidden');
    } else {
        totalText.classList.add('hidden');
        tooltipTotal.classList.add('hidden');
    }
}

// API Functions
async function fetchPlayers() {
    try {
        state.loading = true;
        showLoadingState();
        
        let url = `${API_BASE_URL}/players.php?game=valorant`;
        
        if (state.filters.gameMode !== 'Tümü') {
            url += `&game_mode=${encodeURIComponent(state.filters.gameMode)}`;
        }
        if (state.filters.lookingFor !== 'Tümü') {
            url += `&looking_for=${encodeURIComponent(state.filters.lookingFor)}`;
        }
        if (state.filters.micOnly) {
            url += `&mic_only=true`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            state.players = data;
            
            // Fetch total players for comparison if filters are applied
            if (state.filters.gameMode !== 'Tümü' || state.filters.lookingFor !== 'Tümü' || state.filters.micOnly) {
                const totalResponse = await fetch(`${API_BASE_URL}/players.php?game=valorant`);
                const totalData = await totalResponse.json();
                state.totalPlayers = totalData.length;
            } else {
                state.totalPlayers = data.length;
            }
            
            applySearchFilter();
            renderPlayers();
        } else {
            showToast(data.error || 'Oyuncular yüklenirken hata oluştu!', 'error');
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        showToast('Oyuncular yüklenirken hata oluştu!', 'error');
    } finally {
        state.loading = false;
    }
}

async function addPlayer(playerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/players.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...playerData,
                game: 'valorant'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Oyuncu başarıyla eklendi!');
            fetchPlayers();
            return true;
        } else {
            showToast(data.error || 'Oyuncu eklenirken hata oluştu!', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error adding player:', error);
        showToast('Oyuncu eklenirken hata oluştu!', 'error');
        return false;
    }
}

async function copyLobbyCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        showToast('Lobi kodu kopyalandı!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Lobi kodu kopyalandı!');
    }
}

// Filter and Search Functions
function applySearchFilter() {
    if (state.searchTerm) {
        state.filteredPlayers = state.players.filter(player =>
            player.username.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            player.tag.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
    } else {
        state.filteredPlayers = state.players;
    }
    
    updatePlayerCountBadge(state.filteredPlayers.length, state.totalPlayers);
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    const searchSpinner = document.getElementById('searchSpinner');
    
    searchIcon.classList.add('hidden');
    searchSpinner.classList.remove('hidden');
    
    setTimeout(() => {
        state.searchTerm = searchInput.value;
        applySearchFilter();
        renderPlayers();
        
        searchIcon.classList.remove('hidden');
        searchSpinner.classList.add('hidden');
    }, 300);
}

// Render Functions
function showLoadingState() {
    const tableBody = document.getElementById('playersTableBody');
    const cardContainer = document.getElementById('playersCardContainer');
    
    // Desktop loading
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="p-6">
                <div class="animate-pulse space-y-4">
                    ${Array(3).fill(0).map(() => `
                        <div class="bg-gray-800/50 rounded-xl p-4 space-y-3">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-gray-700 rounded-full skeleton"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-gray-700 rounded w-3/4 skeleton"></div>
                                    <div class="h-3 bg-gray-700 rounded w-1/2 skeleton"></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div class="h-3 bg-gray-700 rounded skeleton"></div>
                                <div class="h-3 bg-gray-700 rounded skeleton"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </td>
        </tr>
    `;
    
    // Mobile loading
    cardContainer.innerHTML = `
        <div class="animate-pulse space-y-4">
            ${Array(3).fill(0).map(() => `
                <div class="bg-gray-800/50 rounded-xl p-4 space-y-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gray-700 rounded-full skeleton"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-700 rounded w-3/4 skeleton"></div>
                            <div class="h-3 bg-gray-700 rounded w-1/2 skeleton"></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="h-3 bg-gray-700 rounded skeleton"></div>
                        <div class="h-3 bg-gray-700 rounded skeleton"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPlayers() {
    const tableBody = document.getElementById('playersTableBody');
    const cardContainer = document.getElementById('playersCardContainer');
    
    if (state.filteredPlayers.length === 0) {
        renderEmptyState();
        return;
    }
    
    // Desktop table view
    tableBody.innerHTML = state.filteredPlayers.map(player => `
        <tr class="hover:bg-gray-800/50 transition-all group">
            <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-gray-700/50 group-hover:ring-red-600/50 transition-all">
                        <img src="${getRandomProfileImage(player.username)}" alt="User Avatar" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="text-white font-semibold">${player.username}</div>
                        <div class="text-red-400 text-sm font-mono">${player.tag.startsWith('#') ? player.tag : '#' + player.tag}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <button onclick="copyLobbyCode('${player.lobby_code}')" class="text-red-400 font-mono font-bold text-lg hover:text-red-300 transition-colors cursor-pointer bg-gray-800/50 px-3 py-1 rounded-lg hover:bg-gray-700/50 hover:scale-105 transform">
                    ${player.lobby_code}
                </button>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700/50 shadow-lg bg-gray-900/50">
                        <img src="${RANK_IMAGES[player.min_rank]}" alt="${player.min_rank}" class="w-8 h-8 object-contain" style="filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))">
                    </div>
                    <span class="text-gray-400 font-medium">→</span>
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700/50 shadow-lg bg-gray-900/50">
                        <img src="${RANK_IMAGES[player.max_rank]}" alt="${player.max_rank}" class="w-8 h-8 object-contain" style="filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))">
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm">${player.looking_for}</span>
            </td>
            <td class="px-6 py-4">
                <span class="text-gray-300 text-sm">${player.game_mode}</span>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center justify-center">
                    <span class="text-2xl transition-all ${player.mic_enabled ? 'text-red-400 animate-pulse' : 'text-red-600'}">
                        ${player.mic_enabled ? '🎤' : '❌'}
                    </span>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Mobile card view
    cardContainer.innerHTML = state.filteredPlayers.map(player => `
        <div class="bg-gray-800/50 rounded-xl p-4 space-y-4 hover:bg-gray-700/50 transition-all group">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-gray-700/50 group-hover:ring-red-600/50 transition-all">
                    <img src="${getRandomProfileImage(player.username)}" alt="User Avatar" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <div class="text-white font-semibold">${player.username}</div>
                    <div class="text-red-400 text-sm font-mono">${player.tag.startsWith('#') ? player.tag : '#' + player.tag}</div>
                </div>
                <button onclick="copyLobbyCode('${player.lobby_code}')" class="text-red-400 font-mono font-bold text-lg hover:text-red-300 transition-colors cursor-pointer bg-gray-800/50 px-3 py-1 rounded-lg hover:bg-gray-700/50 hover:scale-105 transform">
                    ${player.lobby_code}
                </button>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <div class="text-gray-400 text-xs uppercase tracking-wide">Rank Aralığı</div>
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 rounded-full overflow-hidden border border-gray-700/50 shadow-lg bg-gray-900/50">
                            <img src="${RANK_IMAGES[player.min_rank]}" alt="${player.min_rank}" class="w-6 h-6 object-contain">
                        </div>
                        <span class="text-gray-400 text-xs">→</span>
                        <div class="w-6 h-6 rounded-full overflow-hidden border border-gray-700/50 shadow-lg bg-gray-900/50">
                            <img src="${RANK_IMAGES[player.max_rank]}" alt="${player.max_rank}" class="w-6 h-6 object-contain">
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <div class="text-gray-400 text-xs uppercase tracking-wide">Mikrofon</div>
                    <div class="flex items-center">
                        <span class="text-xl ${player.mic_enabled ? 'text-red-400 animate-pulse' : 'text-red-600'}">
                            ${player.mic_enabled ? '🎤' : '❌'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <div class="text-gray-400 text-xs uppercase tracking-wide">Aranan</div>
                    <div class="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm">${player.looking_for}</div>
                </div>
                
                <div class="space-y-2">
                    <div class="text-gray-400 text-xs uppercase tracking-wide">Oyun Modu</div>
                    <div class="text-gray-300 text-sm">${player.game_mode}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEmptyState() {
    const tableBody = document.getElementById('playersTableBody');
    const cardContainer = document.getElementById('playersCardContainer');
    
    const emptyStateHTML = `
        <div class="text-center py-16">
            <div class="max-w-md mx-auto">
                <div class="relative mb-8">
                    <div class="w-24 h-24 mx-auto bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <svg class="w-12 h-12 text-red-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    <div class="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                </div>
                
                <div class="space-y-4 mb-8">
                    <h3 class="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        Henüz oyuncu yok! 🎮
                    </h3>
                    <p class="text-gray-300 text-lg">
                        İlk oyuncu sen ol ve başkalarının katılmasını sağla
                    </p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button onclick="showAddPlayerModal()" class="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2">
                        <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>İlk Oyuncu Ol</span>
                    </button>
                    
                    <button onclick="clearFilters()" class="group bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border border-gray-600/50 hover:border-gray-500/50 flex items-center space-x-2">
                        <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Filtreleri Temizle</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    tableBody.innerHTML = `<tr><td colspan="6" class="p-6">${emptyStateHTML}</td></tr>`;
    cardContainer.innerHTML = emptyStateHTML;
}

// Form Functions
function showAddPlayerModal() {
    document.getElementById('addPlayerModal').classList.remove('hidden');
    renderForm();
}

function hideAddPlayerModal() {
    document.getElementById('addPlayerModal').classList.add('hidden');
    resetForm();
}

function resetForm() {
    state.currentStep = 0;
    state.formData = {
        username: '',
        tag: '',
        lobby_code: '',
        min_rank: 'Demir',
        max_rank: 'Radyant',
        looking_for: '',
        game_mode: '',
        mic_enabled: true
    };
}

function clearFilters() {
    state.filters = {
        gameMode: 'Tümü',
        lookingFor: 'Tümü',
        micOnly: false
    };
    state.searchTerm = '';
    
    document.getElementById('gameModeFilter').value = 'Tümü';
    document.getElementById('lookingForFilter').value = 'Tümü';
    document.getElementById('micOnlyFilter').checked = false;
    document.getElementById('searchInput').value = '';
    
    fetchPlayers();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    fetchPlayers();
    
    // Auto-refresh every 30 seconds
    setInterval(fetchPlayers, 30000);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filter functionality
    document.getElementById('gameModeFilter').addEventListener('change', function() {
        state.filters.gameMode = this.value;
        fetchPlayers();
    });
    
    document.getElementById('lookingForFilter').addEventListener('change', function() {
        state.filters.lookingFor = this.value;
        fetchPlayers();
    });
    
    document.getElementById('micOnlyFilter').addEventListener('change', function() {
        state.filters.micOnly = this.checked;
        fetchPlayers();
    });
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', fetchPlayers);
    
    // Add player button
    document.getElementById('addPlayerBtn').addEventListener('click', showAddPlayerModal);
    
    // Close modal when clicking outside
    document.getElementById('addPlayerModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideAddPlayerModal();
        }
    });
});

// Global functions for button clicks
window.copyLobbyCode = copyLobbyCode;
window.showAddPlayerModal = showAddPlayerModal;
window.hideAddPlayerModal = hideAddPlayerModal;
window.clearFilters = clearFilters;