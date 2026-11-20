import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function groqTutorDevPlugin(): Plugin {
  return {
    name: 'groq-tutor-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/tutor', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', reply: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', async () => {
          const apiKey = process.env.GROQ_API_KEY
          if (!apiKey) {
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: 'GROQ_API_KEY_NOT_CONFIGURED',
                reply:
                  'Der KI-Tutor ist derzeit im Standby-Modus, da noch kein `GROQ_API_KEY` in Vercel hinterlegt ist. Hinterlegen Sie Ihren kostenlosen Groq-Schlüssel in den Vercel-Umgebungsvariablen (Settings -> Environment Variables), um Live-Erklärungen von LLaMA 3.1 zu aktivieren.',
              })
            )
            return
          }

          try {
            const parsed = JSON.parse(body || '{}')
            const systemPrompt = {
              role: 'system',
              content:
                'You are "Bereit Bot", a patient, encouraging, and pedagogically sound German language tutor specializing in CEFR A1 (Goethe-Zertifikat A1 Start Deutsch 1 and ÖSD Zertifikat A1). ' +
                'Your goal is to help beginner students understand German grammar rules, vocabulary distinctions, and test strategies. ' +
                'Guidelines: ' +
                '1. Keep your explanation concise (2-4 short paragraphs or bullet points). ' +
                '2. Use clear, accessible English for explanations, accompanied by authentic German examples with English translations in parentheses. ' +
                '3. If explaining a mistake, explain WHY the student choice was incorrect and WHY the correct answer is grammatically right (e.g. verb position on position 2, case endings for Akkusativ vs Dativ, modal verb conjugation, noun gender). ' +
                '4. Always conclude with a memorable, quick study tip or mnemonic for the exam.',
            }

            const messages = [systemPrompt, ...(parsed.messages || [])]

            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages,
                temperature: 0.5,
                max_tokens: 650,
              }),
            })

            const groqData = await groqRes.json()
            const reply = groqData.choices?.[0]?.message?.content || 'Keine Antwort erhalten.'

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ reply }))
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'INTERNAL_ERROR', reply: `Lokaler Fehler: ${message}` }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), groqTutorDevPlugin()],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
})
