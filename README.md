# 桌遊規則助手

一個簡潔的桌遊規則查詢網站，支持規則查找、設置步驟、個人筆記和說明書連結。

## 功能特點

- ✅ 快速查找桌遊規則
- ✅ 清晰的設置步驟指南
- ✅ 個人筆記功能（本地存儲）
- ✅ 官方說明書PDF連結
- ✅ 極簡設計，專注內容
- ✅ 手機友好，隨時查閱

## 已收錄遊戲

- 璀璨寶石 (Splendor)
- 卡卡頌 (Carcassonne)

## 如何添加新遊戲

1. 打開 `app.js` 文件
2. 在 `defaultData.games` 數組中添加新遊戲對象：

```javascript
{
    "id": 3,
    "name": "遊戲名稱",
    "rules": "遊戲規則說明...",
    "setup": [
        "步驟1",
        "步驟2",
        "步驟3"
    ],
    "manual_url": "說明書PDF連結",
    "notes": ""
}
```

## 部署到 Vercel

1. Fork 或 clone 本倉庫到你的 GitHub
2. 訪問 [vercel.com](https://vercel.com)
3. 點擊 "Import Project"
4. 選擇你的 GitHub 倉庫
5. 點擊 "Deploy"

部署完成後會獲得一個固定網址，例如：`https://your-project.vercel.app`

## 技術棧

- HTML5
- CSS3（極簡風格）
- Vanilla JavaScript
- LocalStorage（本地存儲）

## 使用說明

1. 在搜索框輸入桌遊名稱
2. 點擊「查找」按鈕或按 Enter 鍵
3. 切換「規則」「設置」「筆記」標籤查看不同內容
4. 在「筆記」標籤可以寫下個人筆記並保存

## 授權

MIT License