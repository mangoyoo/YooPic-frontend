<template>
  <div class="chat-container">
    <!-- 聊天记录区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
        <!-- AI消息 -->
        <div v-if="!msg.isUser"
             class="message ai-message"
             :class="[msg.type]">
          <div class="avatar ai-avatar">
            <AiAvatarFallback :type="aiType" />
          </div>
          <div class="message-bubble">
            <div class="message-content">
              <span v-if="msg.content === '正在思考中...' || (connectionStatus === 'connecting' && index === messages.length - 1)"
                    class="loading-text">
                正在思考中<span class="loading-dots">...</span>
              </span>
              <span v-else>{{ msg.content }}</span>
            </div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="message user-message" :class="[msg.type]">
          <div class="message-bubble">
            <!-- 显示用户发送的图片 -->
            <div v-if="msg.imageUrl" class="message-image">
              <img :src="msg.imageUrl" alt="用户图片" @load="scrollToBottom" />
            </div>
            <div class="message-content" v-if="msg.content">{{ msg.content }}</div>
            <div class="message-time">{{ formatTime(msg.time) }}</div>
          </div>
          <div class="avatar user-avatar">
            <div class="avatar-placeholder">我</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-container">
      <!-- 图片预览区域 -->
      <div v-if="selectedFile" class="image-preview">
        <div class="preview-wrapper">
          <img :src="previewUrl" alt="预览图片" class="preview-image" />
          <button type="button" @click="removeFile" class="remove-image-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="chat-input">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="sendMessage"
          placeholder="请输入消息..."
          class="input-box"
          :disabled="connectionStatus === 'connecting'"
        ></textarea>

        <div class="input-actions">
          <!-- 图片上传按钮 -->
          <button
            type="button"
            @click="triggerFileInput"
            class="upload-btn"
            :disabled="connectionStatus === 'connecting'"
            title="上传图片"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
          </button>

          <!-- 发送按钮 -->
          <button
            @click="sendMessage"
            class="send-button"
            :disabled="connectionStatus === 'connecting' || (!inputMessage.trim() && !selectedFile)"
          >
            <span v-if="connectionStatus === 'connecting'">发送中...</span>
            <span v-else>发送</span>
          </button>
        </div>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          style="display: none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, watch, computed} from 'vue'
import AiAvatarFallback from '../pages/ai/AiAvatarFallback.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  connectionStatus: {
    type: String,
    default: 'disconnected'
  },
  aiType: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['send-message'])

const inputMessage = ref('')
const messagesContainer = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)

// 根据AI类型选择不同头像
const aiAvatar = computed(() => {
  return props.aiType === 'love'
    ? '/ai-love-avatar.png'
    : '/ai-super-avatar.png'
})

// 触发文件选择
const triggerFileInput = () => {
  if (props.connectionStatus === 'connecting') return
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小 (限制10MB，与后端保持一致)
    if (file.size > 10 * 1024 * 1024) {
      alert('图片文件不能超过10MB')
      return
    }

    selectedFile.value = file

    // 生成预览URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)
  }
}

// 移除已选择的文件
const removeFile = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 发送消息
const sendMessage = () => {
  if (props.connectionStatus === 'connecting') return
  if (!inputMessage.value.trim() && !selectedFile.value) return

  // 发送消息和文件
  emit('send-message', {
    message: inputMessage.value.trim(),
    file: selectedFile.value
  })

  // 清空输入
  inputMessage.value = ''
  removeFile()
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
}

// 自动滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化与内容变化，自动滚动
watch(() => props.messages.length, () => {
  scrollToBottom()
})

watch(() => props.messages.map(m => m.content).join(''), () => {
  scrollToBottom()
})

// 监听连接状态变化
watch(() => props.connectionStatus, (newStatus) => {
  if (newStatus === 'disconnected' || newStatus === 'error') {
    scrollToBottom()
  }
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  min-height: 600px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 72px;
}

.message-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 85%;
  margin-bottom: 8px;
}

.user-message {
  margin-left: auto;
  flex-direction: row;
}

.ai-message {
  margin-right: auto;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  margin-left: 8px;
}

.ai-avatar {
  margin-right: 8px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.message-bubble {
  padding: 12px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  min-width: 100px;
}

.user-message .message-bubble {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
  text-align: left;
}

.ai-message .message-bubble {
  background-color: #e9e9eb;
  color: #333;
  border-bottom-left-radius: 4px;
  text-align: left;
}

.message-content {
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-image {
  margin-bottom: 8px;
}

.message-image img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.chat-input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.image-preview {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.preview-wrapper {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 150px;
  max-height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff4757;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-image-btn:hover {
  background-color: #ff3742;
}

.chat-input {
  display: flex;
  padding: 16px;
  align-items: flex-end;
  gap: 8px;
}

.input-box {
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 16px;
  resize: none;
  min-height: 20px;
  max-height: 80px;
  outline: none;
  transition: border-color 0.3s;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.input-box::-webkit-scrollbar {
  display: none;
}

.input-box:focus {
  border-color: #007bff;
}

.input-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.upload-btn {
  padding: 8px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: #f1f3f4;
  color: #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  width: 40px;
  height: 40px;
}

.upload-btn:hover:not(:disabled) {
  background-color: #e8eaed;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 40px;
  align-self: center;
  min-width: 60px;
}

.send-button:hover:not(:disabled) {
  background-color: #0069d9;
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #6c757d;
}

.input-box:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

/* 加载状态样式 */
.loading-text {
  color: #666;
  font-style: italic;
}

.loading-dots {
  display: inline-block;
  width: 20px;
  text-align: left;
}

.loading-dots::after {
  content: '...';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 25% {
    content: '';
  }
  25%, 50% {
    content: '.';
  }
  50%, 75% {
    content: '..';
  }
  75%, 100% {
    content: '...';
  }
}

/* 不同类型消息的样式 */
.ai-answer {
  animation: fadeIn 0.3s ease-in-out;
}

.ai-final .message-bubble {
  background-color: #e8f5e8;
  border-left: 3px solid #4caf50;
}

.ai-error .message-bubble {
  background-color: #ffebee;
  color: #c62828;
  border-left: 3px solid #f44336;
}

.user-question {
  /* 用户提问的特殊样式 */
}

/* 连续消息气泡样式 */
.ai-message + .ai-message {
  margin-top: 4px;
}

.ai-message + .ai-message .avatar {
  visibility: hidden;
}

.ai-message + .ai-message .message-bubble {
  border-top-left-radius: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message {
    max-width: 95%;
  }

  .message-content {
    font-size: 15px;
  }

  .chat-input {
    padding: 12px;
  }

  .input-box {
    padding: 8px 12px;
  }

  .send-button {
    padding: 0 15px;
    font-size: 14px;
    min-width: 55px;
  }

  .message-image img {
    max-width: 150px;
    max-height: 150px;
  }

  .preview-image {
    max-width: 120px;
    max-height: 80px;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 32px;
    height: 32px;
  }

  .message-bubble {
    padding: 10px;
  }

  .message-content {
    font-size: 14px;
  }

  .upload-btn {
    width: 36px;
    height: 36px;
  }

  .send-button {
    height: 36px;
    min-width: 50px;
  }
}
</style>
