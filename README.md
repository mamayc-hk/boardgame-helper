# 桌遊規則助手

一個簡潔的桌遊規則查詢網站，支持規則查找、設置步驟、**直接編輯並保存到 GitHub**。

## 功能特點

- ✅ 快速查找桌遊規則
- ✅ 清晰的設置步驟指南
- ✅ **在網站上直接編輯規則和設置**
- ✅ **修改自動保存到 GitHub**
- ✅ 極簡設計，專注內容
- ✅ 手機友好，隨時查閱

## 已收錄遊戲

- 璀璨寶石 (Splendor)
- 卡卡頌 (Carcassonne)
- 富士流 (Fuji Flush)

---

## 使用說明

### 第一次使用：設置 GitHub Token

**什麼是 GitHub Token？**
- 類似密碼的訪問令牌
- 用於授權網站修改你的 GitHub 文件
- **完全免費**

**如何創建 Token？**

1. 訪問：[github.com/settings/tokens](https://github.com/settings/tokens)
2. 點擊「Generate new token」→「Generate new token (classic)」
3. 填寫：
   - **Note**: `boardgame-helper`
   - **Expiration**: `No expiration`（永不過期）
   - **Select scopes**: 勾選 `repo`
4. 點擊「Generate token」
5. **立即複製 Token**（類似 `ghp_xxxxxxxxxxxx`）

**在網站上設置 Token**

1. 點擊右上角「⚙️ 設置 Token」
2. 貼上 Token
3. 點擊「保存」

完成！現在可以編輯了。

---

### 編輯遊戲規則

**操作流程**：

1. 搜索遊戲（如「富士流」）
2. 點擊「編輯」按鈕
3. 修改規則或設置步驟
4. 點擊「保存到 GitHub」
5. 等待 1-2 分鐘，Vercel 自動更新網站

**注意事項**：
- 設置步驟：每行一個步驟
- 修改會直接更新到 GitHub 倉庫
- 需要等待 Vercel 重新部署（1-2 分鐘）

---

## 文件結構

```
boardgame-helper/
├── index.html
├── styles.css
├── app.js              ← 支持編輯功能
├── vercel.json
├── README.md
└── data/
    ├── index.json      ← 遊戲索引
    └── games/          ← 每個遊戲獨立文件
        ├── splendor.json
        ├── carcassonne.json
        └── fuji-flush.json
```

---

## 如何添加新桌遊

### 方法一：在 GitHub 上創建

1. 訪問 [github.com/mamayc-hk/boardgame-helper](https://github.com/mamayc-hk/boardgame-helper)
2. 進入 `data/games/` 文件夾
3. 點擊「Add file」→「Create new file」
4. 文件名：`新遊戲.json`
5. 內容：

```json
{
  "id": 4,
  "name": "遊戲名稱",
  "rules": "規則說明...",
  "setup": [
    "步驟1",
    "步驟2",
    "步驟3"
  ]
}
```

6. 點擊「Commit new file」
7. 更新 `data/index.json`，添加：

```json
{
  "id": 4,
  "name": "遊戲名稱",
  "file": "新遊戲.json"
}
```

### 方法二：聯繫我幫你整合

發送桌遊名稱 + 教學網站連結，我會幫你整合並創建 JSON 文件。

---

## 技術棧

- HTML5
- CSS3（極簡風格）
- Vanilla JavaScript
- GitHub API（文件更新）
- LocalStorage（Token 存儲）

---

## 安全說明

- ✅ Token 只保存在你的瀏覽器本地
- ✅ 不會上傳到任何服務器
- ✅ 只有你能訪問自己的 Token
- ✅ 可以隨時在 GitHub 撤銷 Token

---

## 授權

MIT License