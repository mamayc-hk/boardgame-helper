// GitHub API 配置
const GITHUB_USER = 'mamayc-hk';
const GITHUB_REPO = 'boardgame-helper';
const GITHUB_BRANCH = 'main';
const DATA_PATH = 'data/games';

// 数据源
const DATA_INDEX = './data/index.json';
const GAMES_PATH = './data/games/';

// 游戏索引快取
let gamesIndex = null;
let currentGameFile = null;
let currentGameData = null;
let isEditing = false;

// DOM 元素
const searchInput = document.getElementById('game-search');
const searchBtn = document.getElementById('search-btn');
const settingsBtn = document.getElementById('settings-btn');
const categoriesList = document.getElementById('categories-list');
const categoryGamesSection = document.getElementById('category-games-section');
const categoryGamesTitle = document.getElementById('category-games-title');
const categoryGamesList = document.getElementById('category-games-list');
const rulesSection = document.getElementById('rules-section');
const gameTitle = document.getElementById('game-title');
const rulesContent = document.getElementById('rules-content');
const setupContent = document.getElementById('setup-content');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tokenModal = document.getElementById('token-modal');
const tokenInput = document.getElementById('token-input');
const saveTokenBtn = document.getElementById('save-token');
const cancelTokenBtn = document.getElementById('cancel-token');

// ===== Token 管理 =====
function getToken() {
    return localStorage.getItem('github_token');
}

function saveToken(token) {
    localStorage.setItem('github_token', token);
}

function showTokenModal() {
    tokenModal.classList.remove('hidden');
    tokenInput.value = getToken() || '';
}

function hideTokenModal() {
    tokenModal.classList.add('hidden');
}

// ===== GitHub API =====
async function updateGitHubFile(filePath, content, commitMessage) {
    const token = getToken();
    
    if (!token) {
        alert('請先設置 GitHub Token');
        showTokenModal();
        return false;
    }
    
    try {
        // 1. 获取当前文件的 SHA
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${filePath}`;
        
        const getResponse = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!getResponse.ok) {
            throw new Error('無法獲取文件信息');
        }
        
        const fileData = await getResponse.json();
        const sha = fileData.sha;
        
        // 2. 更新文件
        const updateResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: btoa(unescape(encodeURIComponent(content))),
                sha: sha,
                branch: GITHUB_BRANCH
            })
        });
        
        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.message || '更新失敗');
        }
        
        return true;
        
    } catch (error) {
        console.error('GitHub API 錯誤:', error);
        alert(`保存失敗：${error.message}`);
        return false;
    }
}

// ===== 游戏数据管理 =====
async function loadGamesIndex() {
    try {
        const cachedIndex = localStorage.getItem('games_index');
        
        if (cachedIndex) {
            gamesIndex = JSON.parse(cachedIndex);
            renderCategories();
            return;
        }
        
        const response = await fetch(DATA_INDEX);
        
        if (!response.ok) {
            throw new Error('無法載入遊戲索引');
        }
        
        gamesIndex = await response.json();
        localStorage.setItem('games_index', JSON.stringify(gamesIndex));
        renderCategories();
        
    } catch (error) {
        console.error('載入遊戲索引失敗:', error);
        alert('載入遊戲資料失敗，請重新整理頁面');
    }
}

// ===== 分类功能 =====
function renderCategories() {
    if (!gamesIndex || !gamesIndex.categories) return;
    
    const categoryButtons = gamesIndex.categories.map(cat => {
        const count = gamesIndex.games.filter(g => 
            g.categories && g.categories.includes(cat.id)
        ).length;
        
        return `
            <button class="category-btn" data-category="${cat.id}">
                <span class="category-icon">${cat.icon}</span>
                <span class="category-name">${cat.name}</span>
                <span class="category-count">(${count})</span>
            </button>
        `;
    }).join('');
    
    categoriesList.innerHTML = categoryButtons;
    
    // 添加分类按钮点击事件
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterByCategory(category);
            
            // 更新按钮状态
            document.querySelectorAll('.category-btn').forEach(b => 
                b.classList.remove('active')
            );
            btn.classList.add('active');
        });
    });
}

function filterByCategory(categoryId) {
    if (!gamesIndex) return;
    
    const filteredGames = gamesIndex.games.filter(g => 
        g.categories && g.categories.includes(categoryId)
    );
    
    const category = gamesIndex.categories.find(c => c.id === categoryId);
    
    if (!category) return;
    
    // 显示分类游戏列表区域
    categoryGamesTitle.textContent = `${category.icon} ${category.name}遊戲`;
    
    // 生成游戏列表
    const gamesHTML = filteredGames.map(game => `
        <div class="game-item" data-game-file="${game.file}">
            <div class="game-name">${game.name}</div>
            <div class="game-players">${game.players || ''}</div>
        </div>
    `).join('');
    
    categoryGamesList.innerHTML = gamesHTML;
    categoryGamesSection.classList.remove('hidden');
    
    // 隐藏规则区域（如果正在显示）
    rulesSection.classList.add('hidden');
    
    // 滚动到游戏列表
    categoryGamesSection.scrollIntoView({ behavior: 'smooth' });
    
    // 为每个游戏项添加点击事件
    document.querySelectorAll('.game-item').forEach(item => {
        item.addEventListener('click', async () => {
            const gameFile = item.dataset.gameFile;
            const gameData = await loadGameData(gameFile);
            
            if (gameData) {
                currentGameFile = gameFile;
                currentGameData = gameData;
                displayGame(gameData);
                
                // 隐藏分类游戏列表
                categoryGamesSection.classList.add('hidden');
            }
        });
    });
}

async function loadGameData(gameFile) {
    try {
        const response = await fetch(`${GAMES_PATH}${gameFile}`);
        
        if (!response.ok) {
            throw new Error(`無法載入遊戲資料: ${gameFile}`);
        }
        
        const gameData = await response.json();
        localStorage.setItem(`game_${gameFile}`, JSON.stringify(gameData));
        
        return gameData;
        
    } catch (error) {
        console.error('載入遊戲資料失敗:', error);
        return null;
    }
}

// ===== 搜索和显示 =====
async function searchGame() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert('請輸入桌遊名稱');
        return;
    }
    
    if (!gamesIndex) {
        alert('遊戲索引尚未載入，請稍候');
        return;
    }
    
    const foundGame = gamesIndex.games.find(game => 
        game.name.toLowerCase().includes(searchTerm)
    );
    
    if (foundGame) {
        const gameData = await loadGameData(foundGame.file);
        
        if (gameData) {
            currentGameFile = foundGame.file;
            currentGameData = gameData;
            displayGame(gameData);
        } else {
            alert('載入遊戲資料失敗');
        }
    } else {
        const gameList = gamesIndex.games.map(g => g.name).join('、');
        alert(`找不到該桌遊，請確認名稱或稍後添加。\n\n目前已收錄：${gameList}`);
        rulesSection.classList.add('hidden');
    }
}

function displayGame(game) {
    gameTitle.textContent = game.name;
    
    // 规则内容
    rulesContent.innerHTML = `<p style="white-space: pre-line;">${game.rules}</p>`;
    
    // 设置步骤
    if (game.setup && game.setup.length > 0) {
        setupContent.innerHTML = '<ol>' + 
            game.setup.map(step => `<li>${step}</li>`).join('') + 
            '</ol>';
    } else {
        setupContent.innerHTML = '<p>暫無設置步驟</p>';
    }
    
    rulesSection.classList.remove('hidden');
    
    // 确保不在编辑模式
    if (isEditing) {
        exitEditMode();
    } else {
        // 只更新按钮状态，不重新显示内容
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
        cancelBtn.classList.add('hidden');
    }
    
    switchTab('rules');
    rulesSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== 编辑功能 =====
function enterEditMode() {
    if (!currentGameData) return;
    
    isEditing = true;
    
    // 规则编辑
    const rulesText = currentGameData.rules || '';
    rulesContent.innerHTML = `<textarea class="edit-textarea" id="edit-rules">${rulesText}</textarea>`;
    
    // 设置编辑
    const setupText = currentGameData.setup ? currentGameData.setup.join('\n') : '';
    setupContent.innerHTML = `<textarea class="edit-textarea" id="edit-setup" placeholder="每行一個步驟">${setupText}</textarea>`;
    
    // 显示保存/取消按钮
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
    cancelBtn.classList.remove('hidden');
}

function exitEditMode() {
    isEditing = false;
    
    // 恢复显示内容
    if (currentGameData) {
        gameTitle.textContent = currentGameData.name;
        
        // 规则内容
        rulesContent.innerHTML = `<p style="white-space: pre-line;">${currentGameData.rules}</p>`;
        
        // 设置步骤
        if (currentGameData.setup && currentGameData.setup.length > 0) {
            setupContent.innerHTML = '<ol>' + 
                currentGameData.setup.map(step => `<li>${step}</li>`).join('') + 
                '</ol>';
        } else {
            setupContent.innerHTML = '<p>暫無設置步驟</p>';
        }
    }
    
    // 恢复按钮
    editBtn.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
}

async function saveChanges() {
    if (!currentGameData || !currentGameFile) return;
    
    const rulesTextarea = document.getElementById('edit-rules');
    const setupTextarea = document.getElementById('edit-setup');
    
    if (!rulesTextarea || !setupTextarea) return;
    
    // 获取编辑后的内容
    const newRules = rulesTextarea.value.trim();
    const newSetupText = setupTextarea.value.trim();
    const newSetup = newSetupText ? newSetupText.split('\n').filter(s => s.trim()) : [];
    
    // 更新数据
    currentGameData.rules = newRules;
    currentGameData.setup = newSetup;
    
    // 转换为 JSON
    const jsonContent = JSON.stringify(currentGameData, null, 2);
    
    // 保存到 GitHub
    const success = await updateGitHubFile(
        `${DATA_PATH}/${currentGameFile}`,
        jsonContent,
        `更新 ${currentGameData.name} 規則`
    );
    
    if (success) {
        alert('保存成功！網站將在 1-2 分鐘內更新');
        
        // 更新本地快取
        localStorage.setItem(`game_${currentGameFile}`, jsonContent);
        
        // 退出编辑模式
        exitEditMode();
    }
}

// ===== 标签切换 =====
function switchTab(tabName) {
    if (isEditing) {
        alert('請先保存或取消編輯');
        return;
    }
    
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-content`);
    });
}

// ===== 事件监听 =====
searchBtn.addEventListener('click', searchGame);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchGame();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

settingsBtn.addEventListener('click', showTokenModal);

saveTokenBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (token) {
        saveToken(token);
        hideTokenModal();
        alert('Token 已保存');
    } else {
        alert('請輸入 Token');
    }
});

cancelTokenBtn.addEventListener('click', hideTokenModal);

editBtn.addEventListener('click', enterEditMode);

saveBtn.addEventListener('click', saveChanges);

cancelBtn.addEventListener('click', exitEditMode);

// 初始化
loadGamesIndex();