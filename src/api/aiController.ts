// @ts-ignore
/* eslint-disable */
import request from '@/request'

// SSE连接的基础URL处理
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return process.env.NODE_ENV === 'production'
      ? window.location.origin + '/api'
      : 'http://localhost:8123/api'
  }
  return '/api' // 服务端环境
}

// 封装SSE连接（原有的GET方式）
export const connectSSE = (
  url: string,
  params: Record<string, any>,
  onMessage?: (data: string) => void,
  onError?: (error: Event) => void
): EventSource => {
  // 构建带参数的URL
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  const fullUrl = `${getApiBaseUrl()}${url}?${queryString}`

  // 创建EventSource
  const eventSource = new EventSource(fullUrl)

  eventSource.onmessage = event => {
    let data = event.data

    // 检查是否是特殊标记
    if (data === '[DONE]') {
      if (onMessage) onMessage('[DONE]')
    } else {
      // 处理普通消息
      if (onMessage) onMessage(data)
    }
  }

  eventSource.onerror = error => {
    if (onError) onError(error)
    eventSource.close()
  }

  // 返回eventSource实例，以便后续可以关闭连接
  return eventSource
}

// 新增：支持文件上传的SSE连接（POST multipart/form-data）
// 修改后的 connectSSEWithFile 函数
export const connectSSEWithFile = (
  url: string,
  params: Record<string, any>,
  file?: File,
  onMessage?: (data: string) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): AbortController => {
  const abortController = new AbortController()
  const fullUrl = `${getApiBaseUrl()}${url}`

  // 构建FormData
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    formData.append(key, params[key])
  })

  if (file) {
    formData.append('file', file)
  }

  fetch(fullUrl, {
    method: 'POST',
    body: formData,
    signal: abortController.signal,
    headers: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      // 明确指定UTF-8编码
      const decoder = new TextDecoder('utf-8')
      let buffer = '' // 添加缓冲区处理不完整的行

      function readStream(): Promise<void> {
        return reader.read().then(({ done, value }) => {
          if (done) {
            // 处理缓冲区中剩余的数据
            if (buffer.trim()) {
              processLines(buffer)
            }
            onComplete?.()
            return
          }

          // 解码当前chunk并添加到缓冲区
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          // 处理完整的行
          processCompleteLines()

          return readStream()
        })
      }

      function processCompleteLines() {
        const lines = buffer.split('\n')
        // 保留最后一行（可能不完整）在缓冲区中
        buffer = lines.pop() || ''

        // 处理完整的行
        lines.forEach(line => {
          processLines(line)
        })
      }

      function processLines(line: string) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6).trim()

          console.log('接收到数据:', data, '长度:', data.length) // 调试日志

          if (data === '[DONE]') {
            onMessage?.('[DONE]')
            onComplete?.()
          } else if (data) {
            onMessage?.(data)
          }
        }
      }

      return readStream()
    })
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('SSE连接错误:', error)
        onError?.(error)
      }
    })

  return abortController
}


/** AI恋爱大师聊天 POST /api/ai/my_app/chat */
export async function chatWithLoveAppUsingPost(
  body: API.LoveAppChatRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>('/api/ai/my_app/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** AI恋爱大师聊天SSE POST /api/ai/my_app/chat/sse（不带文件上传的版本，保持向后兼容）*/
export function chatWithLoveAppSSE(
  message: string,
  chatId: string,
  onMessage?: (data: string) => void,
  onError?: (error: Event) => void
): EventSource {
  return connectSSE('/ai/my_app/chat/sse', { message, chatId }, onMessage, onError)
}

/** AI恋爱大师聊天SSE，支持文件上传 POST /api/ai/my_app/chat/sse */
export function chatWithLoveAppSSEWithFile(
  message: string,
  chatId: string,
  file?: File,
  onMessage?: (data: string) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): AbortController {
  return connectSSEWithFile(
    '/ai/my_app/chat/sse',
    { message, chatId },
    file,
    onMessage,
    onError,
    onComplete
  )
}

// 为了向后兼容，保留原有的函数名
export const chatWithLoveApp = chatWithLoveAppSSE

export function chatWithManus(message: string): EventSource {
  const encodedMessage = encodeURIComponent(message);
  const fullUrl = `${getApiBaseUrl()}/ai/manus/chat/see?message=${encodedMessage}`;

  console.log('SSE URL:', fullUrl);

  // 添加更多配置选项
  const eventSource = new EventSource(fullUrl, {
    withCredentials: true // 如果需要携带 cookies
  });

  return eventSource;
}



// 新增：AI恋爱大师聊天，支持文件上传 POST /api/ai/my_app/chat/sse（返回String）
export async function chatWithExpertWithFile(
  message: string,
  chatId: string,
  file?: File
) {
  const formData = new FormData()
  formData.append('message', message)
  formData.append('chatId', chatId)

  if (file) {
    formData.append('file', file)
  }

  return request<API.BaseResponseString_>('/api/ai/my_app/chat/sse', {
    method: 'POST',
    data: formData,
    // 不设置Content-Type，让浏览器自动设置multipart/form-data
    requestType: 'form',
  })
}

export default {
  chatWithLoveApp,
  chatWithManus,
  chatWithLoveAppUsingPost,
  chatWithLoveAppSSE,
  chatWithLoveAppSSEWithFile, // 新增的支持文件上传的函数
  chatWithExpertWithFile,
  connectSSE,
  connectSSEWithFile // 新增的支持文件上传的SSE连接函数
}
