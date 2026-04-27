import { useState } from "react";

function App(){
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [loading,setLoading] = useState(false)

  const sendMessage = async() => {
    if (!prompt.trim()) return

    const userMessage = {role: 'user', content: prompt}
    setMessages(prev => [...prev, userMessage])

    setLoading(true)

    try{
      const res = await fetch('http://localhost:8000/generate',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt}),
      })
      const data = await res.json()

      const botMessage = {
        role : 'assistant',
        content: data.response
      }
    setMessages(prev=> [...prev,botMessage])
    } catch (err){
      console.error(err)
      setLoading(false)
    }
    setLoading(false)
    setPrompt('')
  }
return (
   <div style={{ 
    padding: 20, 
    maxWidth: 600, 
    margin: 'auto' 
  }}> 
  <h2>Mini GPT Chat</h2> 
  {/* messages */} 
  <div style={{ 
    minHeight: 300, 
    marginBottom: 20 
  }}>
     {messages.map((msg, i) => 
     ( <div key={i} style={{ marginBottom: 10 }}> <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>{' '} {msg.content} </div> ))} {loading && <div>AI is typing...</div>} </div> {/* input */} <input
  value={prompt}
  onChange={e => setPrompt(e.target.value)}
  onKeyDown={e => e.key === 'Enter' && sendMessage()}
  placeholder="Ask me anything..."
  style={{ width: '80%', padding: 10 }}
/> {/* button */} <button onClick={sendMessage} style={{ padding: 10 }}> Send </button> </div> ) }

export default App