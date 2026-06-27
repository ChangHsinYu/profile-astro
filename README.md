# Gatsby src to Astro

這是從原本 Gatsby `src` 轉成的 Astro 專案。

## 操作方式

1. 安裝套件

   ```bash
   npm install
   ```

2. 開發預覽

   ```bash
   npm run dev
   ```

   開啟終端機顯示的本機網址，通常是 `http://localhost:4321`。

3. 正式建置

   ```bash
   ASTRO_TELEMETRY_DISABLED=1 npm run build
   ```

4. 預覽建置結果

   ```bash
   npm run preview
   ```

## 轉換重點

- Gatsby 的 `gatsby-node.js` 動態產頁改成 Astro 動態路由：
  - `src/pages/artworks/[slug].astro`
  - `src/pages/collaborations/[slug].astro`
  - `src/pages/projects/[slug].astro`
  - `src/pages/reflections/[slug].astro`
- Gatsby GraphQL 改成 `src/utils/content.js` 直接讀取 Markdown frontmatter。
- 原本 `src/pages/.../index.md` 內容搬到 `public/content/pages/.../index.md`。
- Markdown 裡的 `<img src="./...">` 會在建置時轉成 `/content/pages/.../...`。
- CV 頁內容保留為 React 元件，並由 Astro 頁面載入。
- 首頁 p5 sketch 改成 Astro 裡的瀏覽器端 script。
- 右上角新增 `CH | EN` 語言切換。預設顯示中文，使用者選擇會存在瀏覽器 `localStorage`。
- 內容頁的 Markdown 會在建置時按中文/英文段落拆開；中文內容缺少時會自動用英文補。
- Astro 開發工具列已關閉。

## 圖片注意事項

你提供的壓縮檔缺少不少原 Gatsby 專案引用的圖片，例如多數作品資料夾裡的 `img0.jpg`、`img1.jpg`，以及 `codearts` 圖片。現在頁面會正常建置；缺圖的列表卡片會顯示 `Missing image`。

之後只要把圖片補回對應資料夾即可，例如：

```text
public/content/pages/artworks/tree/img0.jpg
public/content/pages/artworks/tree/img1.jpg
public/content/pages/codearts/img-0.jpg
```

檔名要和 Markdown frontmatter 或 HTML 內的圖片路徑一致。

## 已驗證

在目前環境執行：

```bash
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

建置成功，產生 66 個靜態頁面。
