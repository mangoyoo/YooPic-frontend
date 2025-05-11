<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <div class="content-container" :class="{ 'overlay-mode': shouldUseOverlay }">
        <!-- 头部根据路由决定是否覆盖 -->
        <a-layout-header class="header" :class="{ 'overlay-header': shouldUseOverlay, 'normal-header': !shouldUseOverlay }">
          <GlobalHeader :class="{ 'overlay-global-header': shouldUseOverlay, 'normal-global-header': !shouldUseOverlay }" />
        </a-layout-header>

        <a-layout>
          <a-layout-content class="content">
            <router-view />
          </a-layout-content>
        </a-layout>
      </div>

      <a-layout-footer class="footer">
        <a href="" target="_blank"> MangoYoo </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from "@/components/GlobalSider.vue";
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 判断当前路由是否需要覆盖模式
const shouldUseOverlay = computed(() => {
  // 使用精确的路径和名称来判断
  const overlayPaths = ['/', '/user/login', '/user/register'];
  const overlayNames = ['home', '用户登录', '用户注册'];

  return overlayPaths.includes(route.path) || overlayNames.includes(route.name as string);
});
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 20px;
  margin-bottom: 1px;
}

#basicLayout .normal-header {
  background: #C4DDFC !important; /* 更深的蓝色背景 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
  position: relative;
  overflow: hidden;
}

/* 为普通模式的标题添加更明显的点缀图案 */
#basicLayout .normal-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.4) 2%, transparent 3%),
    radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.4) 2%, transparent 3%);
  background-size: 120px 120px;
  opacity: 0.7;
  z-index: 0;
}

/* GlobalHeader 样式 */
:deep(.normal-global-header) {
  /* 非覆盖模式下的GlobalHeader样式 */
  background-color: #B3D4FF; /* 更深的蓝色背景 */
  border-radius: 6px;
  padding: 0 15px;
  margin: 8px 0;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 为普通全局头部添加更明显的点缀图案 */
:deep(.normal-global-header::before) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%,
    transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%,
    transparent 75%, transparent);
  background-size: 40px 40px;
  z-index: -1;
  opacity: 0.6;
}

:deep(.overlay-global-header) {
  /* 覆盖模式下的GlobalHeader样式 - 完全透明 */
  background-color: transparent; /* 完全透明背景 */
  backdrop-filter: none; /* 移除模糊效果 */
  border-radius: 6px;
  padding: 0 15px;
  margin: 8px 0;
}

/* 为非覆盖模式下的文本添加样式 */
:deep(.normal-global-header a),
:deep(.normal-global-header .ant-typography),
:deep(.normal-global-header .ant-menu-title-content),
:deep(.normal-global-header span) {
  color: #002855; /* 更深的蓝色文本 */
  font-weight: 600; /* 粗体 */
  font-size: 15px; /* 稍大的字体 */
  position: relative;
  z-index: 2;
}

:deep(.normal-global-header a:hover),
:deep(.normal-global-header .ant-menu-item-active),
:deep(.normal-global-header .ant-menu-item-selected) {
  color: #004080 !important; /* 更鲜明的蓝色 */
}

/* 为覆盖模式下的文本添加样式 */
:deep(.overlay-global-header a),
:deep(.overlay-global-header .ant-typography),
:deep(.overlay-global-header .ant-menu-title-content),
:deep(.overlay-global-header span) {
  color: #FFFFFF; /* 纯白色文本 */
  font-weight: 600;
  font-size: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* 文字阴影增强可读性 */
}

:deep(.overlay-global-header a:hover),
:deep(.overlay-global-header .ant-menu-item-active),
:deep(.overlay-global-header .ant-menu-item-selected) {
  color: #FFD700 !important; /* 金色高亮 */
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6); /* 金色光晕效果 */
}

/* 为菜单项添加特殊样式 */
:deep(.normal-global-header .ant-menu-item) {
  margin: 0 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.normal-global-header .ant-menu-item:hover),
:deep(.normal-global-header .ant-menu-item-selected) {
  background-color: #9ACDFF; /* 悬停背景色 - 更深一点 */
}

:deep(.overlay-global-header .ant-menu-item) {
  margin: 0 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.overlay-global-header .ant-menu-item:hover),
:deep(.overlay-global-header .ant-menu-item-selected) {
  background-color: rgba(255, 255, 255, 0.15); /* 轻微半透明白色背景 */
}

/* 确保覆盖模式下菜单相关元素完全透明 */
:deep(.overlay-global-header .ant-menu) {
  background: transparent !important;
}

:deep(.overlay-global-header .ant-menu-submenu) {
  background: transparent !important;
}

/* 添加整体内容区域的更明显点缀图案 */
#basicLayout {
  position: relative;
}

#basicLayout::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 10% 10%, rgba(173, 216, 230, 0.15) 2%, transparent 3%),
    radial-gradient(circle at 90% 90%, rgba(173, 216, 230, 0.15) 2%, transparent 3%),
    radial-gradient(circle at 50% 50%, rgba(173, 216, 230, 0.1) 1%, transparent 2%);
  background-size: 180px 180px;
  opacity: 0.7;
  z-index: -1;
  pointer-events: none;
}

/* 覆盖模式下隐藏背景图案 */
.overlay-mode + * ~ #basicLayout::after {
  opacity: 0;
}

#basicLayout .sider {
  background: #fff;
  padding-top: 20px;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

#basicLayout .content {
  padding: 0; /* 移除内边距，允许内容占满 */
  background: transparent;
  margin-bottom: 28px;
  overflow: hidden; /* 确保子元素不溢出 */
  width: 100%; /* 确保宽度是100% */
}

/* 特殊处理HomePage组件，使其能完全占满 */
#basicLayout :deep(.home-page) {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 确保hero部分可以完全展开 */
#basicLayout :deep(.hero) {
  width: 100vw;
  margin: 0;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  position: relative;
  z-index: 1;
}

#basicLayout .footer {
  background: #fff !important; /* 改为纯白背景 */
  opacity: 1 !important; /* 确保完全不透明 */
  padding: 12px 24px; /* 减小内边距 */
  height: 20px; /* 固定高度 */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05); /* 添加顶部阴影 */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999; /* 确保在最顶层 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文字样式优化 */
#basicLayout .footer a {
  font-size: 14px;
  color: #666;
  transition: color 0.3s;
}

#basicLayout .footer a:hover {
  color: #8ab4f8;
  text-decoration: none;
}

/* 默认内容容器没有特殊定位 */
.content-container {
  display: flex;
  flex-direction: column;
}

/* 只有在需要覆盖模式下才使用相对定位 */
.overlay-mode {
  position: relative;
}

/* 只有在overlay模式下才应用覆盖样式 */
#basicLayout .overlay-header {
  position: absolute;
  width: 100%;
  z-index: 1000;
  background: transparent !important; /* 完全透明 */
  box-shadow: none !important;
}

/* 确保覆盖模式下所有菜单和子元素都是透明的 */
:deep(.overlay-header .ant-menu),
:deep(.overlay-header .ant-menu-submenu),
:deep(.overlay-header .ant-menu-item),
:deep(.overlay-header .ant-menu-item-only-child) {
  background: transparent !important;
}

:deep(.overlay-global-header .ant-row),
:deep(.overlay-global-header .ant-col),
:deep(.overlay-global-header .ant-menu-overflow),
:deep(.overlay-global-header .ant-menu-overflow-item) {
  background: transparent !important;
}

/* 覆盖ant-design默认样式 */
:deep(.ant-layout) {
  background: transparent !important;
}

:deep(.ant-layout-content) {
  background: transparent !important;
}
</style>
