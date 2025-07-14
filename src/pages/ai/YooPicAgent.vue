<template>
  <div class="super-agent-container">
    <div class="header">
      <div class="back-button" @click="goBack">返回</div>
      <h1 class="title">AI超级智能体</h1>
      <div class="placeholder"></div>
    </div>

    <div class="content-wrapper">
      <div class="chat-area">
        <ChatRoom
          :messages="messages"
          :connection-status="connectionStatus"
          ai-type="super"
          @send-message="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import ChatRoom from '@/components/ChatRoom.vue'
import { chatWithManus } from '@/api/aiController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

// 设置页面标题和元数据
useHead({
  title: 'AI超级智能体 - 鱼皮AI超级智能体应用平台',
  meta: [
    {
      name: 'description',
      content: 'AI超级智能体是鱼皮AI超级智能体应用平台的全能助手，能解答各类专业问题，提供精准建议和解决方案'
    },
    {
      name: 'keywords',
      content: 'AI超级智能体,智能助手,专业问答,AI问答,专业建议,鱼皮,AI智能体'
    }
  ]
})

const router = useRouter()
const messages = ref([])
const connectionStatus = ref('disconnected')
const chatId = ref('') // 添加缺失的变量
let eventSource = null

// 生成聊天ID的函数
const generateChatId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 检测文件类型
const getFileType = (url) => {
  const extension = url.split('.').pop().toLowerCase()
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg']
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz']

  if (imageExtensions.includes(extension)) return 'image'
  if (videoExtensions.includes(extension)) return 'video'
  if (audioExtensions.includes(extension)) return 'audio'
  if (documentExtensions.includes(extension)) return 'document'
  if (archiveExtensions.includes(extension)) return 'archive'
  return 'other'
}

// 获取文件图标
const getFileIcon = (fileType) => {
  const icons = {
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    document: '📄',
    archive: '📦',
    other: '📎'
  }
  return icons[fileType] || '📎'
}

// 获取文件大小（如果可能的话）
const getFileSize = async (url) => {
  try {
    const response = await fetch(url, {method: 'HEAD'})
    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      const bytes = parseInt(contentLength)
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
    }
  } catch (error) {
    console.log('无法获取文件大小:', error)
  }
  return ''
}

// 检测并提取文件链接 - 改进版本
const extractFileLinks = (text) => {
  // 支持的文件扩展名
  const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'ogg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', '7z', 'tar', 'gz', 'html']

  const fileLinks = new Set() // 使用Set避免重复

  // 方法1: 使用更全面的正则表达式匹配所有URL
  const extensionPattern = supportedExtensions.join('|')
  // 更强的正则表达式，匹配各种可能的URL格式
  const urlRegex = new RegExp(`https?://[^\\s\\r\\n<>"{}|\\\\^` + "`" + `\\[\\]]+\\.(${extensionPattern})(?:[?#][^\\s\\r\\n<>"{}|\\\\^` + "`" + `\\[\\]]*)?`, 'gi')
  const regexMatches = text.match(urlRegex)
  if (regexMatches) {
    regexMatches.forEach(match => fileLinks.add(match))
  }

  // 方法2: 按多种分隔符分割并检查每个部分
  const separators = [',', ' ', '\n', '\r', '\t', ';', '|']
  separators.forEach(separator => {
    const parts = text.split(separator)
    parts.forEach(part => {
      const trimmed = part.trim()
      if (trimmed) {
        // 检查是否是完整的URL且以支持的扩展名结尾
        const urlPattern = /^https?:\/\/[^\s]+$/
        if (urlPattern.test(trimmed)) {
          // 提取扩展名（移除查询参数和锚点）
          const urlWithoutParams = trimmed.split('?')[0].split('#')[0]
          const extension = urlWithoutParams.split('.').pop().toLowerCase()
          if (supportedExtensions.includes(extension)) {
            fileLinks.add(trimmed)
          }
        }
      }
    })
  })

  // 方法3: 处理可能包含在括号、引号等符号中的URL
  const bracketPatterns = [
    /\[([^\]]+)\]/g,  // [url]
    /\(([^\)]+)\)/g,  // (url)
    /"([^"]+)"/g,     // "url"
    /'([^']+)'/g,     // 'url'
    /`([^`]+)`/g,     // `url`
    /<([^>]+)>/g      // <url>
  ]

  bracketPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const url = match[1].trim()
      const urlPattern = /^https?:\/\/[^\s]+$/
      if (urlPattern.test(url)) {
        const urlWithoutParams = url.split('?')[0].split('#')[0]
        const extension = urlWithoutParams.split('.').pop().toLowerCase()
        if (supportedExtensions.includes(extension)) {
          fileLinks.add(url)
        }
      }
    }
  })

  // 方法4: 查找可能被其他字符包围的URL
  const generalUrlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi
  const generalMatches = text.match(generalUrlRegex)
  if (generalMatches) {
    generalMatches.forEach(url => {
      // 清理URL末尾可能的标点符号
      const cleanUrl = url.replace(/[.,;:!?]*$/, '')
      const urlWithoutParams = cleanUrl.split('?')[0].split('#')[0]
      const extension = urlWithoutParams.split('.').pop().toLowerCase()
      if (supportedExtensions.includes(extension)) {
        fileLinks.add(cleanUrl)
      }
    })
  }

  return Array.from(fileLinks)
}

// 添加消息到列表
const addMessage = (content, isUser, type = '', fileInfo = null) => {
  messages.value.push({
    content,
    isUser,
    type,
    fileInfo, // 文件信息字段
    time: new Date().getTime()
  })
}

// 处理包含文件链接的消息 - 修改后的版本
const processMessageWithFiles = async (content, type = 'ai-answer') => {
  const fileLinks = extractFileLinks(content)

  if (fileLinks.length === 0) {
    // 没有文件链接，正常显示
    addMessage(content, false, type)
    return
  }

  // 分离文本和文件链接
  let textContent = content
  const fileInfos = []

  // 移除所有检测到的文件链接
  fileLinks.forEach(link => {
    // 使用更安全的方式移除链接，避免影响其他内容
    const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const linkRegex = new RegExp(escapedLink, 'g')
    textContent = textContent.replace(linkRegex, '')
  })

  // 清理多余的分隔符和空格
  textContent = textContent
    .replace(/[,\s]+/g, ' ')  // 替换多个逗号和空格为单个空格
    .replace(/^\s*[,;|]\s*|\s*[,;|]\s*$/g, '')  // 移除开头和结尾的分隔符
    .trim()

  for (const link of fileLinks) {
    const fileType = getFileType(link)
    const fileName = link.split('/').pop().split('?')[0] // 移除查询参数
    const fileIcon = getFileIcon(fileType)

    // 获取文件大小（可选，可能较慢）
    const fileSize = await getFileSize(link)

    fileInfos.push({
      url: link,
      type: fileType,
      name: fileName,
      icon: fileIcon,
      size: fileSize
    })
  }

  // 如果有文本内容，先显示文本
  if (textContent) {
    addMessage(textContent, false, type)
  }

  // 为每个文件创建单独的消息气泡
  fileInfos.forEach(fileInfo => {
    addMessage('', false, 'ai-file', fileInfo)
  })
}

// 发送消息
const sendMessage = (messageData) => {
  // 🔥 关键修改：正确解构 messageData
  const message = typeof messageData === 'string' ? messageData : messageData.message
  const file = typeof messageData === 'object' ? messageData.file : null

  // 显示用户消息
  addMessage(message, true, 'user-question')

  // 连接SSE
  if (eventSource) {
    eventSource.close()
  }

  // 设置连接状态
  connectionStatus.value = 'connecting'

  // 🔥 移除消息缓冲逻辑，每条消息都立即创建气泡
  let isFirstResponse = true

  // 创建消息气泡的函数 - 简化版本
  const createBubble = async (content, type = 'ai-answer') => {
    if (!content.trim()) return

    // 检查是否包含文件链接
    await processMessageWithFiles(content, type)
  }

  //  关键修改：传递字符串 message 而不是整个 messageData 对象
  eventSource = chatWithManus(message)

  // 监听SSE消息 - 🔥 主要修改在这里
  eventSource.onmessage = async (event) => {
    const data = event.data

    if (data && data !== '[DONE]') {
      // 🔥 直接为每条消息创建气泡，不使用缓冲
      await createBubble(data, isFirstResponse ? 'ai-answer' : 'ai-answer')

      if (isFirstResponse) {
        isFirstResponse = false
      }
    }

    if (data === '[DONE]') {
      // 完成后关闭连接
      connectionStatus.value = 'disconnected'
      eventSource.close()
    }
  }

  // 监听SSE错误
  eventSource.onerror = async (error) => {
    console.error('SSE Error:', error)
    connectionStatus.value = 'error'
    eventSource.close()
  }
}

// 返回主页
const goBack = () => {
  console.log('尝试跳转到首页...')
  router.push('/').then(() => {
    console.log('跳转成功')
  }).catch(err => {
    console.error('跳转失败:', err)
  })
}

// 修复：合并 onMounted 钩子
onMounted(() => {
  // 检查用户是否登录，未登录则跳转到登录页面
  if (!loginUserStore.loginUser?.id) {
    router.replace('/user/login')
    return
  }

  // 生成聊天ID
  chatId.value = generateChatId()

  // 添加欢迎消息
  addMessage('你好，我是AI超级智能体。我可以解答各类问题，提供专业建议，请问有什么可以帮助你的吗？', false)
})

// 组件销毁前关闭SSE连接
onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

<style scoped>
.super-agent-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fbff;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 16px 24px;
  background-color: #3f51b5;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
  justify-self: start;
}

.back-button:hover {
  opacity: 0.8;
}

.back-button:before {
  content: '←';
  margin-right: 8px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  text-align: center;
  justify-self: center;
}

.placeholder {
  width: 1px;
  justify-self: end;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.chat-area {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  position: relative;
  min-height: calc(100vh - 56px - 32px);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 18px;
  }

  .chat-area {
    padding: 12px;
    min-height: calc(100vh - 48px - 24px);
  }
}

@media (max-width: 480px) {
  .header {
    padding: 10px 12px;
  }

  .back-button {
    font-size: 14px;
  }

  .title {
    font-size: 16px;
  }

  .chat-area {
    padding: 8px;
    min-height: calc(100vh - 42px - 16px);
  }
}
</style>
