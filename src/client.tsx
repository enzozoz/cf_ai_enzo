// @ts-nocheck
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0f0f0f;
    color: #e0e0e0;
    font-family: 'IBM Plex Sans', sans-serif;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 100%;
    max-width: 680px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #1e1e1e;
    border-right: 1px solid #1e1e1e;
  }

  .header {
    padding: 20px 24px;
    border-bottom: 1px solid #1e1e1e;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f6821f;
  }

  .header-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #888;
    letter-spacing: 0.05em;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scrollbar-width: none;
  }

  .messages::-webkit-scrollbar { display: none; }

  .message { display: flex; flex-direction: column; gap: 6px; }

  .message-role {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #555;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .message.user .message-role { color: #f6821f; }

  .message-text {
    font-size: 14px;
    line-height: 1.6;
    color: #d4d4d4;
  }

  .tool-card {
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 13px;
  }

  .tool-name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #f6821f;
    margin-bottom: 8px;
  }

  .tool-input {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #888;
    white-space: pre-wrap;
    margin-bottom: 12px;
  }

  .tool-buttons { display: flex; gap: 8px; }

  .btn {
    padding: 6px 14px;
    font-size: 12px;
    font-family: 'IBM Plex Mono', monospace;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn:hover { opacity: 0.8; }
  .btn-approve { background: #1a3a1a; color: #4caf50; border: 1px solid #2d5a2d; }
  .btn-reject { background: #2a1a1a; color: #888; border: 1px solid #3a2a2a; }

  .tool-result {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #555;
  }

  .input-area {
    padding: 16px 24px;
    border-top: 1px solid #1e1e1e;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .input {
    flex: 1;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: 'IBM Plex Sans', sans-serif;
    color: #e0e0e0;
    outline: none;
    transition: border-color 0.15s;
  }
  .input:focus { border-color: #f6821f44; }
  .input::placeholder { color: #444; }

  .send-btn {
    background: #f6821f;
    color: #000;
    border: none;
    border-radius: 6px;
    padding: 10px 18px;
    font-size: 13px;
    font-family: 'IBM Plex Mono', monospace;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .send-btn:hover { opacity: 0.85; }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .clear-btn {
    background: none;
    border: none;
    color: #444;
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    cursor: pointer;
    padding: 4px 0;
    text-align: center;
    transition: color 0.15s;
  }
  .clear-btn:hover { color: #888; }

  .footer {
    padding: 8px 24px 16px;
    display: flex;
    justify-content: center;
  }

  .empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    color: #333;
  }

  .empty-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
  }

  .empty-sub {
    font-size: 12px;
    color: #2a2a2a;
  }
`;

function Chat() {
  const agent = useAgent({ agent: "ChatAgent" });
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
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <div className="header-dot" />
          <span className="header-title">chat-agent // workers ai</span>
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="empty">
              <span className="empty-title">no messages yet</span>
              <span className="empty-sub">try: "what's the weather in tokyo?"</span>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <span className="message-role">{msg.role}</span>
              {msg.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={i} className="message-text">{part.text}</span>;
                }
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
            name="message"
            placeholder="ask something..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  sendMessage({ text: input.value });
                  input.value = "";
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
          >
            send
          </button>
        </div>

        <div className="footer">
          <button className="clear-btn" onClick={clearHistory}>clear history</button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return <Chat />;
}