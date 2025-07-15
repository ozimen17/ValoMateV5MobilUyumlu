// Form management functions
const FORM_STEPS = [
    { title: 'Oyuncu Bilgileri', icon: '👤' },
    { title: 'Rank Tercihleri', icon: '🏆' },
    { title: 'Oyun Ayarları', icon: '⚙️' }
];

let formErrors = {};

function validateFormStep(step) {
    const errors = {};
    
    switch (step) {
        case 0:
            if (!state.formData.username.trim()) {
                errors.username = 'Kullanıcı adı gerekli';
            } else if (state.formData.username.length < 3) {
                errors.username = 'Kullanıcı adı en az 3 karakter olmalı';
            } else if (state.formData.username.length > 20) {
                errors.username = 'Kullanıcı adı en fazla 20 karakter olmalı';
            }
            
            if (!state.formData.tag.trim()) {
                errors.tag = 'Tag gerekli';
            } else if (state.formData.tag.length < 3) {
                errors.tag = 'Tag en az 3 karakter olmalı';
            } else if (state.formData.tag.length > 9) {
                errors.tag = 'Tag en fazla 9 karakter olmalı';
            }
            
            if (!state.formData.lobby_code || !state.formData.lobby_code.trim()) {
                errors.lobby_code = 'Lobi kodu gerekli';
            } else if (state.formData.lobby_code.length > 10) {
                errors.lobby_code = 'Lobi kodu en fazla 10 karakter olmalı';
            }
            break;
            
        case 1:
            const ranks = Object.keys(RANK_IMAGES);
            const minRankIndex = ranks.indexOf(state.formData.min_rank);
            const maxRankIndex = ranks.indexOf(state.formData.max_rank);
            
            if (minRankIndex > maxRankIndex) {
                errors.rank = 'Minimum rank maksimum rank\'tan yüksek olamaz';
            }
            break;
            
        case 2:
            if (!state.formData.looking_for || state.formData.looking_for.trim() === '') {
                errors.looking_for = 'Aranan kişi sayısı seçiniz';
            }
            if (!state.formData.game_mode || state.formData.game_mode.trim() === '') {
                errors.game_mode = 'Oyun modu seçiniz';
            }
            break;
    }
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
}

function renderForm() {
    const modal = document.getElementById('addPlayerModal');
    const container = modal.querySelector('.bg-gradient-to-br');
    
    container.innerHTML = `
        <!-- Modern Header -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        Oyuncu Ara
                    </h2>
                    <p class="text-gray-400 text-sm">Valorant için takım arkadaşı bul</p>
                </div>
            </div>
            <button onclick="hideAddPlayerModal()" class="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 rounded-full flex items-center justify-center transition-all hover:scale-105 group">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <!-- Enhanced Progress Bar -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
                ${FORM_STEPS.map((step, index) => `
                    <div class="flex items-center space-x-3 transition-all duration-300 ${index <= state.currentStep ? 'opacity-100' : 'opacity-50'}">
                        <div class="relative w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            index < state.currentStep 
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25' 
                                : index === state.currentStep
                                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse'
                                : 'bg-gray-800/50 text-gray-500'
                        }">
                            ${index < state.currentStep ? 
                                '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' 
                                : `<span class="text-lg">${step.icon}</span>`
                            }
                        </div>
                        <div class="hidden sm:block">
                            <div class="font-semibold transition-colors ${index <= state.currentStep ? 'text-white' : 'text-gray-500'}">
                                ${step.title}
                            </div>
                            <div class="text-xs transition-colors ${index < state.currentStep ? 'text-green-400' : 'text-gray-500'}">
                                ${index < state.currentStep ? 'Tamamlandı' : index === state.currentStep ? 'Aktif' : 'Beklemede'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500 ease-out shadow-lg" 
                     style="width: ${((state.currentStep + 1) / FORM_STEPS.length) * 100}%"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
        </div>
        
        <!-- Form Content -->
        <form id="playerForm" class="space-y-6">
            ${renderFormStep(state.currentStep)}
            
            <!-- Enhanced Navigation Buttons -->
            <div class="flex justify-between items-center pt-8 border-t border-gray-700/50">
                <button type="button" onclick="prevFormStep()" 
                        class="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            state.currentStep === 0 
                                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:scale-105 transform'
                        }" ${state.currentStep === 0 ? 'disabled' : ''}>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Geri</span>
                </button>
                
                <div class="flex items-center space-x-2">
                    <span class="text-gray-400 text-sm">
                        ${state.currentStep + 1} / ${FORM_STEPS.length}
                    </span>
                </div>
                
                ${state.currentStep < FORM_STEPS.length - 1 ? `
                    <button type="button" onclick="nextFormStep()" 
                            class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg shadow-red-500/25">
                        <span>İleri</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ` : `
                    <button type="submit" id="submitBtn"
                            class="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg shadow-green-500/25">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Oyuncu Ekle</span>
                    </button>
                `}
            </div>
        </form>
    `;
    
    // Add form event listeners
    setupFormEventListeners();
}

function renderFormStep(step) {
    switch (step) {
        case 0:
            return `
                <div class="space-y-6 animate-fade-in">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">👤</span>
                                <span>Kullanıcı Adı</span>
                                <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <input type="text" id="username" value="${state.formData.username}"
                                       class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                           formErrors.username ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                       } focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                       placeholder="Kullanıcı adınız">
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            ${formErrors.username ? `
                                <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                                    <p class="text-red-400 text-sm">${formErrors.username}</p>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">🏷️</span>
                                <span>Tag</span>
                                <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <input type="text" id="tag" value="${state.formData.tag}"
                                       class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                           formErrors.tag ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                       } focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                       placeholder="ABC123">
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                            ${formErrors.tag ? `
                                <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                                    <p class="text-red-400 text-sm">${formErrors.tag}</p>
                                </div>
                            ` : ''}
                            <div class="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                                <div class="flex items-center space-x-2 text-green-400">
                                    <span class="text-sm">💡</span>
                                    <span class="text-sm font-medium"># işareti otomatik olarak eklenir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                            <span class="text-lg">🎮</span>
                            <span>Lobi Kodu</span>
                            <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <input type="text" id="lobby_code" value="${state.formData.lobby_code}"
                                   class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                       formErrors.lobby_code ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                   } focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                   placeholder="ABC12">
                            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.586l4.243-4.243A6 6 0 0115 7z" />
                                </svg>
                            </div>
                        </div>
                        ${formErrors.lobby_code ? `
                            <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                                <p class="text-red-400 text-sm">${formErrors.lobby_code}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="bg-blue-900/20 border border-blue-500/50 rounded-xl p-4">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-blue-400">💡</span>
                            <span class="text-blue-400 font-medium">Bilgi</span>
                        </div>
                        <p class="text-gray-300 text-sm">
                            Kullanıcı adı ve tag bilgileriniz Valorant hesabınızla aynı olmalı. 
                            Lobi kodu gereklidir.
                        </p>
                    </div>
                </div>
            `;
            
        case 1:
            return `
                <div class="space-y-6 animate-fade-in">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">🏆</span>
                                <span>Minimum Rank</span>
                            </label>
                            <div class="relative">
                                <select id="min_rank" class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                    formErrors.rank ? 'border-red-500' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20 appearance-none">
                                    ${Object.keys(RANK_IMAGES).map(rank => `
                                        <option value="${rank}" ${state.formData.min_rank === rank ? 'selected' : ''}>${rank}</option>
                                    `).join('')}
                                </select>
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">🎯</span>
                                <span>Maksimum Rank</span>
                            </label>
                            <div class="relative">
                                <select id="max_rank" class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                    formErrors.rank ? 'border-red-500' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20 appearance-none">
                                    ${Object.keys(RANK_IMAGES).map(rank => `
                                        <option value="${rank}" ${state.formData.max_rank === rank ? 'selected' : ''}>${rank}</option>
                                    `).join('')}
                                </select>
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${formErrors.rank ? `
                        <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                            <p class="text-red-400 text-sm">${formErrors.rank}</p>
                        </div>
                    ` : ''}
                    
                    <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                        <div class="flex items-center space-x-2 mb-4">
                            <span class="text-white text-lg font-semibold">Seçilen Rank Aralığı</span>
                            <span class="text-2xl">🏅</span>
                        </div>
                        <div class="flex items-center justify-center space-x-6 py-4">
                            <div class="flex flex-col items-center space-y-2">
                                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-lg">
                                    <img src="${RANK_IMAGES[state.formData.min_rank]}" alt="${state.formData.min_rank}" class="w-full h-full object-contain">
                                </div>
                                <span class="text-white font-medium">${state.formData.min_rank}</span>
                                <span class="text-gray-400 text-xs">Minimum</span>
                            </div>
                            
                            <div class="flex flex-col items-center space-y-2">
                                <div class="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                                    <span class="text-gray-400 font-medium">→</span>
                                </div>
                                <span class="text-gray-400 text-xs">aralığı</span>
                            </div>
                            
                            <div class="flex flex-col items-center space-y-2">
                                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600/50 shadow-lg">
                                    <img src="${RANK_IMAGES[state.formData.max_rank]}" alt="${state.formData.max_rank}" class="w-full h-full object-contain">
                                </div>
                                <span class="text-white font-medium">${state.formData.max_rank}</span>
                                <span class="text-gray-400 text-xs">Maksimum</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        case 2:
            return `
                <div class="space-y-6 animate-fade-in">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">👥</span>
                                <span>Aranan Kişi Sayısı</span>
                                <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <select id="looking_for" class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                    formErrors.looking_for ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20 appearance-none">
                                    <option value="">Seçiniz</option>
                                    <option value="1 Kişi" ${state.formData.looking_for === '1 Kişi' ? 'selected' : ''}>1 Kişi</option>
                                    <option value="2 Kişi" ${state.formData.looking_for === '2 Kişi' ? 'selected' : ''}>2 Kişi</option>
                                    <option value="3 Kişi" ${state.formData.looking_for === '3 Kişi' ? 'selected' : ''}>3 Kişi</option>
                                    <option value="4 Kişi" ${state.formData.looking_for === '4 Kişi' ? 'selected' : ''}>4 Kişi</option>
                                    <option value="5 Kişi" ${state.formData.looking_for === '5 Kişi' ? 'selected' : ''}>5 Kişi</option>
                                </select>
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            ${formErrors.looking_for ? `
                                <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                                    <p class="text-red-400 text-sm">${formErrors.looking_for}</p>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2 text-white text-sm font-semibold mb-3">
                                <span class="text-lg">🎮</span>
                                <span>Oyun Modu</span>
                                <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <select id="game_mode" class="w-full bg-gray-800/50 text-white rounded-xl px-4 py-4 pl-12 border-2 transition-all duration-300 backdrop-blur-sm ${
                                    formErrors.game_mode ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-red-500 hover:border-gray-600'
                                } focus:outline-none focus:ring-2 focus:ring-red-500/20 appearance-none">
                                    <option value="">Seçiniz</option>
                                    <option value="Dereceli" ${state.formData.game_mode === 'Dereceli' ? 'selected' : ''}>Dereceli</option>
                                    <option value="Premier" ${state.formData.game_mode === 'Premier' ? 'selected' : ''}>Premier</option>
                                    <option value="Derecesiz" ${state.formData.game_mode === 'Derecesiz' ? 'selected' : ''}>Derecesiz</option>
                                    <option value="Tam Gaz" ${state.formData.game_mode === 'Tam Gaz' ? 'selected' : ''}>Tam Gaz</option>
                                    <option value="Özel Oyun" ${state.formData.game_mode === 'Özel Oyun' ? 'selected' : ''}>Özel Oyun</option>
                                    <option value="1vs1" ${state.formData.game_mode === '1vs1' ? 'selected' : ''}>1vs1</option>
                                    <option value="2vs2" ${state.formData.game_mode === '2vs2' ? 'selected' : ''}>2vs2</option>
                                </select>
                                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            ${formErrors.game_mode ? `
                                <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-shake">
                                    <p class="text-red-400 text-sm">${formErrors.game_mode}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-white text-lg font-semibold">Mikrofon Ayarları</h3>
                            <span class="text-2xl">🎤</span>
                        </div>
                        
                        <label class="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700/30 transition-all">
                            <input type="checkbox" id="mic_enabled" ${state.formData.mic_enabled ? 'checked' : ''} class="w-5 h-5 text-red-600 rounded focus:ring-red-500 focus:ring-2">
                            <div class="flex-1">
                                <div class="text-white font-medium">Mikrofon mevcut</div>
                                <div class="text-gray-400 text-sm">Sesli iletişim kurabilirim</div>
                            </div>
                        </label>
                        
                        <div id="micStatus" class="mt-4 p-3 rounded-lg border transition-all ${state.formData.mic_enabled ? 'bg-green-900/20 border-green-700/50' : 'bg-gray-800/20 border-gray-700/50'}">
                            <div class="flex items-center space-x-2">
                                <span class="text-sm">${state.formData.mic_enabled ? '✓' : '✗'}</span>
                                <span class="text-sm font-medium ${state.formData.mic_enabled ? 'text-green-400' : 'text-gray-400'}">
                                    ${state.formData.mic_enabled ? 'Mikrofon aktif - Sesli iletişim kurabilirsiniz' : 'Mikrofon devre dışı'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        default:
            return '';
    }
}

function setupFormEventListeners() {
    const form = document.getElementById('playerForm');
    
    // Step 0 listeners
    const usernameInput = document.getElementById('username');
    const tagInput = document.getElementById('tag');
    const lobbyCodeInput = document.getElementById('lobby_code');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            state.formData.username = e.target.value;
        });
    }
    
    if (tagInput) {
        tagInput.addEventListener('input', (e) => {
            let value = e.target.value;
            // Handle # prefix automatically
            if (value.startsWith('#')) {
                value = value.substring(1);
            }
            if (value) {
                value = '#' + value;
            }
            state.formData.tag = value;
            e.target.value = value;
        });
    }
    
    if (lobbyCodeInput) {
        lobbyCodeInput.addEventListener('input', (e) => {
            state.formData.lobby_code = e.target.value;
        });
    }
    
    // Step 1 listeners
    const minRankSelect = document.getElementById('min_rank');
    const maxRankSelect = document.getElementById('max_rank');
    
    if (minRankSelect) {
        minRankSelect.addEventListener('change', (e) => {
            state.formData.min_rank = e.target.value;
            renderForm(); // Re-render to update preview
        });
    }
    
    if (maxRankSelect) {
        maxRankSelect.addEventListener('change', (e) => {
            state.formData.max_rank = e.target.value;
            renderForm(); // Re-render to update preview
        });
    }
    
    // Step 2 listeners
    const lookingForSelect = document.getElementById('looking_for');
    const gameModeSelect = document.getElementById('game_mode');
    const micEnabledCheck = document.getElementById('mic_enabled');
    
    if (lookingForSelect) {
        lookingForSelect.addEventListener('change', (e) => {
            state.formData.looking_for = e.target.value;
        });
    }
    
    if (gameModeSelect) {
        gameModeSelect.addEventListener('change', (e) => {
            state.formData.game_mode = e.target.value;
        });
    }
    
    if (micEnabledCheck) {
        micEnabledCheck.addEventListener('change', (e) => {
            state.formData.mic_enabled = e.target.checked;
            updateMicStatus();
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function updateMicStatus() {
    const micStatus = document.getElementById('micStatus');
    if (micStatus) {
        micStatus.className = `mt-4 p-3 rounded-lg border transition-all ${state.formData.mic_enabled ? 'bg-green-900/20 border-green-700/50' : 'bg-gray-800/20 border-gray-700/50'}`;
        micStatus.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-sm">${state.formData.mic_enabled ? '✓' : '✗'}</span>
                <span class="text-sm font-medium ${state.formData.mic_enabled ? 'text-green-400' : 'text-gray-400'}">
                    ${state.formData.mic_enabled ? 'Mikrofon aktif - Sesli iletişim kurabilirsiniz' : 'Mikrofon devre dışı'}
                </span>
            </div>
        `;
    }
}

function nextFormStep() {
    if (validateFormStep(state.currentStep)) {
        state.currentStep = Math.min(state.currentStep + 1, FORM_STEPS.length - 1);
        renderForm();
    }
}

function prevFormStep() {
    state.currentStep = Math.max(state.currentStep - 1, 0);
    renderForm();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateFormStep(state.currentStep)) {
        const submitBtn = document.getElementById('submitBtn');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Ekleniyor...</span>
        `;
        submitBtn.disabled = true;
        
        const success = await addPlayer(state.formData);
        
        if (success) {
            hideAddPlayerModal();
        } else {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }
}

// Global form functions
window.nextFormStep = nextFormStep;
window.prevFormStep = prevFormStep;