import { useState, useRef, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@300;400&display=swap');

  /* ── LIGHT THEME ── */
  :root, [data-theme="light"] {
    --bg:            #f5f3ee;
    --bg-card:       #ffffff;
    --bg-subtle:     #ede9e1;
    --bg-hover:      #e8e3d8;
    --border:        #ddd8cc;
    --border-strong: #c9c2b4;

    --text-primary:  #1c1917;
    --text-body:     #44403c;
    --text-muted:    #78716c;
    --text-faint:    #a8a29e;

    --green:         #1e5c3a;
    --green-mid:     #2d7a52;
    --green-light:   #4ead78;
    --green-tint:    #eaf4ef;
    --green-border:  #b6ddc8;
    --green-glow:    rgba(45,122,82,0.12);

    --amber:         #b45309;
    --amber-tint:    #fef9ee;
    --amber-border:  #f5d898;

    --user-bg:       #1c1917;
    --user-text:     #fafaf9;

    --shadow-sm:     0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:     0 4px 16px rgba(0,0,0,0.08);
  }

  /* ── DARK THEME ── */
  [data-theme="dark"] {
    --bg:            #111210;
    --bg-card:       #1b1e1a;
    --bg-subtle:     #222520;
    --bg-hover:      #2a2e28;
    --border:        #2e3229;
    --border-strong: #3a3f36;

    --text-primary:  #eef0ec;
    --text-body:     #c2c9bc;
    --text-muted:    #7a8474;
    --text-faint:    #464e3e;

    --green:         #52c47a;
    --green-mid:     #3fa864;
    --green-light:   #74d99a;
    --green-tint:    #16231c;
    --green-border:  #254d36;
    --green-glow:    rgba(82,196,122,0.1);

    --amber:         #f0ab42;
    --amber-tint:    #1e1a0e;
    --amber-border:  #3d3010;

    --user-bg:       #254d36;
    --user-text:     #e6f5ec;

    --shadow-sm:     0 1px 3px rgba(0,0,0,0.35);
    --shadow-md:     0 4px 16px rgba(0,0,0,0.5);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }

  body {
    background: var(--bg);
    font-family: 'Bricolage Grotesque', sans-serif;
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s, color 0.3s;
  }

  .shell {
    height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }

  /* ambient gradients */
  .shell::before {
    content: '';
    position: fixed;
    top: -80px; right: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, var(--green-tint) 0%, transparent 68%);
    pointer-events: none;
    z-index: 0;
    transition: background 0.3s;
  }
  .shell::after {
    content: '';
    position: fixed;
    bottom: -60px; left: -60px;
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, var(--amber-tint) 0%, transparent 68%);
    pointer-events: none;
    z-index: 0;
    transition: background 0.3s;
    opacity: 0.7;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-shrink: 0;
    position: relative;
    z-index: 10;
    transition: background 0.3s, border-color 0.3s;
    animation: fadeDown 0.45s ease both;
  }

  .header-left { display: flex; align-items: center; gap: 12px; }

  .avatar {
    width: 46px; height: 46px;
    border-radius: 14px;
    background: linear-gradient(145deg, var(--green-tint), var(--bg-subtle));
    border: 1.5px solid var(--green-border);
    display: flex; align-items: center; justify-content: center;
    position: relative;
    box-shadow: var(--shadow-sm), 0 0 0 3px var(--green-glow);
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .avatar-letter {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 22px;
    color: var(--green-mid);
    line-height: 1;
    transition: color 0.3s;
  }
  .avatar-pip {
    position: absolute;
    bottom: -2px; right: -2px;
    width: 11px; height: 11px;
    background: #22c55e;
    border-radius: 50%;
    border: 2.5px solid var(--bg);
    transition: border-color 0.3s;
  }

  .header-name {
    font-family: 'Lora', serif;
    font-size: 17px;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.015em;
    line-height: 1;
    transition: color 0.3s;
  }
  .header-sub {
    font-size: 11.5px;
    font-weight: 300;
    color: var(--text-muted);
    margin-top: 3px;
    transition: color 0.3s;
  }
  .header-sub b { color: var(--green-mid); font-weight: 500; }

  .header-right { display: flex; align-items: center; gap: 8px; }

  .hdr-link {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-muted);
    padding: 6px 11px;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
  }
  .hdr-link:hover {
    background: var(--bg-subtle);
    border-color: var(--border);
    color: var(--text-primary);
  }

  .hire-badge {
    display: flex; align-items: center; gap: 6px;
    background: var(--green-tint);
    border: 1px solid var(--green-border);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11.5px;
    font-weight: 500;
    color: var(--green-mid);
    transition: all 0.3s;
  }
  .hire-pip {
    width: 6px; height: 6px;
    background: var(--green-light);
    border-radius: 50%;
    animation: pipPulse 2.2s infinite;
  }
  @keyframes pipPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.7); }
  }

  .theme-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.18s;
    flex-shrink: 0;
    user-select: none;
  }
  .theme-btn:hover {
    background: var(--bg-hover);
    border-color: var(--border-strong);
    transform: scale(1.07) rotate(12deg);
  }

  /* ── MESSAGES ── */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 28px 28px 12px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    scroll-behavior: smooth;
    position: relative;
    z-index: 1;
  }
  .messages::-webkit-scrollbar { width: 3px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── WELCOME ── */
  .welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    gap: 12px;
    animation: fadeIn 0.65s ease both;
  }
  .welcome-icon {
    width: 70px; height: 70px;
    border-radius: 20px;
    background: linear-gradient(145deg, var(--green-tint), var(--bg-card));
    border: 1.5px solid var(--green-border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 30px;
    color: var(--green-mid);
    box-shadow: var(--shadow-md), 0 0 0 6px var(--green-glow);
    margin-bottom: 4px;
    transition: all 0.3s;
  }
  .welcome-title {
    font-family: 'Lora', serif;
    font-size: 27px;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
    transition: color 0.3s;
  }
  .welcome-title em { font-style: italic; color: var(--green-mid); }
  .welcome-desc {
    font-size: 14px;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    max-width: 370px;
    transition: color 0.3s;
  }

  .skill-row {
    display: flex; flex-wrap: wrap; gap: 7px;
    justify-content: center;
    max-width: 460px;
    margin: 2px 0;
  }
  .skill-pill {
    font-size: 11.5px;
    font-weight: 400;
    border-radius: 7px;
    padding: 4px 11px;
    box-shadow: var(--shadow-sm);
    transition: all 0.25s;
  }
  .skill-pill.default {
    color: var(--text-muted);
    background: var(--bg-card);
    border: 1px solid var(--border);
  }
  .skill-pill.green {
    color: var(--green-mid);
    background: var(--green-tint);
    border: 1px solid var(--green-border);
  }
  .skill-pill.amber {
    color: var(--amber);
    background: var(--amber-tint);
    border: 1px solid var(--amber-border);
  }

  .welcome-rule { width: 40px; height: 1px; background: var(--border-strong); margin: 2px auto; }
  .chips-label {
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--text-faint);
  }
  .chips {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center;
    max-width: 520px;
  }
  .chip {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-body);
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 9px 16px;
    cursor: pointer;
    transition: all 0.18s;
    box-shadow: var(--shadow-sm);
  }
  .chip:hover {
    background: var(--green-tint);
    border-color: var(--green-border);
    color: var(--green);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--green-glow);
  }

  /* ── MSG ROW ── */
  .msg-row {
    display: flex;
    flex-direction: column;
    animation: slideUp 0.28s ease both;
  }
  .msg-row.user { align-items: flex-end; }
  .msg-row.ai   { align-items: flex-start; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg-meta {
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 5px;
    padding: 0 3px;
  }
  .msg-row.user .msg-meta { flex-direction: row-reverse; }

  .meta-icon {
    width: 22px; height: 22px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .meta-icon.ai {
    background: var(--green-tint);
    border: 1px solid var(--green-border);
    font-family: 'Lora', serif;
    font-style: italic;
    color: var(--green-mid);
    font-size: 12px;
  }
  .meta-icon.user {
    background: var(--user-bg);
    color: var(--user-text);
    font-weight: 600;
    font-size: 9px;
  }
  .meta-name {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    transition: color 0.3s;
  }
  .meta-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 300;
    color: var(--text-faint);
    transition: color 0.3s;
  }

  .bubble {
    max-width: 76%;
    padding: 13px 17px;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.78;
    letter-spacing: 0.01em;
    box-shadow: var(--shadow-sm);
    transition: background 0.3s, border-color 0.3s, color 0.3s;
  }
  .bubble.ai {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--green-mid);
    border-radius: 3px 14px 14px 14px;
    color: var(--text-body);
  }
  .bubble.user {
    background: var(--user-bg);
    color: var(--user-text);
    border-radius: 14px 14px 3px 14px;
    border: none;
  }

  /* ── TYPING ── */
  .typing-row {
    display: flex; align-items: flex-start; gap: 9px;
    animation: fadeIn 0.25s ease both;
  }
  .typing-bubble {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--green-mid);
    border-radius: 3px 14px 14px 14px;
    padding: 14px 17px;
    display: flex; gap: 5px; align-items: center;
    box-shadow: var(--shadow-sm);
    transition: background 0.3s, border-color 0.3s;
  }
  .td {
    width: 7px; height: 7px;
    background: var(--green-light);
    border-radius: 50%;
    animation: tdot 1.4s infinite ease-in-out;
    transition: background 0.3s;
  }
  .td:nth-child(2) { animation-delay: 0.2s; }
  .td:nth-child(3) { animation-delay: 0.4s; }
  @keyframes tdot {
    0%, 60%, 100% { transform: translateY(0) scale(0.8); opacity: 0.4; }
    30% { transform: translateY(-5px) scale(1.1); opacity: 1; }
  }

  /* ── INPUT ── */
  .input-area {
    padding: 14px 28px 26px;
    border-top: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-shrink: 0;
    position: relative;
    z-index: 10;
    transition: background 0.3s, border-color 0.3s;
  }
  .input-wrap {
    display: flex; align-items: center;
    background: var(--bg-card);
    border: 1.5px solid var(--border-strong);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.3s;
    box-shadow: var(--shadow-sm);
  }
  .input-wrap:focus-within {
    border-color: var(--green-mid);
    box-shadow: 0 0 0 3px var(--green-glow), var(--shadow-sm);
  }
  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 14px 18px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--text-primary);
    letter-spacing: 0.01em;
    transition: color 0.3s;
  }
  .chat-input::placeholder { color: var(--text-faint); }

  .send-btn {
    margin: 6px;
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--green), var(--green-mid));
    border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #fff;
    font-size: 17px;
    transition: all 0.18s;
    flex-shrink: 0;
    box-shadow: 0 2px 10px var(--green-glow);
  }
  .send-btn:hover:not(:disabled) {
    transform: scale(1.07);
    box-shadow: 0 4px 16px var(--green-glow);
  }
  .send-btn:active:not(:disabled) { transform: scale(0.96); }
  .send-btn:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }

  .input-footer {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 9px;
    padding: 0 2px;
  }
  .foot-hint {
    font-size: 11px; font-weight: 300;
    color: var(--text-faint);
    transition: color 0.3s;
  }
  .foot-hint kbd {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
    transition: all 0.3s;
  }
  .foot-right {
    font-size: 11px; font-weight: 300;
    color: var(--text-faint);
    transition: color 0.3s;
  }
  .foot-right b { color: var(--green-mid); font-weight: 500; }
`;

const SKILLS = [
  { label: "React", c: "green" },
  { label: "Python", c: "green" },
  { label: "TypeScript", c: "default" },
  { label: "Machine Learning", c: "amber" },
  { label: "Node.js", c: "default" },
  { label: "AWS", c: "amber" },
  { label: "PostgreSQL", c: "default" },
  { label: "FastAPI", c: "green" },
];

const CHIPS = [
  "What's your tech stack?",
  "Walk me through your experience",
  "Tell me about a tough project",
  "What kind of roles are you open to?",
  "Do you have open-source work?",
  "What's your strongest skill?",
];

const ts = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? prompt).trim();
    if (!content || loading) return;
    setMessages((p) => [...p, { role: "user", content, time: ts() }]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.response, time: ts() }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Something went wrong — please try again.", time: ts() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="shell" data-theme={dark ? "dark" : "light"}>

        <header className="header">
          <div className="header-left">
            <div className="avatar">
              <span className="avatar-letter">A</span>
              <span className="avatar-pip" />
            </div>
            <div>
              <div className="header-name">Alex Chen</div>
              <div className="header-sub">Ask me about <b>my experience & work</b></div>
            </div>
          </div>
          <div className="header-right">
            <a className="hdr-link" href="#">Resume</a>
            <a className="hdr-link" href="#">GitHub</a>
            <a className="hdr-link" href="#">LinkedIn</a>
            <div className="hire-badge">
              <span className="hire-pip" />
              Open to work
            </div>
            <div className="theme-btn" onClick={() => setDark(d => !d)}>
              {dark ? "☀️" : "🌙"}
            </div>
          </div>
        </header>

        <div className="messages">
          {messages.length === 0 && !loading ? (
            <div className="welcome">
              <div className="welcome-icon">A</div>
              <div className="welcome-title">Hi — I'm <em>Alex's</em> AI</div>
              <div className="welcome-desc">
                I'm trained on Alex's resume, projects, and experience. Ask me anything to get a real picture of what he brings to the table.
              </div>
              <div className="skill-row">
                {SKILLS.map(s => (
                  <span key={s.label} className={`skill-pill ${s.c}`}>{s.label}</span>
                ))}
              </div>
              <div className="welcome-rule" />
              <div className="chips-label">Try asking</div>
              <div className="chips">
                {CHIPS.map(c => (
                  <div key={c} className="chip" onClick={() => send(c)}>{c}</div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role === "user" ? "user" : "ai"}`}>
                  <div className="msg-meta">
                    <div className={`meta-icon ${msg.role === "user" ? "user" : "ai"}`}>
                      {msg.role === "user" ? "U" : "A"}
                    </div>
                    <span className="meta-name">{msg.role === "user" ? "You" : "Alex's AI"}</span>
                    <span className="meta-time">{msg.time}</span>
                  </div>
                  <div className={`bubble ${msg.role === "user" ? "user" : "ai"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="typing-row">
                  <div className="meta-icon ai" style={{width:22,height:22,borderRadius:7,background:"var(--green-tint)",border:"1px solid var(--green-border)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Lora',serif",fontStyle:"italic",color:"var(--green-mid)",fontSize:12,flexShrink:0,marginTop:2}}>A</div>
                  <div className="typing-bubble">
                    <div className="td"/><div className="td"/><div className="td"/>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-wrap">
            <input
              className="chat-input"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about skills, projects, experience…"
              disabled={loading}
            />
            <button className="send-btn" onClick={() => send()} disabled={loading || !prompt.trim()}>↑</button>
          </div>
          <div className="input-footer">
            <span className="foot-hint">Press <kbd>Enter</kbd> to send</span>
            <span className="foot-right">Trained on <b>personal data</b></span>
          </div>
        </div>

      </div>
    </>
  );
}