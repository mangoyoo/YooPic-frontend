<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <div class="content-container" :class="{ 'overlay-mode': shouldUseOverlay }">
        <!-- 头部根据路由决定是否覆盖 -->
        <a-layout-header class="header" :class="{ 'overlay-header': shouldUseOverlay }">
          <GlobalHeader />
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
  background: #fff !important; /* 默认有背景色 */
  color: unset;
  margin-bottom: 1px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; /* 默认有阴影 */
}

#basicLayout .sider {
  background: #fff;
  border-right: 0.5px solid #eee;
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
  border-top: 1px solid #e8e8e8; /* 添加细边框 */
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
  background: transparent !important;
  box-shadow: none !important;
}

/* 覆盖ant-design默认样式 */
:deep(.ant-layout-header) {
  /* 移除此处的transparent背景设置，通过类控制 */
}

:deep(.ant-layout) {
  background: transparent !important;
}

:deep(.ant-layout-content) {
  background: transparent !important;
}
</style>
