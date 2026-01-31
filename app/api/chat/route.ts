import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 60

const OPENROUTER_MODEL = 'deepseek/deepseek-r1-0528:free'
// const OPENROUTER_MODEL = 'tngtech/deepseek-r1t-chimera:free'

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: '未配置 OPENROUTER_API_KEY，请在 .env 中设置' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { 
    messages 
  }: { 
    messages: UIMessage[]
  } = await req.json()

  // Build the system prompt
  let systemPrompt = `你是 AskIt，一个智能、友好的AI助手。你的特点：
- 回答准确、专业且易于理解
- 支持多轮对话，能够记住上下文
- 如果用户的问题不清楚，会礼貌地请求澄清
- 使用中文回复，但如果用户使用其他语言，则用相应语言回复`

  const openrouter = createOpenRouter({ apiKey })

  const result = streamText({
    model: openrouter(OPENROUTER_MODEL),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ isAborted }) => {
      if (isAborted) return
      // Messages can be persisted here
    },
    consumeSseStream: consumeStream,
  })
}
