// @ts-nocheck
import { useState } from "react";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";

const themes = {
  cloudflare: {
    name: "cloudflare",
    bg: "#0f0f0f", border: "#1e1e1e", cardBg: "#161616", cardBorder: "#2a2a2a",
    text: "#e0e0e0", textMuted: "#888", textDim: "#555", textFaint: "#333",
    accent: "#f6821f", accentText: "#000", inputBg: "#161616", roleColor: "#f6821f",
    approveBg: "#1a3a1a", approveText: "#4caf50", approveBorder: "#2d5a2d",
    rejectBg: "#2a1a1a", rejectText: "#888", rejectBorder: "#3a2a2a",
    tabBg: "#161616", tabActiveBg: "#0f0f0f", tabText: "#555", tabActiveText: "#e0e0e0",
  },
  blue: {
    name: "blue",
    bg: "#1a1f2e", border: "#252d3d", cardBg: "#1e2535", cardBorder: "#2e3a4e",
    text: "#d8dee9", textMuted: "#7a8ba0", textDim: "#4c5a6e", textFaint: "#2e3a4e",
    accent: "#88c0d0", accentText: "#1a1f2e", inputBg: "#1e2535", roleColor: "#88c0d0",
    approveBg: "#1e2d2e", approveText: "#88c0d0", approveBorder: "#2e4a4e",
    rejectBg: "#2a2530", rejectText: "#7a8ba0", rejectBorder: "#3a3545",
    tabBg: "#1e2535", tabActiveBg: "#1a1f2e", tabText: "#4c5a6e", tabActiveText: "#d8dee9",
  },
  pinkish: {
    name: "pinkish",
    bg: "#282a36", border: "#363848", cardBg: "#2f3241", cardBorder: "#44475a",
    text: "#f8f8f2", textMuted: "#9a9bb5", textDim: "#6272a4", textFaint: "#44475a",
    accent: "#ff79c6", accentText: "#282a36", inputBg: "#2f3241", roleColor: "#ff79c6",
    approveBg: "#1e2d1e", approveText: "#50fa7b", approveBorder: "#2d4a2d",
    rejectBg: "#2d1e2d", rejectText: "#9a9bb5", rejectBorder: "#4a2d4a",
    tabBg: "#2f3241", tabActiveBg: "#282a36", tabText: "#6272a4", tabActiveText: "#f8f8f2",
  },
  light: {
    name: "light",
    bg: "#f5f5f5", border: "#e0e0e0", cardBg: "#ffffff", cardBorder: "#e0e0e0",
    text: "#1a1a1a", textMuted: "#666", textDim: "#999", textFaint: "#ccc",
    accent: "#f6821f", accentText: "#fff", inputBg: "#ffffff", roleColor: "#f6821f",
    approveBg: "#e8f5e9", approveText: "#2e7d32", approveBorder: "#c8e6c9",
    rejectBg: "#f5f5f5", rejectText: "#999", rejectBorder: "#e0e0e0",
    tabBg: "#e8e8e8", tabActiveBg: "#f5f5f5", tabText: "#999", tabActiveText: "#1a1a1a",
  },
};

const themeAccents = {
  cloudflare: "#f6821f", blue: "#88c0d0", pinkish: "#ff79c6", light: "#f6821f",
};

const getStyles = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${t.bg}; color: ${t.text};
    font-family: 'IBM Plex Sans', sans-serif;
    height: 100vh; display: flex; align-items: center; justify-content: center;
  }
  .container { width: 100%; max-width: 680px; height: 100vh; display: flex; flex-direction: column; border-left: 1px solid ${t.border}; border-right: 1px solid ${t.border}; }
  .header { padding: 16px 24px; border-bottom: 1px solid ${t.border}; display: flex; align-items: center; gap: 10px; }
  .header-dot { width: 8px; height: 8px; border-radius: 50%; background: ${t.accent}; }
  .header-title { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: ${t.textMuted}; letter-spacing: 0.05em; flex: 1; }
  .theme-switcher { display: flex; gap: 6px; }
  .theme-dot { width: 14px; height: 14px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s, transform 0.15s; }
  .theme-dot:hover { transform: scale(1.2); }
  .theme-dot.active { border-color: ${t.text}; }

  .tabs-bar {
    display: flex; align-items: center;
    border-bottom: 1px solid ${t.border};
    overflow-x: auto; scrollbar-width: none;
    background: ${t.tabBg};
  }
  .tabs-bar::-webkit-scrollbar { display: none; }
  .tab {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 16px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: ${t.tabText}; cursor: pointer; white-space: nowrap;
    border-right: 1px solid ${t.border};
    transition: color 0.15s, background 0.15s;
    background: ${t.tabBg};
  }
  .tab.active { color: ${t.tabActiveText}; background: ${t.tabActiveBg}; }
  .tab:hover:not(.active) { color: ${t.textMuted}; }
  .tab-close {
    font-size: 13px; color: ${t.textDim}; line-height: 1;
    padding: 0 2px; border-radius: 2px;
    transition: color 0.15s;
  }
  .tab-close:hover { color: ${t.accent}; }
  .tab-add {
    padding: 10px 14px;
    font-family: 'IBM Plex Mono', monospace; font-size: 14px;
    color: ${t.textDim}; cursor: pointer;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .tab-add:hover { color: ${t.accent}; }

  .messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; scrollbar-width: none; }
  .messages::-webkit-scrollbar { display: none; }
  .message { display: flex; flex-direction: column; gap: 6px; }
  .message-role { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: ${t.textDim}; letter-spacing: 0.08em; text-transform: uppercase; }
  .message.user .message-role { color: ${t.roleColor}; }
  .message-text { font-size: 14px; line-height: 1.6; color: ${t.text}; }
  .tool-card { background: ${t.cardBg}; border: 1px solid ${t.cardBorder}; border-radius: 6px; padding: 12px 16px; font-size: 13px; }
  .tool-name { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: ${t.accent}; margin-bottom: 8px; }
  .tool-input { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: ${t.textMuted}; white-space: pre-wrap; margin-bottom: 12px; }
  .tool-buttons { display: flex; gap: 8px; }
  .btn { padding: 6px 14px; font-size: 12px; font-family: 'IBM Plex Mono', monospace; border: none; border-radius: 4px; cursor: pointer; transition: opacity 0.15s; }
  .btn:hover { opacity: 0.8; }
  .btn-approve { background: ${t.approveBg}; color: ${t.approveText}; border: 1px solid ${t.approveBorder}; }
  .btn-reject { background: ${t.rejectBg}; color: ${t.rejectText}; border: 1px solid ${t.rejectBorder}; }
  .tool-result { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: ${t.textDim}; }
  .input-area { padding: 16px 24px; border-top: 1px solid ${t.border}; display: flex; gap: 10px; align-items: center; }
  .input { flex: 1; background: ${t.inputBg}; border: 1px solid ${t.cardBorder}; border-radius: 6px; padding: 10px 14px; font-size: 14px; font-family: 'IBM Plex Sans', sans-serif; color: ${t.text}; outline: none; transition: border-color 0.15s; }
  .input:focus { border-color: ${t.accent}44; }
  .input::placeholder { color: ${t.textFaint}; }
  .send-btn { background: ${t.accent}; color: ${t.accentText}; border: none; border-radius: 6px; padding: 10px 18px; font-size: 13px; font-family: 'IBM Plex Mono', monospace; cursor: pointer; transition: opacity 0.15s; }
  .send-btn:hover { opacity: 0.85; }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .clear-btn { background: none; border: none; color: ${t.textDim}; font-size: 11px; font-family: 'IBM Plex Mono', monospace; cursor: pointer; padding: 4px 0; text-align: center; transition: color 0.15s; }
  .clear-btn:hover { color: ${t.textMuted}; }
  .footer { padding: 8px 24px 16px; display: flex; justify-content: center; }
  .empty { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; }
  .empty-title { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: ${t.textFaint}; }
  .empty-sub { font-size: 12px; color: ${t.textFaint}; }
  .name-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 40px; }
  .name-screen-title { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: ${t.textDim}; letter-spacing: 0.08em; }
  .name-screen-sub { font-size: 14px; color: ${t.textMuted}; text-align: center; }
  .name-input-row { display: flex; gap: 10px; width: 100%; max-width: 360px; }
`;

function ChatTab({ tabId, userName }: { tabId: string; userName: string }) {
  const agent = useAgent({ agent: "ChatAgent", name: tabId });
  const { messages, sendMessage, clearHistory, addToolApprovalResponse, status } =
    useAgentChat({
      agent,
      onToolCall: async ({ toolCall, addToolOutput }) => {
        if (toolCall.toolName === "getUserTimezone") {
          addToolOutput({
            toolCallId: toolCall.toolCallId,
            output: {
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              localTime: new Date().toLocaleTimeString(),
            },
          });
        }
      },
    });

  return (
    <>
      <div className="messages">
        {messages.length === 0 && (
          <div className="empty">
            <span className="empty-title">no messages yet</span>
            <span className="empty-sub">try: "what's the weather in tokyo?"</span>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <span className="message-role">{msg.role === "user" ? userName : "assistant"}</span>
            {msg.parts.map((part, i) => {
              if (part.type === "text") return <span key={i} className="message-text">{part.text}</span>;
              if (part.type === "tool" && part.state === "approval-requested") {
                return (
                  <div key={part.toolCallId} className="tool-card">
                    <div className="tool-name">approval required — {part.title}</div>
                    <pre className="tool-input">{JSON.stringify(part.input, null, 2)}</pre>
                    <div className="tool-buttons">
                      <button className="btn btn-approve" onClick={() => addToolApprovalResponse({ id: part.toolCallId, approved: true })}>approve</button>
                      <button className="btn btn-reject" onClick={() => addToolApprovalResponse({ id: part.toolCallId, approved: false })}>reject</button>
                    </div>
                  </div>
                );
              }
              if (part.type === "tool" && part.state === "output-available") {
                return (
                  <div key={part.toolCallId} className="tool-card">
                    <div className="tool-name">{part.title} — done</div>
                    <pre className="tool-result">{JSON.stringify(part.output, null, 2)}</pre>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          className="input"
          placeholder="ask something..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (e.currentTarget.value.trim()) {
                sendMessage({ text: e.currentTarget.value });
                e.currentTarget.value = "";
              }
            }
          }}
        />
        <button
          className="send-btn"
          disabled={status === "streaming"}
          onClick={() => {
            const input = document.querySelector('.input') as HTMLInputElement;
            if (input?.value.trim()) {
              sendMessage({ text: input.value });
              input.value = "";
            }
          }}
        >send</button>
      </div>
      <div className="footer">
        <button className="clear-btn" onClick={clearHistory}>clear history</button>
      </div>
    </>
  );
}

export default function App() {
  const [userName, setUserName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState("");
  const [theme, setTheme] = useState("cloudflare");
  const [tabs, setTabs] = useState([{ id: "chat-1", name: "chat 1" }]);
  const [activeTab, setActiveTab] = useState("chat-1");
  const [newTabDraft, setNewTabDraft] = useState("");
  const [namingTab, setNamingTab] = useState(false);
  const t = themes[theme];

  const confirm = () => {
    if (draft.trim()) { setUserName(draft.trim()); setConfirmed(true); }
  };

  const addTab = () => setNamingTab(true);

  const confirmTab = () => {
    if (!newTabDraft.trim()) return;
    const id = `chat-${Date.now()}`;
    setTabs([...tabs, { id, name: newTabDraft.trim() }]);
    setActiveTab(id);
    setNewTabDraft("");
    setNamingTab(false);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const remaining = tabs.filter((t) => t.id !== id);
    if (remaining.length === 0) return;
    setTabs(remaining);
    if (activeTab === id) setActiveTab(remaining[remaining.length - 1].id);
  };

  const Header = () => (
    <div className="header">
      <div className="header-dot" />
      <span className="header-title">chat-agent // workers ai</span>
      <div className="theme-switcher">
        {Object.entries(themeAccents).map(([key, color]) => (
          <div key={key} className={`theme-dot ${theme === key ? "active" : ""}`}
            style={{ background: color }} title={themes[key].name} onClick={() => setTheme(key)} />
        ))}
      </div>
    </div>
  );

  if (!confirmed) {
    return (
      <>
        <style>{getStyles(t)}</style>
        <div className="container">
          <Header />
          <div className="name-screen">
            <span className="name-screen-title">welcome</span>
            <span className="name-screen-sub">what should i call you?</span>
            <div className="name-input-row">
              <input className="input" placeholder="your name..." value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirm(); }} autoFocus />
              <button className="send-btn" onClick={confirm}>go</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{getStyles(t)}</style>
      <div className="container">
        <Header />
        <div className="tabs-bar">
          {tabs.map((tab) => (
            <div key={tab.id} className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.name}
              {tabs.length > 1 && (
                <span className="tab-close" onClick={(e) => closeTab(e, tab.id)}>×</span>
              )}
            </div>
          ))}
          {namingTab ? (
            <div style={{ display: "flex", alignItems: "center", padding: "4px 8px", gap: "6px" }}>
              <input className="input" style={{ padding: "4px 8px", fontSize: "12px", width: "120px" }}
                placeholder="tab name..." value={newTabDraft} autoFocus
                onChange={(e) => setNewTabDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmTab();
                  if (e.key === "Escape") { setNamingTab(false); setNewTabDraft(""); }
                }} />
              <span className="tab-add" style={{ padding: "4px" }} onClick={confirmTab}>✓</span>
            </div>
          ) : (
            <div className="tab-add" onClick={addTab}>+</div>
          )}
        </div>
        {tabs.map((tab) => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? "contents" : "none" }}>
            <ChatTab tabId={tab.id} userName={userName} />
          </div>
        ))}
      </div>
    </>
  );
}