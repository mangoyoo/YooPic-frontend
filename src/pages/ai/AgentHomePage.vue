<template>
  <div class="home-container">
    <div class="header">
      <div class="title-wrapper">
        <h1 class="main-title">
          <span class="title-letter" data-letter="Y">Y</span>
          <span class="title-letter" data-letter="o">o</span>
          <span class="title-letter" data-letter="o">o</span>
          <span class="title-letter" data-letter="P">P</span>
          <span class="title-letter" data-letter="i">i</span>
          <span class="title-letter" data-letter="c">c</span>
          <span class="title-space"></span>
          <span class="title-letter ai-letter" data-letter="A">A</span>
          <span class="title-letter ai-letter" data-letter="I">I</span>
        </h1>
        <div class="title-decoration">
          <div class="deco-line"></div>
          <div class="deco-dot"></div>
          <div class="deco-line"></div>
        </div>
      </div>
      <p class="subtitle">AI驱动的图像智能助手，让创意无限延展</p>
    </div>

    <div class="apps-container">
      <div class="app-card image-advisor" @click="navigateTo('/ai_expert')">
        <div class="card-glow"></div>
        <div class="card-header">
          <div class="app-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M6 8H6.01M8 4H16C18.209 4 20 5.791 20 8V16C20 18.209 18.209 20 16 20H8C5.791 20 4 18.209 4 16V8C4 5.791 5.791 4 8 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-badge image-badge">图像智能</div>
        </div>
        <div class="app-info">
          <div class="app-title">智能图像顾问</div>
          <div class="app-desc">解读图片风格、色彩与构图，提供专业的视觉分析与创意建议</div>
          <div class="feature-tags">
            <span class="tag">风格识别</span>
            <span class="tag">配色分析</span>
            <span class="tag">创意灵感</span>
          </div>
        </div>
        <div class="app-button image-button">
          <span class="btn-text">开始分析</span>
          <div class="btn-icon">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="app-card resource-agent" @click="navigateTo('/ai_agent')">
        <div class="card-glow"></div>
        <div class="card-header">
          <div class="app-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-badge agent-badge">素材助手</div>
        </div>
        <div class="app-info">
          <div class="app-title">YooPic Agent</div>
          <div class="app-desc">专业的素材整合与管理助手，高效组织您的创意资源库</div>
          <div class="feature-tags">
            <span class="tag">智能分类</span>
            <span class="tag">批量处理</span>
            <span class="tag">快速检索</span>
          </div>
        </div>
        <div class="app-button agent-button">
          <span class="btn-text">体验智能体</span>
          <div class="btn-icon">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>



    <div class="background-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="grid-pattern"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;700;800;900&display=swap');

:root {
  --primary-blue: #1e40af;
  --primary-blue-light: #3b82f6;
  --secondary-purple: #7c3aed;
  --secondary-purple-light: #8b5cf6;
  --accent-emerald: #10b981;
  --accent-orange: #f59e0b;
  --accent-pink: #ec4899;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --background-primary: #ffffff;
  --background-secondary: #f1f5f9;
  --background-tertiary: #e2e8f0;
  --border-light: #cbd5e1;
  --border-medium: #94a3b8;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}

.header {
  text-align: center;
  padding: 80px 20px 60px;
  position: relative;
  z-index: 10;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

/* 创意立体标题效果 */
.main-title {
  font-family: 'Orbitron', monospace;
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
  perspective: 1000px;
}

.title-letter {
  display: inline-block;
  position: relative;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary-blue), var(--secondary-purple), var(--accent-pink));
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow:
    2px 2px 4px rgba(30, 64, 175, 0.2),
    4px 4px 8px rgba(124, 58, 237, 0.15),
    6px 6px 12px rgba(236, 72, 153, 0.05);



  //filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));
  -webkit-font-smoothing: antialiased; /* 改善字体渲染 */
  -moz-osx-font-smoothing: grayscale;
  animation: gradientShift 4s ease-in-out infinite, letterFloat 3s ease-in-out infinite;
  transform-origin: center;
}

.title-letter:nth-child(1) { animation-delay: 0s, 0s; }
.title-letter:nth-child(2) { animation-delay: 0.1s, 0.2s; }
.title-letter:nth-child(3) { animation-delay: 0.2s, 0.4s; }
.title-letter:nth-child(4) { animation-delay: 0.3s, 0.6s; }
.title-letter:nth-child(5) { animation-delay: 0.4s, 0.8s; }
.title-letter:nth-child(6) { animation-delay: 0.5s, 1s; }
.title-letter:nth-child(8) { animation-delay: 0.6s, 1.2s; }
.title-letter:nth-child(9) { animation-delay: 0.7s, 1.4s; }

.ai-letter {
  background: linear-gradient(135deg, var(--accent-emerald), var(--accent-orange));
  background-size: 200% 200%;
  animation: gradientShiftAI 3s ease-in-out infinite, letterGlow 2s ease-in-out infinite;
}

.title-space {
  width: 0.3em;
  display: inline-block;
}

.title-letter::before {
  content: attr(data-letter);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(45deg, rgba(30, 64, 175, 0.1), rgba(124, 58, 237, 0.1));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: translate(3px, 3px);
  //filter: blur(1px);
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  animation: decorationPulse 2s ease-in-out infinite;
}

.deco-line {
  height: 3px;
  width: 40px;
  background: linear-gradient(90deg, var(--accent-emerald), var(--accent-orange));
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.deco-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: shimmer 2s infinite;
}

.deco-dot {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, var(--accent-pink), var(--secondary-purple));
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.5s both;
}

.apps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 80px;
  position: relative;
  z-index: 10;
}

/* 增强卡片区分度 */
.app-card {
  border-radius: 24px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
}

.image-advisor {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
  box-shadow:
    var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 40px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.resource-agent {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 255, 0.9));
  box-shadow:
    var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 40px rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  border-radius: 50%;
}

.image-advisor .card-glow {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
}

.resource-agent .card-glow {
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
}

.app-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

.image-advisor:hover {
  border-color: var(--primary-blue-light);
  box-shadow:
    var(--shadow-2xl),
    0 0 60px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.resource-agent:hover {
  border-color: var(--secondary-purple-light);
  box-shadow:
    var(--shadow-2xl),
    0 0 60px rgba(124, 58, 237, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.app-card:hover .card-glow {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.app-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.image-advisor .app-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.2));
  color: var(--primary-blue);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.resource-agent .app-icon {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(109, 40, 217, 0.2));
  color: var(--secondary-purple);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.2);
}

.app-icon svg {
  width: 26px;
  height: 26px;
}

.card-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.image-badge {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.15));
  color: var(--primary-blue);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.agent-badge {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(109, 40, 217, 0.15));
  color: var(--secondary-purple);
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
}

.app-info {
  margin-bottom: 28px;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.3;
}

.app-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
}

.app-button {
  color: black;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.image-button {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light));
}

.agent-button {
  background: linear-gradient(135deg, var(--secondary-purple), var(--secondary-purple-light));
}

.app-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.app-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.app-button:hover::before {
  left: 100%;
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.app-button:hover .btn-icon {
  transform: translateX(4px);
}

.bottom-section {
  padding: 60px 20px 80px;
  position: relative;
  z-index: 10;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

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

/* 动画效果 */
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes gradientShiftAI {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes letterFloat {
  0%, 100% {
    transform: translateY(0) rotateX(0);
  }
  50% {
    transform: translateY(-8px) rotateX(5deg);
  }
}

@keyframes letterGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.6));
  }
}

@keyframes decorationPulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 3.5rem;
  }

  .subtitle {
    font-size: 1.125rem;
    padding: 0 20px;
  }

  .apps-container {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 20px 60px;
  }

  .app-card {
    padding: 28px;
  }

  .stats-grid {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 60px 15px 40px;
  }

  .main-title {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .apps-container {
    padding: 0 15px 40px;
    gap: 24px;
  }

  .app-card {
    padding: 24px;
  }

  .app-icon {
    width: 52px;
    height: 52px;
  }

  .app-icon svg {
    width: 22px;
    height: 22px;
  }
}
</style>
