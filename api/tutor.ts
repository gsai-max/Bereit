export const config = {
  runtime: 'edge',
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface TutorRequestBody {
  messages: Message[]
  questionPrompt?: string
  topic?: string
  studentChoice?: string
  correctChoice?: string
  explanation?: string
}

export default async function handler(req: Request): Promise<Response> {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', reply: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.GROQ_API_KEY

  // Graceful degradation when GROQ_API_KEY is not configured
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GROQ_API_KEY_NOT_CONFIGURED',
        reply:
          'Der KI-Tutor ist derzeit im Standby-Modus, da noch kein `GROQ_API_KEY` in Vercel hinterlegt ist. Hinterlegen Sie Ihren kostenlosen Groq-Schlüssel in den Vercel-Umgebungsvariablen (Settings -> Environment Variables), um Live-Erklärungen von LLaMA 3.1 zu aktivieren.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const body: TutorRequestBody = await req.json()

    const systemPrompt: Message = {
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

    const conversationMessages = [
      systemPrompt,
      ...(body.messages || []),
    ]

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: conversationMessages,
        temperature: 0.5,
        max_tokens: 650,
      }),
    })

    if (!groqResponse.ok) {
      const errText = await groqResponse.text()
      console.error('Groq API error:', groqResponse.status, errText)
      return new Response(
        JSON.stringify({
          error: 'GROQ_API_ERROR',
          reply: `Der KI-Tutor konnte Groq vorübergehend nicht erreichen (Status ${groqResponse.status}). Bitte versuchen Sie es in wenigen Sekunden erneut.`,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const data = await groqResponse.json()
    const reply = data.choices?.[0]?.message?.content || 'Keine Antwort erhalten.'

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({
        error: 'INTERNAL_ERROR',
        reply: `Fehler beim Abrufen der KI-Antwort: ${message}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
