<template>
  <div class="love-master-container">
    <div class="header">
      <div class="back-button" @click="goBack">返回</div>
      <h1 class="title">AI恋爱大师</h1>
      <div class="chat-id">会话ID: {{ chatId }}</div>
    </div>

    <div class="content-wrapper">
      <div class="chat-area">
        <ChatRoom
          :messages="messages"
          :connection-status="connectionStatus"
          ai-type="love"
          @send-message="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import ChatRoom from '@/components/ChatRoom.vue'
import { chatWithLoveAppWithFile } from '@/api/aiController.ts'

// 设置页面标题和元数据
useHead({
  title: 'AI恋爱大师 - 鱼皮AI超级智能体应用平台',
  meta: [
    {
      name: 'description',
      content: 'AI恋爱大师是鱼皮AI超级智能体应用平台的专业情感顾问，帮你解答各种恋爱问题，提供情感建议'
    },
    {
      name: 'keywords',
      content: 'AI恋爱大师,情感顾问,恋爱咨询,AI聊天,情感问题,鱼皮,AI智能体'
    }
  ]
})

const router = useRouter()
const messages = ref([])
const chatId = ref('')
const connectionStatus = ref('disconnected')

// 生成随机会话ID
const generateChatId = () => {
  return 'love_' + Math.random().toString(36).substring(2, 10)
}

// 添加消息到列表
const addMessage = (content, isUser, imageUrl = null) => {
  messages.value.push({
    content,
    isUser,
    imageUrl,
    time: new Date().getTime(),
    type: isUser ? 'user-question' : 'ai-answer'
  })
}

// 发送消息（支持文件上传）
const sendMessage = async (data) => {
  const { message, file } = data

  // 添加用户消息
  if (file) {
    // 如果有文件，创建预览URL
    const imageUrl = URL.createObjectURL(file)
    addMessage(message, true, imageUrl)
  } else {
    addMessage(message, true)
  }

  // 设置加载状态
  connectionStatus.value = 'connecting'

  // 添加一个空的AI回复消息（显示加载状态）
  const aiMessageIndex = messages.value.length
  addMessage('正在思考中...', false)

  try {
    // 调用API
    const response = await chatWithLoveAppWithFile(message, chatId.value, file)

    if (response && response.data) {
      // 更新AI消息内容
      messages.value[aiMessageIndex].content = response.data
      messages.value[aiMessageIndex].type = 'ai-final'
    } else {
      messages.value[aiMessageIndex].content = 'AI未返回内容，请稍后重试'
      messages.value[aiMessageIndex].type = 'ai-error'
    }

    connectionStatus.value = 'disconnected'

  } catch (error) {
    console.error('API调用失败:', error)

    // 更新AI消息为错误信息
    messages.value[aiMessageIndex].content = `AI服务暂时不可用${error.message ? '：' + error.message : ''}`
    messages.value[aiMessageIndex].type = 'ai-error'

    connectionStatus.value = 'error'
  }
}

// 返回主页
const goBack = () => {
  router.push('/')
}

// 页面加载时添加欢迎消息
onMounted(() => {
  // 生成聊天ID
  chatId.value = generateChatId()

  // 添加欢迎消息
  addMessage('欢迎来到AI恋爱大师，请告诉我你的恋爱问题，我会尽力给予帮助和建议。你也可以发送图片让我进行分析。', false)
})
</script>

<style scoped>
/* 样式保持不变 */
.love-master-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff9f9;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ff6b8b;
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
}

.chat-id {
  font-size: 14px;
  opacity: 0.8;
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

/* 响应式样式保持不变 */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 18px;
  }

  .chat-id {
    font-size: 12px;
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

  .chat-id {
    display: none;
  }

  .chat-area {
    padding: 8px;
    min-height: calc(100vh - 42px - 16px);
  }
}
</style>
