// 初始化資料庫
function initLocalStorage() {
    const defaultData = {
        "games": [
            {
                "id": 1,
                "name": "璀璨寶石",
                "rules": "玩家輪流進行回合，每回合可以執行以下三種行動之一：\n\n1. 拿取寶石：拿取2個相同顏色的寶石（該顏色需剩餘4個以上），或拿取3個不同顏色的寶石\n2. 購買發展卡：支付所需寶石購買場上的發展卡\n3. 預約發展卡：拿取一張發展卡和1個黃金籌碼\n\n遊戲結束條件：當有玩家達到15分時，完成當前回合，分數最高者獲勝。",
                "setup": [
                    "將所有寶石籌碼按顏色分類放置（紅、藍、綠、黑、白各7個，黃金5個）",
                    "將發展卡按等級分為三疊（I、II、III），洗勻後背面朝上放置",
                    "翻開每等級各4張發展卡（共12張）",
                    "隨機抽出5張貴族板塊，正面朝上放置",
                    "隨機決定起始玩家，開始遊戲"
                ],
                "manual_url": "https://cdn.1j1ju.com/medias/c2/b9/83-splendor-rulebook.pdf",
                "notes": ""
            },
            {
                "id": 2,
                "name": "卡卡頌",
                "rules": "玩家輪流放置板塊，可以選擇放置隨從到板塊上的道路、城市、教堂或農田。\n\n計分規則：\n- 道路：每塊板塊1分\n- 城市：每塊板塊2分，有盾牌標記額外加2分\n- 教堂：周圍9格每填滿1格得1分，最多9分\n- 農田：遊戲結束時計算，每個完成的城市旁邊的農田得3分\n\n遊戲結束：所有板塊放置完畢後，計算最終分數。",
                "setup": [
                    "將起始板塊（背面較深色）放在中央",
                    "將其他板塊洗勻，疊成一疊背面朝上",
                    "每位玩家選擇一種顏色的隨從（每人8個）",
                    "每位玩家保留1個隨從放在計分板上作為計分標記",
                    "隨機決定起始玩家"
                ],
                "manual_url": "https://cdn.1j1ju.com/medias/bc/9e/6c-carcassonne-rulebook.pdf",
                "notes": ""
            },
            {
                "id": 3,
                "name": "富士流",
                "rules": "玩家輪流出牌，目標是先出完所有手牌。\n\n核心規則：\n1. 出牌：打出一張牌放在自己面前\n2. 淘汰：如果你打出的牌比別人面前的牌大，可以淘汰那些牌\n   - 被淘汰的玩家要從牌庫抽一張牌\n3. 成功：如果牌成功度過一圈（回到自己），可以棄掉且不用抽牌\n4. 同盟：相同數字的牌可以同盟\n   - 同盟後的數值等於所有牌的總和\n   - 同盟成功時，所有參與者都不用抽牌\n   - 同盟失敗時，所有參與者都要抽牌\n\n重要提示：\n- 想加入同盟必須打出相同數字的牌（不能打其他數字）\n- 數字越小越難被淘汰，但越難成功度過一圈",
                "setup": [
                    "將所有牌洗勻",
                    "每位玩家發6張牌作為手牌",
                    "剩餘的牌作為牌庫放在中央",
                    "隨機決定起始玩家",
                    "順時針方向進行遊戲"
                ],
                "manual_url": "https://cdn.1j1ju.com/medias/2f/d4/8c-fuji-flush-rulebook.pdf",
                "notes": ""
            }
        ]
    };

    if (!localStorage.getItem('boardgames_data')) {
        localStorage.setItem('boardgames_data', JSON.stringify(defaultData));
    }
}

// DOM 元素
const searchInput = document.getElementById('game-search');
const searchBtn = document.getElementById('search-btn');
const rulesSection = document.getElementById('rules-section');
const gameTitle = document.getElementById('game-title');
const rulesContent = document.getElementById('rules-content');
const setupContent = document.getElementById('setup-content');
const notesTextarea = document.getElementById('user-notes');
const saveNotesBtn = document.getElementById('save-notes');
const manualLink = document.getElementById('manual-url');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 初始化
initLocalStorage();

// 查找遊戲
function searchGame() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert('請輸入桌遊名稱');
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('boardgames_data'));
    
    const foundGame = data.games.find(game => 
        game.name.toLowerCase().includes(searchTerm)
    );
    
    if (foundGame) {
        displayGame(foundGame);
    } else {
        alert('找不到該桌遊，請確認名稱或稍後添加。\n\n目前已收錄：璀璨寶石、卡卡頌、富士流');
        rulesSection.classList.add('hidden');
    }
}

// 顯示遊戲資訊
function displayGame(game) {
    gameTitle.textContent = game.name;
    
    // 規則內容（保留換行）
    rulesContent.innerHTML = `<p style="white-space: pre-line;">${game.rules}</p>`;
    
    // 設置步驟
    if (game.setup && game.setup.length > 0) {
        setupContent.innerHTML = '<ol>' + 
            game.setup.map(step => `<li>${step}</li>`).join('') + 
            '</ol>';
    } else {
        setupContent.innerHTML = '<p>暫無設置步驟</p>';
    }
    
    // 筆記
    notesTextarea.value = game.notes || '';
    
    // 說明書連結
    if (game.manual_url) {
        manualLink.href = game.manual_url;
        manualLink.textContent = `${game.name} 官方說明書 (PDF)`;
        manualLink.parentElement.style.display = 'block';
    } else {
        manualLink.parentElement.style.display = 'none';
    }
    
    rulesSection.classList.remove('hidden');
    
    // 默認顯示規則標籤
    switchTab('rules');
    
    // 滾動到結果區域
    rulesSection.scrollIntoView({ behavior: 'smooth' });
}

// 切換標籤
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-content`);
    });
}

// 保存筆記
function saveNotes() {
    const data = JSON.parse(localStorage.getItem('boardgames_data'));
    const currentGameName = gameTitle.textContent;
    
    const gameIndex = data.games.findIndex(
        game => game.name === currentGameName
    );
    
    if (gameIndex !== -1) {
        data.games[gameIndex].notes = notesTextarea.value;
        localStorage.setItem('boardgames_data', JSON.stringify(data));
        
        // 顯示保存成功提示
        const originalText = saveNotesBtn.textContent;
        saveNotesBtn.textContent = '已保存 ✓';
        saveNotesBtn.disabled = true;
        
        setTimeout(() => {
            saveNotesBtn.textContent = originalText;
            saveNotesBtn.disabled = false;
        }, 1500);
    }
}

// 事件監聽
searchBtn.addEventListener('click', searchGame);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchGame();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

saveNotesBtn.addEventListener('click', saveNotes);