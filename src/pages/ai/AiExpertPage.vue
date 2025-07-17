<template>
  <div class="ai-chat-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <button class="back-button" @click="goBack">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回</span>
        </button>
      </div>
      <div class="header-right">
        <div class="action-buttons">
          <button class="icon-button" @click="clearChat" title="新建对话">
            <svg t="1752652154123" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="16" height="16"><path d="M209.066667 176.085333a42.666667 42.666667 0 0 0-42.666667 42.666667v453.333333a42.666667 42.666667 0 0 0 42.666667 42.666667h82.688a42.666667 42.666667 0 0 1 42.666666 42.666667v74.965333l226.133334-113.109333a42.965333 42.965333 0 0 1 19.072-4.522667H806.4a42.666667 42.666667 0 0 0 42.666667-42.666667v-154.666666a42.666667 42.666667 0 0 1 85.333333 0v154.666666a128 128 0 0 1-128 128h-216.576l-279.04 139.52a42.666667 42.666667 0 0 1-61.696-38.186666v-101.333334H209.066667a128 128 0 0 1-128-128V218.752a128 128 0 0 1 128-128h250.666666a42.666667 42.666667 0 1 1 0 85.333333z m514.688-85.333333a42.666667 42.666667 0 0 1 42.666666 42.666667v101.333333h101.333334a42.666667 42.666667 0 1 1 0 85.333333h-101.333334v101.333334a42.666667 42.666667 0 1 1-85.333333 0V320.085333h-101.333333a42.666667 42.666667 0 1 1 0-85.333333h101.290666V133.418667a42.666667 42.666667 0 0 1 42.666667-42.666667z" fill="#515151" p-id="2453"></path></svg>
          </button>
          <div class="chat-id">{{ chatId }}</div>
        </div>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="chat-main">
      <div class="messages-container" ref="messagesContainer">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 1" class="welcome-section">
          <div class="welcome-card">
            <div class="welcome-icon">
              <svg t="1752460770590" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6317" width="48" height="48"><path d="M246.797399 863.928647l-20.790048 43.262528-43.502875 20.790048L226.007351 949.372139l20.790048 43.262528 20.910222-43.262528 43.382702-20.790048-43.382702-20.790048z m8.051637-687.874193l24.034738-48.670344 48.790518-23.433869-49.271213-23.313696-24.034737-48.069475-22.953175 48.069475-48.910691 23.313696 48.910691 23.433869zM801.519146 889.285295l-72.104213-25.356648 25.356648 72.104213-25.356648 72.104213 72.104213-25.356648 72.104213 25.356648-25.356649-72.104213 25.356649-72.104213zM504.089267 448.007511a64.052576 64.052576 0 1 0 64.292923 63.932402 64.052576 64.052576 0 0 0-64.292923-63.932402z m333.00129 63.932402c105.392325-99.744161 156.225795-197.565544 122.697336-255.969956-19.347964-33.408285-63.932402-49.271212-124.620115-49.271213a599.306185 599.306185 0 0 0-160.552047 26.798733C640.005708 93.014435 580.279385 0 512.02073 0S384.035752 93.014435 349.545903 233.497477a599.306185 599.306185 0 0 0-160.431874-26.798733c-60.807886 0-105.272151 15.862927-124.740289 49.271213-34.489849 58.404413 17.305011 156.225795 122.697336 255.969956C81.678751 611.804248 29.883892 709.024762 64.37374 767.90987 83.841878 801.318155 128.306142 817.181082 189.114029 817.181082a599.306185 599.306185 0 0 0 160.431874-26.678559c34.489849 140.362868 94.336345 233.497477 162.474827 233.497477s127.984978-93.134609 162.595001-233.497477A599.306185 599.306185 0 0 0 835.047605 817.181082c60.086844 0 105.272151-15.983101 124.620115-49.271212 34.249501-58.284239-17.184837-156.105621-122.577163-255.969957zM189.114029 753.24868c-46.387044 0-65.254313-11.296327-68.73935-17.305011-12.017369-20.669874 21.871611-93.374956 115.246567-181.221923 26.678559 22.111959 55.640418 44.103744 87.005751 65.494661 3.124516 37.614365 7.81129 73.30595 13.819974 107.315103a541.502641 541.502641 0 0 1-147.332942 25.71717zM318.300744 538.498298c-12.017369-8.772679-23.193522-17.665532-34.249501-26.558385 10.815632-8.892853 22.352306-17.785706 34.249501-26.678559v53.236944z m3.965732-134.834878c-31.365333 21.51109-60.086844 43.502875-87.125924 65.614834a674.534914 674.534914 0 0 1-58.64476-61.408755c-60.687713-72.945429-61.168407-112.001878-56.481634-120.173689 3.485037-5.888511 22.232132-17.305011 68.73935-17.305011a537.536909 537.536909 0 0 1 147.332942 25.837343c-5.768337 34.129328-10.334937 69.941087-13.459453 107.435278z m309.567421-44.103744c-7.81129-4.686774-15.262058-9.373548-23.193521-13.819974s-15.502406-8.412158-23.313696-12.618237c13.579627-5.648163 27.03908-11.055979 40.378359-15.983101 2.523647 13.579627 5.047295 27.760122 6.489379 42.421312z m-120.173688-295.5071c24.034738 0 70.782303 65.49466 100.945898 189.513907q-49.271212 17.785706-100.945898 42.060791a1187.207886 1187.207886 0 0 0-100.825725-41.940618c30.524117-124.13942 77.031334-189.634081 101.186246-189.63408z m-113.564136 253.085788c13.339279 4.927121 26.798733 10.334937 40.37836 15.983101-7.81129 4.206079-15.502406 8.171811-23.313696 12.618237s-15.502406 9.1332-23.193522 13.819974c1.802605-14.66119 3.845558-28.841685 6.128858-42.421312z m-6.128858 347.30196c7.691116 4.5666 15.262058 9.253374 23.193522 13.819974s15.502406 8.291985 23.313696 12.618237q-20.429527 8.412158-40.37836 15.862927c-2.2833-13.579627-4.326253-27.639948-6.128858-42.301138z m120.173689 295.5071c-24.034738 0-70.662129-65.49466-100.825725-189.63408 32.687243-12.017369 66.45605-25.837343 100.825725-42.060791 34.489849 16.223448 68.138481 30.163596 100.945898 42.060791-30.403943 124.13942-76.790987 189.634081-101.066072 189.63408z m114.04483-253.205962q-19.948832-7.450769-40.378359-15.862927c7.81129-4.326253 15.502406-8.171811 23.313695-12.618237s15.502406-9.253374 23.193522-13.819974c-1.562258 14.66119-4.085905 28.721512-6.249032 42.301138z m-120.173688-66.816571A127.984978 127.984978 0 1 1 635.559282 511.939913a128.465673 128.465673 0 0 1-129.306889 127.984978zM835.047605 270.631147c46.387044 0 65.254313 11.4165 68.619176 17.305011 12.017369 20.790048-21.871611 93.374956-115.246567 181.221922-26.798733-22.111959-55.760591-44.103744-87.005751-65.49466-3.124516-37.494191-7.81129-73.30595-13.819974-107.315104A540.781598 540.781598 0 0 1 835.047605 270.631147zM705.380195 485.381528c12.017369 8.772679 23.313696 17.665532 34.369675 26.678559-10.935806 8.772679-22.352306 17.665532-34.369675 26.678559V511.939913c0-9.1332 0.240347-17.665532 0-26.558385z m198.526933 250.562141c-3.485037 6.008684-22.352306 17.305011-68.73935 17.305011a540.781598 540.781598 0 0 1-147.453115-25.71717c6.008684-34.009154 10.695458-69.700739 13.819974-107.315103 31.365333-21.390917 60.086844-43.382702 87.125924-65.614834A691.35923 691.35923 0 0 1 847.064974 616.130501c60.92806 72.945429 61.408755 112.001878 56.842154 119.813168z" fill="#8a8a8a" p-id="6318"></path></svg>
            </div>
            <p>我可以帮助您分析图像风格、颜色、构图等视觉元素，并提供专业的设计建议和创意灵感。帮您寻找图片素材。</p>
            <div class="quick-actions">
              <button class="quick-action" @click="addQuickMessage('帮我在本站寻找两张表情包')">
                <span>💡</span> 按分类本站找图
              </button>
              <button class="quick-action" @click="addQuickMessage('帮我在本站找一张和我上传的这张图片的色系类似的图片给我')">
                <span>🎨</span> 按色系在本站找图
              </button>
              <button class="quick-action" @click="addQuickMessage('帮我在网上找一张风景壁纸')">
                <span>💡</span> 联网搜图
              </button>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-wrapper', message.isUser ? 'user-message' : 'ai-message']"
        >
          <div class="message-content">
            <!-- AI头像 -->
            <div v-if="!message.isUser" class="avatar ai-avatar">
              <div class="avatar-inner">
                <svg t="1752463992032" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14464" width="32" height="32"><path d="M966.392 448.741L851.745 249.689a27.039 27.039 0 0 0-23.431-13.544h-42.126l-78.386-135.769a27.04 27.04 0 0 0-23.417-13.52H454.539a27.039 27.039 0 0 0-23.4 13.49l-20.99 36.249-156.729 0.025a27.04 27.04 0 0 0-23.413 13.52L115.084 349.191a27.041 27.041 0 0 0 0 27.04l20.925 36.243-78.386 135.769a27.041 27.041 0 0 0 0 27.04l114.923 199.052a27.04 27.04 0 0 0 23.417 13.52h41.85l78.386 135.769a27.04 27.04 0 0 0 23.417 13.52h229.845a27.04 27.04 0 0 0 23.417-13.52l20.925-36.243h156.773a27.04 27.04 0 0 0 23.417-13.52l114.923-199.052a27.041 27.041 0 0 0 0-27.04l-20.925-36.243 78.386-135.769a27.04 27.04 0 0 0 0.015-27.016zM767.96 557.282l-219.424-0.026 82.291-142.529a4.517 4.517 0 0 0 0-4.507L462.345 118.403h219.439l84.889 147.035 0.003 0.004 84.888 147.032-83.604 144.808z m62.68-90.538h104.516l-78.388 135.767L804.51 512l26.13-45.256z m-208.921-54.27L540.73 552.748 517.204 512l27.429-47.509c0.031-0.054 0.042-0.115 0.07-0.17 0.125-0.24 0.228-0.49 0.31-0.753 0.028-0.091 0.062-0.179 0.084-0.271 0.082-0.341 0.139-0.693 0.139-1.059a4.46 4.46 0 0 0-0.139-1.059c-0.022-0.092-0.056-0.181-0.084-0.272a4.565 4.565 0 0 0-0.31-0.753c-0.029-0.055-0.039-0.116-0.07-0.17L429.711 260.932a4.509 4.509 0 0 0-3.904-2.254h-49.653l78.384-135.768 167.181 289.564zM365.744 258.678h-52.255l-52.259-90.514 156.787-0.024-52.273 90.538z m-62.664 0h-49.655a4.508 4.508 0 0 0-3.904 2.254l-82.29 142.528-23.526-40.748 109.719-190.038 49.656 86.004z m-131.946 156.05l84.891-147.036h54.856l0.009 0.001 0.009-0.001h112.307l109.718 190.039H368.347a4.508 4.508 0 0 0-3.904 2.254L195.961 751.802 86.244 561.763l84.89-147.035z m199.814 52.016h161.975l-23.527 40.749h-54.859c-0.037 0-0.073 0.014-0.11 0.015a4.484 4.484 0 0 0-2.044 0.548c-0.08 0.044-0.154 0.093-0.231 0.142a4.454 4.454 0 0 0-0.652 0.499c-0.068 0.063-0.139 0.122-0.203 0.189a4.439 4.439 0 0 0-0.662 0.86L335.712 708.799a4.515 4.515 0 0 0 0 4.506l24.828 43.003H203.769l167.179-289.564z m-5.205 298.578l26.129 45.257-52.258 90.511-78.384-135.768h104.513z m31.334 54.272l24.826 43.001a4.508 4.508 0 0 0 3.904 2.253h164.579l-23.524 40.749h-219.44l49.655-86.003z m31.331 36.241L344.82 711.052l109.719-190.038 82.288 142.528a4.508 4.508 0 0 0 3.904 2.253h336.963l-109.718 190.04H428.408z m114.923-199.053l-80.987-140.276h47.055l27.427 47.51c0.044 0.076 0.103 0.137 0.152 0.21 0.087 0.134 0.177 0.264 0.279 0.389 0.095 0.115 0.197 0.221 0.301 0.326 0.1 0.1 0.2 0.197 0.311 0.288 0.13 0.107 0.266 0.201 0.406 0.292 0.069 0.046 0.128 0.102 0.2 0.144 0.034 0.02 0.073 0.025 0.107 0.044 0.314 0.17 0.64 0.315 0.984 0.406 0.035 0.01 0.071 0.009 0.107 0.018 0.302 0.072 0.61 0.11 0.92 0.119 0.044 0.001 0.088 0.017 0.132 0.017 0.051 0 0.099-0.018 0.15-0.019 0.062 0.002 0.119 0.018 0.18 0.018l229.505 0.027a4.509 4.509 0 0 0 3.904-2.253l24.841-43.027 53.556 92.759 0.001 0.003 24.83 43.005H543.331z m292.512-199.051l24.828-43.003a4.517 4.517 0 0 0 0-4.507l-82.289-142.529h47.325l109.457 190.039h-99.321z" p-id="14465" fill="#515151"></path></svg>
              </div>
            </div>

            <!-- 消息气泡 -->
            <div class="message-bubble">
              <!-- 图片预览 -->
              <!-- 图片预览 - 修改为小预览图 -->
              <!-- 文件显示 -->
              <!-- 替换现有的文件显示部分 -->
              <div v-if="message.type === 'ai-file' && message.fileInfo" class="file-display">
                <div class="file-item" @click="previewFile(message.fileInfo)">
                  <div class="file-icon">{{ message.fileInfo.icon }}</div>
                  <div class="file-info">
                    <div class="file-name">{{ message.fileInfo.name }}</div>
                    <div class="file-meta">
                      <span class="file-type">{{ message.fileInfo.type.toUpperCase() }}</span>
                      <span v-if="message.fileInfo.size" class="file-size">{{ message.fileInfo.size }}</span>
                    </div>
                  </div>
                  <div class="file-actions">
                    <!-- 预览按钮 -->
                    <button class="file-preview" @click.stop="previewFile(message.fileInfo)" title="预览文件">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    <!-- 下载按钮 -->
                    <button class="file-download" @click.stop="downloadFile(message.fileInfo.url, message.fileInfo.name)" title="下载文件">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="message.imageUrl" class="message-image-preview">
                <div class="message-image-container" @click="previewImage(message.imageUrl)">
                  <img :src="message.imageUrl" alt="上传的图片" />
                  <div class="message-image-overlay">
                    <div class="preview-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>


              <!-- 加载动画 -->
              <div v-if="message.type === 'ai-loading'" class="typing-indicator">
                <div class="typing-dots">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
                <span class="typing-text">分析中...</span>
              </div>

              <!-- 消息内容 -->
              <div v-else class="message-text" v-html="formatMessageok(message.content)"></div>

              <!-- 消息时间和状态 -->
              <div v-if="message.content" class="message-footer">
                <span class="message-time">{{ formatTime(message.time) }}</span>
                <div v-if="message.isUser" class="message-status">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 用户头像部分 -->
            <div v-if="message.isUser" class="avatar user-avatar">
              <div class="avatar-inner">
                <!-- 如果有头像URL则显示图片，否则显示首字母 -->
                <img
                  v-if="getUserAvatar()"
                  :src="getUserAvatar()"
                  :alt="getUserName()"
                  class="avatar-image"
                />
                <span v-else class="avatar-text">{{ getUserInitial() }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <!-- 快捷建议（当输入框为空时显示） -->
        <div v-if="!inputMessage.trim() && messages.length > 1" class="suggestions">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="suggestion-chip"
            @click="addQuickMessage(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
        <!-- 待发送图片预览区域 -->
        <div v-if="pendingImages.length > 0" class="pending-images">
          <div class="pending-images-grid">
            <div
              v-for="image in pendingImages"
              :key="image.id"
              class="pending-image-item"
            >
              <div class="pending-image-preview">
                <img :src="image.url" :alt="image.name" />
                <button
                  class="remove-image-btn"
                  @click="removePendingImage(image.id)"
                  title="移除图片"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="input-container">
          <div class="input-wrapper">
            <!-- 附件按钮 -->
            <button
              class="input-action-btn attachment-btn"
              @click="triggerFileUpload"
              :disabled="connectionStatus === 'connecting'"
              title="上传图片"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59722 21.9983 8.005 21.9983C6.41278 21.9983 4.88583 21.3658 3.76 20.24C2.63417 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63417 12.8758 3.76 11.75L12.33 3.18C13.1045 2.40553 14.1494 1.97455 15.24 1.97455C16.3306 1.97455 17.3755 2.40553 18.15 3.18C18.9245 3.95447 19.3555 4.99939 19.3555 6.09C19.3555 7.18061 18.9245 8.22553 18.15 9L10.2 16.95C9.81267 17.3373 9.29733 17.5537 8.76 17.5537C8.22267 17.5537 7.70733 17.3373 7.32 16.95C6.93267 16.5627 6.71634 16.0473 6.71634 15.51C6.71634 14.9727 6.93267 14.4573 7.32 14.07L15.07 6.32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- 文本输入框 -->
            <div class="input-field-container">
              <textarea
                v-model="inputMessage"
                @keydown="handleKeydown"
                @input="adjustTextareaHeight"
                @focus="onInputFocus"
                @blur="onInputBlur"
                placeholder="输入消息或上传图片进行分析..."
                class="message-input"
                ref="messageInput"
                :disabled="connectionStatus === 'connecting'"
                rows="1"
              ></textarea>

              <!-- 字符计数 -->
              <div v-if="inputMessage.length > 100" class="char-count">
                {{ inputMessage.length }}/2000
              </div>
            </div>

            <!-- 发送按钮 -->
            <button
              class="send-button"
              @click="sendMessage"
              :disabled="!canSend"
              :class="{ 'can-send': canSend, 'sending': connectionStatus === 'connecting' }"
              title="发送消息"
            >
              <div class="send-button-content">
                <!-- 发送图标 -->
                <svg v-if="connectionStatus !== 'connecting'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <!-- 加载图标 -->
                <svg v-else class="loading-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept="image/*"
      style="display: none"
      multiple
    />

    <!-- 图片预览模态框 -->
    <!-- 替换现有的图片预览模态框 -->
    <div v-if="previewImageUrl" class="file-modal" @click="closeFilePreview">
      <div class="modal-backdrop"></div>
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div v-if="previewFileInfo" class="modal-title">
            <span class="file-icon-large">{{ previewFileInfo.icon }}</span>
            <div class="file-details">
              <div class="file-name-large">{{ previewFileInfo.name }}</div>
              <div class="file-meta-large">
                <span class="file-type-large">{{ previewFileInfo.type.toUpperCase() }}</span>
                <span v-if="previewFileInfo.size" class="file-size-large">{{ previewFileInfo.size }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="closeFilePreview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- 图片预览 -->
          <div v-if="previewFileInfo?.type === 'image'" class="image-preview-container">
            <img :src="previewImageUrl" :alt="previewFileInfo.name" />
          </div>

          <!-- PDF预览 -->
          <div v-else-if="previewFileInfo?.name.toLowerCase().endsWith('.pdf')" class="pdf-preview-container">
            <iframe :src="previewImageUrl" frameborder="0"></iframe>
          </div>

          <!-- 视频预览 -->
          <div v-else-if="previewFileInfo?.type === 'video'" class="video-preview-container">
            <video controls :src="previewImageUrl" preload="metadata">
              您的浏览器不支持视频播放
            </video>
          </div>

          <!-- 音频预览 -->
          <div v-else-if="previewFileInfo?.type === 'audio'" class="audio-preview-container">
            <audio controls :src="previewImageUrl" preload="metadata">
              您的浏览器不支持音频播放
            </audio>
            <div class="audio-placeholder">
              <div class="audio-icon">🎵</div>
              <div class="audio-name">{{ previewFileInfo.name }}</div>
            </div>
          </div>

          <!-- 文本内容预览 -->
          <div v-else-if="previewImageUrl === 'text-content'" class="text-preview-container">
            <pre class="text-content">{{ previewFileContent }}</pre>
          </div>

          <!-- 不支持预览的文件类型 -->
          <div v-else class="unsupported-preview">
            <div class="unsupported-icon">📄</div>
            <div class="unsupported-message">
              <p>无法预览此文件类型</p>
              <button class="download-button" @click="downloadFile(previewFileInfo.url, previewFileInfo.name)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                下载文件
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-download-btn" @click="downloadFile(previewFileInfo.url, previewFileInfo.name)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            下载
          </button>
        </div>
      </div>
    </div>


    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="grid-pattern"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { chatWithExpertWithFile } from '@/api/aiController'

const loginUserStore = useLoginUserStore()

// 在现有的响应式数据后添加
const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'ogg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', '7z', 'tar', 'gz', 'html']

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

// 获取文件大小
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

// 检测并提取文件链接
const extractFileLinks = (text) => {
  const fileLinks = new Set()

  // 方法1: 使用正则表达式匹配所有URL
  const extensionPattern = supportedExtensions.join('|')
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
        const urlPattern = /^https?:\/\/[^\s]+$/
        if (urlPattern.test(trimmed)) {
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
    /\[([^\]]+)\]/g,
    /\(([^\)]+)\)/g,
    /"([^"]+)"/g,
    /'([^']+)'/g,
    /`([^`]+)`/g,
    /<([^>]+)>/g
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
// 在现有的响应式数据中添加
const previewFileInfo = ref(null) // 当前预览的文件信息
const previewFileContent = ref('') // 文件内容（用于文本文件）

// 文件预览函数
const previewFile = async (fileInfo) => {
  previewFileInfo.value = fileInfo

  // 根据文件类型处理预览
  switch (fileInfo.type) {
    case 'image':
      // 图片直接使用URL
      previewImageUrl.value = fileInfo.url
      break

    case 'document':
      if (fileInfo.name.toLowerCase().endsWith('.pdf')) {
        // PDF文件
        previewImageUrl.value = fileInfo.url
      } else {
        // 其他文档类型，尝试获取文本内容
        await loadTextContent(fileInfo.url)
      }
      break

    case 'video':
    case 'audio':
      // 视频和音频文件直接使用URL
      previewImageUrl.value = fileInfo.url
      break

    default:
      // 其他文件类型，尝试作为文本处理
      await loadTextContent(fileInfo.url)
      break
  }
}

// 加载文本内容
const loadTextContent = async (url) => {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const text = await response.text()
      previewFileContent.value = text
      previewImageUrl.value = 'text-content' // 标记为文本内容
    } else {
      previewFileContent.value = '无法加载文件内容'
      previewImageUrl.value = 'text-content'
    }
  } catch (error) {
    console.error('加载文件内容失败:', error)
    previewFileContent.value = '加载文件内容时出错'
    previewImageUrl.value = 'text-content'
  }
}

// 关闭文件预览
const closeFilePreview = () => {
  previewImageUrl.value = null
  previewFileInfo.value = null
  previewFileContent.value = ''
}

// 修改现有的 closeImagePreview 函数
const closeImagePreview = () => {
  closeFilePreview()
}

// 下载文件
const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 设置页面标题和元数据
useHead({
  title: 'AI 图像顾问 - 智能视觉分析助手',
  meta: [
    {
      name: 'description',
      content: '专业的AI图像分析工具，提供构图分析、色彩建议、设计灵感等服务'
    },
    {
      name: 'keywords',
      content: 'AI图像分析,视觉设计,色彩分析,构图建议,设计助手'
    }
  ]
})

const router = useRouter()

// 响应式数据
const messages = ref([])
const chatId = ref('')
const connectionStatus = ref('disconnected')
const inputMessage = ref('')
const messagesContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)
const previewImageUrl = ref(null)
const isInputFocused = ref(false)

// 快捷建议
const suggestions = ref([
  '分析这张图片的构图',
  '帮我搜一张山水壁纸图片给我',
  '帮我在本站找一张和我上传的这张图片的色系一样的图片给我',
  '帮我在本站找一张壁纸'
])

// 计算属性
// 修改 canSend 计算属性
const canSend = computed(() => {
  return (inputMessage.value.trim() || pendingImages.value.length > 0) && connectionStatus.value !== 'connecting'
})


// 生成聊天ID
const generateChatId = () => {
  return 'ai_' + Math.random().toString(36).substring(2, 10)
}

// 获取用户首字母
const getUserInitial = () => {
  return 'U' // 可以根据实际用户信息修改
}

// 添加消息
// 修改现有的 addMessage 函数
// 修改现有的 addMessage 函数
const addMessage = (content, isUser, imageUrl = null, type = null, fileInfo = null) => {
  messages.value.push({
    content,
    isUser,
    imageUrl,
    type: type || (isUser ? 'user-message' : 'ai-message'),
    time: new Date().getTime(),
    fileInfo // 添加文件信息字段
  })

  nextTick(() => {
    scrollToBottom()
  })
}
// 在现有函数后添加
// 添加一个Set来跟踪已处理的消息，避免重复处理
const processedMessages = new Set()

// 修改 processMessageWithFiles 函数
const processMessageWithFiles = async (content, type = 'ai-message') => {
  // 创建内容的唯一标识符
  const contentId = content + '_' + Date.now()

  // 如果已经处理过这个内容，直接返回
  if (processedMessages.has(content)) {
    addMessage(content, false, null, type)
    return
  }

  const fileLinks = extractFileLinks(content)

  if (fileLinks.length === 0) {
    // 没有文件链接，正常显示
    addMessage(content, false, null, type)
    return
  }

  // 标记为已处理
  processedMessages.add(content)

  // 分离文本和文件链接
  let textContent = content
  const fileInfos = []

  // 移除所有检测到的文件链接
  fileLinks.forEach(link => {
    const escapedLink = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const linkRegex = new RegExp(escapedLink, 'g')
    textContent = textContent.replace(linkRegex, '')
  })

  // 清理多余的分隔符和空格
  textContent = textContent
    .replace(/[,\s]+/g, ' ')
    .replace(/^\s*[,;|]\s*|\s*[,;|]\s*$/g, '')
    .trim()

  for (const link of fileLinks) {
    const fileType = getFileType(link)
    const fileName = link.split('/').pop().split('?')[0]
    const fileIcon = getFileIcon(fileType)
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
    addMessage(textContent, false, null, type)
  }

  // 为每个文件创建单独的消息气泡
  fileInfos.forEach(fileInfo => {
    addMessage('', false, null, 'ai-file', fileInfo)
  })
}




// 格式化消息内容
// 替换现有的 formatMessageok 函数
// 替换现有的 formatMessageok 函数，移除文件检测逻辑
const formatMessageok = (content) => {
  // 只处理 Markdown 格式，不在这里检测文件链接
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}



// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) { // 小于1分钟
    return '刚刚'
  } else if (diff < 3600000) { // 小于1小时
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (date.toDateString() === now.toDateString()) { // 今天
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 调整文本框高度
const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    const scrollHeight = messageInput.value.scrollHeight
    const maxHeight = 120
    messageInput.value.style.height = Math.min(scrollHeight, maxHeight) + 'px'
  }
}

// 处理键盘事件
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 输入框焦点事件
const onInputFocus = () => {
  isInputFocused.value = true
}

const onInputBlur = () => {
  isInputFocused.value = false
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click()
}
// 在现有的响应式数据后添加
const pendingImages = ref([]) // 待发送的图片列表

// 处理文件上传
// 替换现有的 handleFileUpload 函数
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      const imageId = Date.now() + Math.random() // 生成唯一ID
      pendingImages.value.push({
        id: imageId,
        file: file,
        url: imageUrl,
        name: file.name
      })
    }
  })
  // 重置文件输入
  event.target.value = ''
}

// 添加移除待发送图片的函数
const removePendingImage = (imageId) => {
  const index = pendingImages.value.findIndex(img => img.id === imageId)
  if (index > -1) {
    // 释放 URL 对象
    URL.revokeObjectURL(pendingImages.value[index].url)
    pendingImages.value.splice(index, 1)
  }
}

// 清空待发送图片
const clearPendingImages = () => {
  pendingImages.value.forEach(img => {
    URL.revokeObjectURL(img.url)
  })
  pendingImages.value = []
}


// 快捷消息
const addQuickMessage = (message) => {
  inputMessage.value = message
  nextTick(() => {
    messageInput.value?.focus()
    adjustTextareaHeight()
  })
}

// 发送消息（支持文件上传）
const sendMessageWithFile = async (message, file = null, imageUrl = null) => {
  if (!message.trim() && !file) return

  // 添加用户消息
  addMessage(message, true, imageUrl)

  // 清空输入
  inputMessage.value = ''
  adjustTextareaHeight()

  // 设置加载状态
  connectionStatus.value = 'connecting'

  // 添加AI加载消息
  const loadingMessageIndex = messages.value.length
  addMessage('', false, null, 'ai-loading')

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))

    // 模拟响应
    const mockResponse = file
      ? "我已经收到了您上传的图片。这是一张构图很好的照片，具有有趣的光线和色彩平衡。构图有效地遵循了三分法则，色彩搭配创造了和谐的视觉体验。\n\n**主要观察：**\n- 构图平衡性良好\n- 色彩层次丰富\n- 光影处理恰当\n\n您希望我重点分析哪个方面呢？比如色彩理论、构图技巧或者提供创意改进建议？"
      : "我是您的AI图像分析助手！我可以帮助您分析图片的各个方面，包括构图、色彩、设计元素等。请上传一张图片，或者告诉我您的设计需求。"

    // 更新加载消息为实际响应
    messages.value[loadingMessageIndex].content = mockResponse
    messages.value[loadingMessageIndex].type = 'ai-message'

    connectionStatus.value = 'disconnected'

  } catch (error) {
    console.error('API调用失败:', error)

    // 更新AI消息为错误信息
    messages.value[loadingMessageIndex].content = `抱歉，AI服务暂时不可用${error.message ? '：' + error.message : ''}`
    messages.value[loadingMessageIndex].type = 'ai-error'

    connectionStatus.value = 'error'
  }
}

// 发送消息
const sendMessage = () => {
  if (canSend.value || pendingImages.value.length > 0) {
    const message = inputMessage.value.trim() || '请分析这些图片'
    const images = [...pendingImages.value] // 复制数组

    // 发送消息
    sendMessageWithImages(message, images)

    // 清空输入但不释放已发送图片的URL
    inputMessage.value = ''

    // 只清空待发送列表，不释放URL
    pendingImages.value = []

    adjustTextareaHeight()
  }
}


// 修改 sendMessageWithImages 函数
// 临时调试版本 - 帮助我们理解真实的API响应
// 修改 sendMessageWithImages 函数中处理AI响应的部分
const sendMessageWithImages = async (message, images = []) => {
  if (!message.trim() && images.length === 0) return

  const persistentImages = images.map(img => ({
    ...img,
    persistentUrl: img.url
  }))

  if (persistentImages.length > 0) {
    persistentImages.forEach(img => {
      addMessage(message, true, img.persistentUrl)
    })
  } else {
    addMessage(message, true)
  }

  connectionStatus.value = 'connecting'
  const loadingMessageIndex = messages.value.length
  addMessage('', false, null, 'ai-loading')

  try {
    const file = persistentImages.length > 0 ? persistentImages[0].file : undefined

    console.log('发送请求:', message, file)

    const response = await chatWithExpertWithFile(message, chatId.value, file)

    console.log('响应类型:', typeof response)
    console.log('响应内容:', response)

    let aiResponse = ''

    if (typeof response === 'string') {
      aiResponse = response
    } else if (response && response.code === 0 && response.data) {
      aiResponse = response.data
    } else if (response && response.data) {
      aiResponse = response.data
    } else if (response && response.message) {
      aiResponse = response.message
    } else {
      aiResponse = String(response)
    }

    // 移除加载消息
    messages.value.splice(loadingMessageIndex, 1)

    // 处理AI响应中的文件链接
    await processMessageWithFiles(aiResponse, 'ai-message')

    connectionStatus.value = 'disconnected'

  } catch (error) {
    console.error('API调用失败:', error)

    // 移除加载消息并添加错误消息
    messages.value.splice(loadingMessageIndex, 1)
    addMessage(`抱歉，AI服务暂时不可用：${error.message || error}`, false, null, 'ai-error')
    connectionStatus.value = 'error'
  }
}




// 清空聊天
const clearChat = () => {
  if (confirm('确定要清空所有对话吗？')) {
    messages.value = []
    chatId.value = generateChatId()
    // 添加欢迎消息
    addMessage('欢迎使用AI图像顾问！我可以帮助您分析图像风格、颜色、构图等视觉元素，并提供专业的设计建议和创意灵感。请上传一张图片进行分析，或告诉我您的设计需求。还可以让我帮您寻找图片素材', false)
  }
}

// 图片预览
const previewImage = (imageUrl) => {
  previewImageUrl.value = imageUrl
}



// 返回
const goBack = () => {
  router.push('/yoopic_agent')
}
const getUserAvatar = () => {
  return loginUserStore.loginUser?.userAvatar || null
}
// 获取用户名称
const getUserName = () => {
  return loginUserStore.loginUser?.userName ?? '无名'
}
// 页面加载逻辑
onMounted(() => {
  // 生成聊天ID
  chatId.value = generateChatId()
  if (!loginUserStore.loginUser?.id) {
    router.replace('/user/login')
    return
  }
  // 添加欢迎消息
  addMessage('欢迎使用AI图像顾问！我可以帮助您分析图像风格、颜色、构图等视觉元素，并提供专业的设计建议和创意灵感。请上传一张图片进行分析，或告诉我您的设计需求。', false)
})

// 监听消息变化，自动滚动
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* 采用提供的配色方案 */
  --primary-blue: #1e40af;
  --primary-blue-light: #3b82f6;
  --secondary-purple: #7c3aed;
  --secondary-purple-light: #8b5cf6;
  --accent-emerald: #10b981;
  --accent-orange: #f59e0b;
  --accent-pink: #ec4899;

  /* 文字颜色 */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-placeholder: #94a3b8;

  /* 背景颜色 */
  --background-primary: #ffffff;
  --background-secondary: #f1f5f9;
  --background-tertiary: #e2e8f0;
  --background-chat: #f8fafc;

  /* 边框颜色 */
  --border-light: #cbd5e1;
  --border-medium: #94a3b8;
  --border-focus: #3b82f6;

  /* 阴影系统 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* 圆角 */
  --radius-sm: 6px;
  --radius: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* 动画 */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  box-sizing: border-box;
}

.ai-chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.08;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-purple));
  top: -200px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--accent-emerald), var(--accent-orange));
  bottom: -150px;
  left: -150px;
  animation: float 25s ease-in-out infinite reverse;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(30, 64, 175, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 64, 175, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.6;
}

/* 顶部导航栏优化 */
/* 新增头部中心区域样式 */
.header-center {
  flex: 1; /* 关键！让中间区域占据剩余空间 */
  min-width: 20px; /* 防止文本溢出挤压布局 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem; /* 添加内边距防止边缘挤压 */
}

/* 增强标题样式 */
.title {
  font-size: 1.25rem; /* 确保字体大小合适 */
  font-weight: 700;
  white-space: nowrap; /* 禁止标题换行 */
  overflow: hidden;
  text-overflow: ellipsis; /* 文本过长时显示省略号 */
}
.header-left,
.header-right {
  flex: 0 0 auto; /* 左右区域根据内容自适应 */
}

/* 确保右侧按钮布局 */
.header-right .action-buttons {
  display: flex;
  align-items: center;
  gap: 1rem; /* 按钮间增加间距 */
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background: linear-gradient(145deg,
  rgba(255, 255, 255, 0.95),
  rgba(248, 250, 252, 0.92),
  rgba(241, 245, 249, 0.9)
  );
  backdrop-filter: blur(25px) saturate(180%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 65px;
  box-shadow:
    0 8px 32px -8px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  transition: var(--transition);
}

/* 返回按钮优化 */
.back-button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.9),
  rgba(248, 250, 252, 0.8)
  );
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 12px -4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(59, 130, 246, 0.1),
  transparent
  );
  transition: left 0.6s ease;
}

.back-button:hover::before {
  left: 100%;
}

.back-button:hover {
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.95),
  rgba(59, 130, 246, 0.05)
  );
  border-color: rgba(59, 130, 246, 0.3);
  color: var(--primary-blue);
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 8px 20px -6px rgba(59, 130, 246, 0.25),
    0 4px 12px -4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* AI图标优化 */
.ai-icon {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg,
  var(--primary-blue),
  var(--primary-blue-light),
  var(--secondary-purple)
  );
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow:
    0 12px 24px -8px rgba(59, 130, 246, 0.4),
    0 8px 16px -6px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: var(--transition);
}

.ai-icon::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg,
  var(--primary-blue),
  var(--secondary-purple),
  var(--accent-emerald)
  );
  border-radius: 1.375rem;
  z-index: -1;
  opacity: 0;
  transition: var(--transition);
}

.ai-icon:hover::after {
  opacity: 0.6;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-pulse {
  position: absolute;
  width: 120%;
  height: 120%;
  border-radius: 1.5rem;
  background: linear-gradient(135deg,
  var(--primary-blue),
  var(--secondary-purple)
  );
  opacity: 0.2;
  animation: aiPulse 3s ease-in-out infinite;
}

@keyframes aiPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.05;
  }
}

/* 标题区域优化 */

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 右侧操作按钮优化 */
.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 1.125rem;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.9),
  rgba(248, 250, 252, 0.8)
  );
  border: 1px solid rgba(226, 232, 240, 0.6);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 12px -4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(239, 68, 68, 0.1),
  transparent
  );
  transition: left 0.6s ease;
}

.icon-button:hover::before {
  left: 100%;
}

.icon-button:hover {
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.95),
  rgba(239, 68, 68, 0.05)
  );
  color: #ef4444;
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 8px 20px -6px rgba(239, 68, 68, 0.25),
    0 4px 12px -4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(239, 68, 68, 0.3);
}

.chat-id {
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg,
  rgba(241, 245, 249, 0.8),
  rgba(226, 232, 240, 0.6)
  );
  border: 1px solid rgba(203, 213, 225, 0.5);
  border-radius: 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-tertiary);
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  letter-spacing: 0.025em;
  box-shadow:
    0 2px 8px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .header {
    padding: 1rem 1.25rem;
    height: 72px;
  }

  .title {
    font-size: 1.25rem;
  }

  .ai-icon {
    width: 42px;
    height: 42px;
    border-radius: 1rem;
  }

  .back-button {
    padding: 0.75rem 1rem;
    border-radius: 0.875rem;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 0.875rem 1rem;
    height: 68px;
  }

  .chat-id {
    display: none;
  }

  .ai-icon {
    width: 38px;
    height: 38px;
  }
}


@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

.title-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.subtitle {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--background-primary);
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.icon-button:hover {
  background: var(--background-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.chat-id {
  padding: 0.5rem 0.75rem;
  background: var(--background-tertiary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

/* 主聊天区域 - 确保固定高度和flex布局 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  height: calc(100vh - 80px); /* 确保固定高度，减去header高度 */
  position: relative;
  z-index: 10;
  overflow: hidden; /* 防止整体滚动 */
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: center;
  padding: 1rem 1rem 2rem;
}

.welcome-card {
  max-width: 480px; /* 从420px增加到600px，更宽 */
  text-align: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95));
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: 2rem;
  padding: 1rem 1rem; /* 减少上下padding：从2rem 1.5rem改为1.5rem 2rem，高度更小 */
  box-shadow:
    0 25px 50px -12px rgba(30, 64, 175, 0.08),
    0 8px 16px -8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transform: translateY(-10px);
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-blue), var(--secondary-purple), var(--accent-emerald), var(--accent-orange));
  border-radius: 2rem 2rem 0 0;
}

.welcome-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

.welcome-icon {
  width: 56px; /* 从64px减小到56px，减少高度 */
  height: 56px;
  margin: 0 auto 1rem; /* 从1.5rem减小到1rem */
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-purple));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow:
    0 20px 40px -12px rgba(30, 64, 175, 0.4),
    0 8px 16px -8px rgba(124, 58, 237, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.welcome-icon svg {
  width: 24px;
  height: 24px;
}

.welcome-card h3 {
  margin: 0 0 0.75rem 0; /* 从1rem减小到0.75rem */
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary), var(--primary-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-card p {
  margin: 0 0 1.5rem 0; /* 从2rem减小到1.5rem */
  color: var(--text-secondary);
  line-height: 1.5; /* 从1.6减小到1.5 */
  font-size: 0.9rem;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.9));
  border: 1px solid rgba(203, 213, 225, 0.5);
  border-radius: 1rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.quick-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s;
}

.quick-action:hover::before {
  left: 100%;
}

.quick-action:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(59, 130, 246, 0.05));
  color: var(--primary-blue);
  transform: translateY(-3px);
  box-shadow:
    0 10px 20px -5px rgba(59, 130, 246, 0.15),
    0 6px 10px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.2);
}
@media (max-width: 768px) {
  .chat-main {
    height: calc(100vh - 64px); /* header高度调整 */
  }

  .input-section {
    padding: 1.25rem 1rem 1.75rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
}
@media (max-width: 640px) {
  .input-section {
    padding: 1rem 0.75rem 1.5rem;
    border-radius: 1.25rem 1.25rem 0 0;
  }
}
/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-section {
    padding: 0.5rem 1rem 1.5rem;
  }

  .welcome-card {
    max-width: 520px; /* 保持相对较宽 */
    padding: 1.25rem 1.5rem; /* 减少高度 */
    border-radius: 1.5rem;
  }

  .welcome-card h3 {
    font-size: 1.25rem;
  }

  .welcome-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 0.75rem;
  }
}

@media (max-width: 600px) {
  .welcome-section {
    padding: 0.5rem 0.5rem 1rem;
  }

  .welcome-card {
    max-width: 90%; /* 使用百分比保持较宽 */
    padding: 1rem 1.25rem; /* 进一步减少高度 */
    border-radius: 1.25rem;
  }

  .welcome-icon {
    width: 44px;
    height: 44px;
    border-radius: 0.75rem;
    margin: 0 auto 0.5rem;
  }

  .welcome-icon svg {
    width: 20px;
    height: 20px;
  }

  .quick-action {
    border-radius: 0.75rem;
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
  }
}




/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  scroll-behavior: smooth;
  height: 0;
  max-height: calc(100vh - 260px);
  min-height: 200px;

  /* 自定义滚动条样式 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(203, 213, 225, 0.3) transparent; /* Firefox */
}

.message-wrapper {
  margin-bottom: 1.5rem;
  animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-wrapper.ai-message {
  margin-right: 15%;
}

.message-wrapper.user-message {
  margin-left: 15%;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.user-message .message-content {
  flex-direction: row-reverse;
}
/* 头像样式 - 改为圆形 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 改为圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

/* AI头像样式 */
.ai-avatar .avatar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  border-radius: 50%; /* 改为圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.ai-avatar .avatar-inner::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
  border-radius: 50%; /* 改为圆形 */
}

/* 用户头像样式 */
.user-avatar .avatar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-emerald), var(--accent-orange));
  border-radius: 50%; /* 改为圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
}

/* 用户头像图片样式 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%; /* 改为圆形 */
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* 用户头像文字样式 */
.avatar-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 消息布局 - 确保用户头像在右侧 */
.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

/* 用户消息：头像在右侧，消息气泡在左侧 */
.user-message .message-content {
  flex-direction: row;
  justify-content: flex-start;
}

/* AI消息：头像在左侧，消息气泡在右侧 */
.ai-message .message-content {
  flex-direction: row;
  justify-content: flex-start;
}

/* 头像悬停效果 */
.avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
  transition: var(--transition);
}

.ai-avatar:hover .avatar-inner {
  background: linear-gradient(135deg, var(--primary-blue-light), var(--secondary-purple));
}

.user-avatar:hover .avatar-inner {
  background: linear-gradient(135deg, var(--accent-emerald), var(--accent-pink));
}

/* 为没有头像的用户提供更好的渐变效果 */
.user-avatar .avatar-inner::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.15));
  border-radius: 50%; /* 改为圆形 */
  pointer-events: none;
}

/* 响应式头像大小调整 */
@media (max-width: 768px) {
  .avatar {
    width: 36px;
    height: 36px;
  }

  .avatar-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .avatar {
    width: 32px;
    height: 32px;
  }

  .avatar-text {
    font-size: 0.75rem;
  }
}

/* 头像加载状态和动画 */
.avatar-image {
  transition: var(--transition);
}

.avatar-image:hover {
  transform: scale(1.1);
}

/* 确保头像容器的圆形边界 */
.avatar-inner {
  border-radius: 50% !important;
  overflow: hidden;
}



/* 消息气泡 */
.message-bubble {
  flex: 1;
  min-width: 0;
  padding: 1rem 1.25rem;
  line-height: 1;
  font-size: 0.8rem;
  word-wrap: break-word;
  position: relative;
  max-width: 75%;
  border: none;
  transition: var(--transition);
}

/* AI消息气泡 - 尖角在左上角指向AI头像 */
.ai-message .message-bubble {
  background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
  color: var(--text-primary);
  border-radius: 0.3rem 1.5rem 1.5rem 1.5rem; /* 左上角小圆角 */
  box-shadow:
    0 8px 16px -4px rgba(0, 0, 0, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(203, 213, 225, 0.3);
  position: relative;
  margin-left: 8px; /* 给尖角留出空间 */
}

/* AI消息气泡的三角形尖角 - 左上角指向AI头像 */
.ai-message .message-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px; /* 改为 top，而不是 bottom */
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right-color: #e2e8f0; /* 匹配气泡颜色 */
  border-left: none;
  filter: drop-shadow(-1px 0px 1px rgba(203, 213, 225, 0.3));
}

/* 用户消息气泡 - 尖角在右上角指向用户头像 */
.user-message .message-bubble {
  background: linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9);
  color: white;
  border-radius: 1.5rem 0.3rem 1.5rem 1.5rem; /* 右上角小圆角 */
  box-shadow:
    0 8px 16px -4px rgba(59, 130, 246, 0.4),
    0 4px 8px -2px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.2);
  position: relative;
  margin-right: 8px; /* 给尖角留出空间 */
}

/* 用户消息气泡的三角形尖角 - 右上角指向用户头像 */
.user-message .message-bubble::before {
  content: '';
  position: absolute;
  right: -8px;
  top: 12px; /* 改为 top，而不是 bottom */
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: #0ea5e9;
  border-right: none;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  filter: drop-shadow(1px 0px 1px rgba(59, 130, 246, 0.3));
}


/* 消息底部信息样式优化 */
.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  opacity: 0.8;
}

.user-message .message-footer {
  color: rgba(255, 255, 255, 0.8);
}

.message-status {
  color: var(--accent-emerald);
}

.user-message .message-status {
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .ai-message .message-bubble {
    border-radius: 1.5rem 1.5rem 1.5rem 0.4rem;
  }

  .user-message .message-bubble {
    border-radius: 1.5rem 1.5rem 0.4rem 1.5rem;
  }
}

@media (max-width: 640px) {
  .message-bubble {
    max-width: 90%;
  }
}


/* 图片预览 */
.image-preview {
  position: relative;
  margin-bottom: 0.75rem;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  display: block;
  border-radius: var(--radius);
  transition: var(--transition);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.preview-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.preview-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* 输入提示动画 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-blue);
  animation: typingDot 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
.typing-dot:nth-child(3) { animation-delay: 0s; }

@keyframes typingDot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.typing-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* 消息底部信息 */
.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.user-message .message-footer {
  color: rgba(255, 255, 255, 0.7);
}

.message-status {
  color: var(--accent-emerald);
}

.user-message .message-status {
  color: rgba(255, 255, 255, 0.8);
}

/* 输入区域 - 更美观的圆角设计 */
.input-section {
  padding: 1.5rem 1.5rem 2rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(25px);
  border-top: 1px solid rgba(203, 213, 225, 0.3);
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 10;
  flex-shrink: 0; /* 关键：防止输入区域被压缩 */
  min-height: 120px; /* 给输入区域一个最小高度 */
  //max-height: 80px;
  box-shadow:
    0 -10px 25px -5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* 输入区域装饰效果 */
.input-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-blue), var(--secondary-purple));
  border-radius: 2px;
  opacity: 0.3;
}

.suggestions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  padding-top: 0px;
  padding:0;
}

.suggestion-chip {
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.9));
  border: 1px solid rgba(203, 213, 225, 0.4);
  border-radius: 1.5rem; /* 更大的圆角 */
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.suggestion-chip::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s;
}

.suggestion-chip:hover::before {
  left: 100%;
}

.suggestion-chip:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(59, 130, 246, 0.05));
  color: var(--primary-blue);
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow:
    0 8px 15px -3px rgba(59, 130, 246, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.input-container {
  max-width: 100%;
  position: relative;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  border: 2px solid rgba(203, 213, 225, 0.3);
  border-radius: 2rem; /* 更大的圆角 */
  padding: 1rem 1.25rem;
  gap: 1rem;
  transition: var(--transition);
  position: relative;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.input-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
  border-radius: 2rem;
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.input-wrapper:focus-within {
  border-color: var(--primary-blue);
  box-shadow:
    0 15px 35px -5px rgba(59, 130, 246, 0.2),
    0 8px 15px -6px rgba(59, 130, 246, 0.1),
    0 0 0 4px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.input-wrapper:focus-within::before {
  opacity: 1;
}

/* 输入控件样式优化 */
.input-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 1.25rem; /* 更圆润 */
  border: none;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.attachment-btn {
  background: linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.6));
  color: var(--text-secondary);
  border: 1px solid rgba(203, 213, 225, 0.3);
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.attachment-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(241, 245, 249, 0.8));
  color: var(--text-primary);
  transform: scale(1.05) translateY(-1px);
  box-shadow:
    0 6px 12px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.2);
}

/* 发送按钮优化 - 移除can-send状态的样式变化 */
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 1.25rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.6));
  color: var(--text-secondary);
  border: 1px solid rgba(203, 213, 225, 0.3);
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* 移除can-send状态的样式，保持一致 */
.send-button.can-send {
  background: linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.6));
  color: var(--text-secondary);
  border: 1px solid rgba(203, 213, 225, 0.3);
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* 统一悬停效果 */
.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(241, 245, 249, 0.8));
  color: var(--text-primary);
  transform: scale(1.05) translateY(-1px);
  box-shadow:
    0 6px 12px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border-color: rgba(59, 130, 246, 0.2);
}

/* 保持发送状态的样式 */
.send-button.sending {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: white;
  border-color: transparent;
}


/* 响应式优化 */
@media (max-width: 768px) {
  .input-section {
    padding: 1rem 0.75rem 1.5rem;
    border-radius: 1.25rem 1.25rem 0 0;
  }

  .input-wrapper {
    border-radius: 1.5rem;
    padding: 0.875rem 1rem;
    gap: 0.875rem;
  }

  .input-action-btn,
  .send-button {
    width: 40px;
    height: 40px;
    border-radius: 1rem;
  }
}

@media (max-width: 640px) {
  .input-section {
    padding: 1rem 0.75rem 1.5rem;
    border-radius: 1.25rem 1.25rem 0 0;
  }

  .input-wrapper {
    border-radius: 1.25rem;
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .suggestion-chip {
    border-radius: 1.25rem;
    padding: 0.625rem 1rem;
  }
}


/* 图片模态框 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.modal-content img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* 输入字段容器 */
.input-field-container {
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 消息输入框样式 */
.message-input {
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
  placeholder-color: var(--text-placeholder);
  overflow-y: auto;
  transition: var(--transition);
}

.message-input::placeholder {
  color: var(--text-placeholder);
  opacity: 0.8;
}

.message-input:focus {
  outline: none;
}

/* 字符计数样式 */
.char-count {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-main {
    height: calc(100vh - 72px); /* 调整header高度 */
  }
  .messages-container {
    max-height: calc(100vh - 240px);
    padding: 1rem 0.75rem;
  }
  .input-section {
    padding: 1.25rem 1rem 1.75rem;
    border-radius: 1.5rem 1.5rem 0 0;
    min-height: 100px;
  }
}
@media (max-width: 640px) {
  .chat-main {
    height: calc(100vh - 68px); /* 调整header高度 */
  }
  .messages-container {
    max-height: calc(100vh - 220px);
  }
  .input-section {
    padding: 1rem 0.75rem 1.5rem;
    border-radius: 1.25rem 1.25rem 0 0;
    min-height: 90px;
  }
}
@media (max-width: 768px) {
  .message-input {
    font-size: 0.875rem;
    min-height: 40px;
  }
}

@media (max-width: 640px) {
  .message-input {
    font-size: 0.8rem;
    min-height: 36px;
  }
}


@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
    height: 64px;
  }

  .title {
    font-size: 1.125rem;
  }

  .ai-icon {
    width: 36px;
    height: 36px;
  }

  .chat-main {
    height: calc(100vh - 64px);
    padding: 0 0.5rem;
  }

  .message-wrapper.ai-message {
    margin-right: 5%;
  }

  .message-wrapper.user-message {
    margin-left: 5%;
  }

  .messages-container {
    padding: 1rem 0.75rem;
  }

  .message-bubble {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .input-section {
    padding: 1rem;
  }

  .welcome-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 0.75rem;
  }

  .header-right .chat-id {
    display: none;
  }

  .title {
    font-size: 1rem;
  }

  .back-button span {
    display: none;
  }

  .message-wrapper.ai-message,
  .message-wrapper.user-message {
    margin-left: 0;
    margin-right: 0;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-action {
    width: 100%;
    justify-content: center;
  }

  .welcome-card {
    padding: 1.5rem 1rem;
  }

  .welcome-icon {
    width: 64px;
    height: 64px;
  }

  .chat-main {
    padding: 0;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  :root {
    --border-light: #94a3b8;
    --border-medium: #64748b;
    --text-secondary: #334155;
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
/* 待发送图片预览区域 */
.pending-images {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.9));
  border: 1px solid rgba(203, 213, 225, 0.4);
  border-radius: 1rem;
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.pending-images-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pending-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.clear-all-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.pending-images-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.pending-image-item {
  flex-shrink: 0;
  width: 80px;
}

.pending-image-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--background-secondary);
  border: 2px solid rgba(203, 213, 225, 0.3);
  transition: var(--transition);
}

.pending-image-preview:hover {
  border-color: var(--primary-blue);
  transform: scale(1.02);
  box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.2);
}

.pending-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  opacity: 0;
}

.pending-image-preview:hover .remove-image-btn {
  opacity: 1;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.pending-image-name {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .pending-images-grid {
    gap: 0.5rem;
  }

  .pending-image-item {
    width: 60px;
  }

  .pending-image-preview {
    width: 60px;
    height: 60px;
  }

  .pending-image-name {
    max-width: 60px;
  }
}
/* 消息中的图片预览样式 */
.message-image-preview {
  margin-bottom: 0.75rem;
}

.message-image-container {
  position: relative;
  width: 120px; /* 固定小预览图宽度 */
  height: 120px; /* 固定小预览图高度 */
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.05);
}

/* AI消息中的图片样式 */
.ai-message .message-image-container {
  border-color: rgba(203, 213, 225, 0.4);
  background: rgba(241, 245, 249, 0.3);
}

/* 用户消息中的图片样式 */
.user-message .message-image-container {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.message-image-container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.3);
}

.ai-message .message-image-container:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.3);
}

.user-message .message-image-container:hover {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 25px -8px rgba(255, 255, 255, 0.3);
}

.message-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: var(--transition);
}

.message-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.1)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
  backdrop-filter: blur(2px);
}

.message-image-container:hover .message-image-overlay {
  opacity: 1;
}

.preview-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-message .preview-icon {
  background: rgba(255, 255, 255, 0.95);
  color: var(--primary-blue);
}

.preview-icon:hover {
  transform: scale(1.1);
  background: white;
}

/* 多张图片时的网格布局 */
.message-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  max-width: 280px; /* 限制最大宽度 */
}

/* 当有多张图片时使用网格布局 */
.message-images-grid .message-image-container {
  width: 100%;
  height: 120px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-image-container {
    width: 100px;
    height: 100px;
  }

  .message-images-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    max-width: 240px;
  }

  .message-images-grid .message-image-container {
    height: 100px;
  }

  .preview-icon {
    width: 32px;
    height: 32px;
  }

  .preview-icon svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 640px) {
  .message-image-container {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
  }

  .message-images-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    max-width: 200px;
    gap: 0.375rem;
  }

  .message-images-grid .message-image-container {
    height: 80px;
  }

  .preview-icon {
    width: 28px;
    height: 28px;
  }

  .preview-icon svg {
    width: 14px;
    height: 14px;
  }
}

/* 图片加载状态 */
.message-image-container img {
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.05) 25%,
    transparent 25%,
    transparent 75%,
    rgba(0, 0, 0, 0.05) 75%
  );
  background-size: 20px 20px;
  animation: loading-shimmer 2s linear infinite;
}

@keyframes loading-shimmer {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}

.message-image-container img[src] {
  background: none;
  animation: none;
}

/* 图片错误状态 */
.message-image-container img:not([src]),
.message-image-container img[src=""] {
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.message-image-container img:not([src])::before,
.message-image-container img[src=""]::before {
  content: '图片加载失败';
}
/* 文件显示样式 */
.file-display {
  margin-bottom: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
  border-radius: 1rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.file-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.9));
  border-color: var(--primary-blue);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -6px rgba(59, 130, 246, 0.25);
}

.file-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-tertiary), var(--background-secondary));
  border-radius: 0.75rem;
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.file-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.file-type {
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-blue);
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.file-size {
  color: var(--text-secondary);
}

.file-download {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: white;
  text-decoration: none;
  transition: var(--transition);
  flex-shrink: 0;
}

.file-download:hover {
  background: linear-gradient(135deg, var(--primary-blue-light), var(--secondary-purple));
  transform: scale(1.05);
}

/* 用户消息中的文件样式 */
.user-message .file-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.3);
}

.user-message .file-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
  border-color: rgba(255, 255, 255, 0.5);
}

.user-message .file-name {
  color: white;
}

.user-message .file-type {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.user-message .file-size {
  color: rgba(255, 255, 255, 0.8);
}

.user-message .file-icon {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .file-item {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .file-icon {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }

  .file-download {
    width: 32px;
    height: 32px;
  }
}
/* 修改原有的文件显示样式 */
.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
  border-radius: 1rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  cursor: pointer; /* 添加点击手势 */
}

.file-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.9));
  border-color: var(--primary-blue);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -6px rgba(59, 130, 246, 0.25);
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.file-preview,
.file-download {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.625rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.file-preview {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  color: var(--primary-blue);
}

.file-preview:hover {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: black;
  transform: scale(1.05);
}

.file-download {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  color: var(--accent-emerald);
}

.file-download:hover {
  background: linear-gradient(135deg, var(--accent-emerald), #059669);
  color: black;
  transform: scale(1.05);
}

/* 文件预览模态框样式 */
.file-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.file-modal .modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--background-secondary);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon-large {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background-tertiary), var(--background-secondary));
  border-radius: 0.75rem;
  border: 1px solid var(--border-light);
}

.file-details {
  flex: 1;
}

.file-name-large {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.file-meta-large {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.file-type-large {
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-blue);
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  min-height: 400px;
  overflow: auto;
}

/* 不同文件类型的预览样式 */
.image-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius);
}

.pdf-preview-container {
  width: 100%;
  height: 600px;
}

.pdf-preview-container iframe {
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
}

.video-preview-container {
  width: 100%;
  max-width: 720px;
}

.video-preview-container video {
  width: 100%;
  height: auto;
  border-radius: var(--radius);
}

.audio-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.audio-preview-container audio {
  width: 100%;
  max-width: 400px;
}

.audio-placeholder {
  text-align: center;
}

.audio-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.audio-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.text-preview-container {
  width: 100%;
  height: 100%;
  max-height: 600px;
  overflow: auto;
}

.text-content {
  white-space: pre-wrap;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--background-secondary);
  padding: 1.5rem;
  border-radius: var(--radius);
  margin: 0;
}

.unsupported-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  text-align: center;
}

.unsupported-icon {
  font-size: 4rem;
  opacity: 0.6;
}

.unsupported-message p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.download-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  background: var(--background-secondary);
}

.modal-download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, var(--accent-emerald), #059669);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.modal-download-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .file-modal .modal-content {
    width: 95vw;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
    min-height: 300px;
  }

  .pdf-preview-container {
    height: 400px;
  }
}

</style>
