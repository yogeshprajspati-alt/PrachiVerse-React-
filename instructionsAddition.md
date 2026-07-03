# 📖 Prachi Verse: How to Add New Diaries or Projects

This guide explains how to add new content to the **Prachi Verse** dashboard. You can add content in two ways:
1.  **Static HTML (The Easy Way)**: Copy-pasting existing HTML folders.
2.  **React Component (The Modern Way)**: Building new pages directly in React.

---

## ✅ Method 1: The "Copy-Paste" Method (For HTML/CSS Projects)
Use this method if you have a folder with `index.html`, css, and images (like "Just Prachi" folders) and want to add it quickly.

### Step 1: Copy Your Folder
1.  Navigate to your project folder: `React-PrachiVerse\public\`.
2.  **Copy** your new diary folder (e.g., `NewDiaryFolder`) into this `public` directory.
    *   *Example Path*: `React-PrachiVerse\public\NewDiaryFolder\index.html`

### Step 2: Add to Dashboard
1.  Open the file: `src\data\dashboardData.js`.
2.  Find the `items` array for the category you want (e.g., "Diaries").
3.  Add a new block like this:

```javascript
{
    title: "My New Diary",               // Title shown on the card
    icon: "📔",                          // Emoji icon
    description: "A short description",  // Subtitle text
    date: "29 Jan 2026",                 // Date or Badge text
    badge: "New",                        // Top-right badge (e.g., New, Featured)
    // IMPORTANT: Use the format below. 
    // It MUST start with '/view?src=' followed by the path inside 'public'
    link: "/view?src=/NewDiaryFolder/index.html", 
    isExternal: false                    // Keep this false to use the app's viewer
},
```

### Step 3: Save and Test
*   Save the file.
*   The new card will immediately appear on the Dashboard.
*   Clicking it will open your HTML file inside the application frame!

---

## ⚛️ Method 2: The "React" Method (For New Features)
Use this method if you are building a new page from scratch using React components.

### Step 1: Create the Page
1.  Go to `src\pages\`.
2.  Create a new folder (e.g., `MyNewMemory`).
3.  Create your generic component file (e.g., `MyNewMemory.jsx`) and styles.

### Step 2: Add the Route
1.  Open `src\App.jsx`.
2.  Import your component at the top:
    ```javascript
    import MyNewMemory from './pages/MyNewMemory/MyNewMemory';
    ```
3.  Add the route inside the `<Route element={<DashboardLayout />}>` block:
    ```javascript
    <Route path="/diaries/my-new-memory" element={<MyNewMemory />} />
    ```

### Step 3: Add to Dashboard
1.  Open `src\data\dashboardData.js`.
2.  Add the new block:
    ```javascript
    {
        title: "My React Memory",
        icon: "✨",
        description: "Built with React",
        date: "Today",
        badge: "Modern",
        link: "/diaries/my-new-memory",  // Match the path from Step 2
        isExternal: false
    },
    ```

---

## 🛠️ Comparison
| Feature | Method 1 (Static) | Method 2 (React) |
| :--- | :--- | :--- |
| **Best For** | Existing HTML folders, quick additions | New games, complex logic |
| **Difficulty** | ⭐ Easy (Copy-Paste) | ⭐⭐⭐ Advanced (Coding) |
| **Animations** | Preserves original CSS/JS exactly | Needs to be rewritten in React |
| **Editing** | Edit `index.html` directly | Edit `.jsx` files |

**Recommendation**: For all your existing "Just Prachi" diaries, use **Method 1**. It is the fastest and guarantees the exact original design.
