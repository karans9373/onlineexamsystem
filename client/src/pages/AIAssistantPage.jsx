import { useEffect, useState } from 'react'
import { Bot, Sparkles, SendHorizonal } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { apiGet, apiPost } from '../lib/api'

const initialMessages = [
  {
    role: 'assistant',
    content:
      'I am your AstraExam assistant. Ask me about students, schedules, results, question counts, leaderboard insights, or even a small math problem.',
  },
]

export function AIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    apiGet('/assistant/suggestions').then(setSuggestions).catch(() => setSuggestions([]))
  }, [])

  async function sendMessage(prefilled) {
    const message = (prefilled ?? input).trim()
    if (!message || loading) {
      return
    }

    setMessages((current) => [...current, { role: 'user', content: message }])
    setInput('')
    setLoading(true)
    try {
      const response = await apiPost('/assistant/chat', { message })
      setMessages((current) => [...current, { role: 'assistant', content: response.reply }])
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'I could not answer that right now. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Realtime assistant</p>
            <h2 className="font-display mt-3 text-3xl text-slate-950">Ask the platform bot</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This bot answers real queries from the demo portal state, including student details, exam schedules, results, leaderboard data, and simple arithmetic.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-950 p-4 text-white">
            <Bot className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">What it can answer</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>Registered students and their class details</p>
            <p>Upcoming exam schedules and exam codes</p>
            <p>Student average score and saved results</p>
            <p>Question count for the live mathematics paper</p>
            <p>Simple math queries like `What is 18 + 9?`</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Suggested prompts</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-white/45 bg-white/80 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-950 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex min-h-[620px] flex-col p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Conversation</p>
            <h3 className="font-display mt-2 text-2xl text-slate-950">Astra Assistant Chat</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm text-cyan-800">
            <Sparkles className="h-4 w-4" />
            Live response
          </div>
        </div>

        <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                message.role === 'assistant'
                  ? 'bg-white/80 text-slate-700'
                  : 'ml-auto bg-slate-950 text-white'
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="max-w-[85%] rounded-[24px] bg-white/80 px-4 py-3 text-sm text-slate-500">
              Thinking through your query...
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask about students, results, schedules, or math..."
            className="w-full rounded-[24px] border border-white/45 bg-white/80 px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            className="inline-flex items-center justify-center rounded-[24px] bg-slate-950 px-5 text-white"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
