<template>
  <div id="spaceAnalyzePage">
    <!-- 标题与空间信息 -->
    <a-card class="page-header-card" :bordered="false">
      <h2 class="page-title">
        空间图库分析 -
        <span v-if="queryAll" class="space-name">全部空间</span>
        <span v-else-if="queryPublic" class="space-name">公共图库</span>
        <span v-else class="space-name">
          <a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
        </span>
      </h2>
    </a-card>

    <!-- 分析卡片布局 -->
    <a-row :gutter="[16, 16]" class="analysis-row">
      <!-- 空间使用分析 -->
      <a-col :xs="24" :md="12">
        <div class="analysis-card-wrapper">
          <SpaceUsageAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>

      <!-- 空间分类分析 -->
      <a-col :xs="24" :md="12">
        <div class="analysis-card-wrapper">
          <SpaceCategoryAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>

      <!-- 标签分析 -->
      <a-col :xs="24" :md="12">
        <div class="analysis-card-wrapper">
          <SpaceTagAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>

      <!-- 图片大小分段分析 -->
      <a-col :xs="24" :md="12">
        <div class="analysis-card-wrapper">
          <SpaceSizeAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>

      <!-- 用户上传行为分析 -->
      <a-col :xs="24" :md="12">
        <div class="analysis-card-wrapper">
          <SpaceUserAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>

      <!-- 空间使用排行分析 -->
      <a-col :xs="24" :md="12" v-if="isAdmin">
        <div class="analysis-card-wrapper">
          <SpaceRankAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import SpaceUsageAnalyze from '@/components/analyze/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/analyze/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/analyze/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/analyze/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/analyze/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/analyze/SpaceRankAnalyze.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const route = useRoute()

// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId as string
})

// 是否查询所有空间
const queryAll = computed(() => {
  return !!route.query?.queryAll
})

// 是否查询公共空间
const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

// 判断用户是否为管理员
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
const isAdmin = computed(() => {
  return loginUser.userRole === 'admin'
})
</script>

<style scoped>
/*
 * 全局颜色定义 - 与spaceDetailPage保持一致
 * 主题背景色：#87CEFA (Light Sky Blue)
 * 卡片背景色：#F0F8FF (Alice Blue)
 * 文本主色：#333333
 * 文本副色：#666666
 * 分割线颜色：#E8E8E8
 */

#spaceAnalyzePage {
  padding: 20px;
  background-color: #f7fafd;
  min-height: 100vh;
  color: #333333;
}

/* 标题卡片样式 */
.page-header-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  margin-bottom: 16px;
  padding: 16px;
}

.page-title {
  margin: 0;
  color: #333333;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.space-name {
  margin-left: 8px;
  color: #1890ff;
}

/* 分析卡片容器 */
.analysis-row {
  margin-top: 12px;
}

.analysis-card-wrapper {
  background-color: #F0F8FF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.analysis-card-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* 覆盖子组件内部样式 */
:deep(.ant-card) {
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

:deep(.ant-card-head) {
  background-color: rgba(135, 206, 250, 0.1);
  border-bottom: 1px solid rgba(135, 206, 250, 0.3);
}

:deep(.ant-card-head-title) {
  font-weight: 600;
  color: #333333;
}

:deep(.ant-card-body) {
  padding: 16px;
}

:deep(.ant-statistic-title) {
  color: #666666;
}

:deep(.ant-statistic-content-value) {
  color: #1890ff;
  font-weight: 600;
}

/* 图表颜色统一 */
:deep(.g2-tooltip) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
  border: 1px solid rgba(135, 206, 250, 0.3) !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  #spaceAnalyzePage {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .analysis-card-wrapper {
    margin-bottom: 12px;
  }
}
</style>
