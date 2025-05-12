<template>
  <div id="userManagePage">
    <!-- 搜索区域 -->
    <a-card class="search-card" :bordered="false">
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">用户筛选</span>
          <a-divider type="vertical" />
        </div>
        <a-form layout="inline" :model="searchParams" @finish="doSearch" class="search-form">
          <a-form-item label="账号">
            <a-input
              v-model:value="searchParams.userAccount"
              placeholder="输入账号"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input
              v-model:value="searchParams.userName"
              placeholder="输入用户名"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="用户角色">
            <a-select
              v-model:value="searchParams.userRole"
              style="min-width: 120px"
              placeholder="选择角色"
              allow-clear
            >
              <a-select-option value="admin">管理员</a-select-option>
              <a-select-option value="user">普通用户</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="search-button">搜索</a-button>
          </a-form-item>

          <!-- 将操作按钮放在右侧 -->
          <a-form-item class="right-actions">
            <div class="page-actions">
              <a-button
                type="primary"
                class="action-button add-button"
              >
                <template #icon><UserAddOutlined /></template>
                添加用户
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <!-- 内容区域：用户表格 -->
    <a-card class="content-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
        :rowKey="record => record.id"
        :scroll="{ x: 'max-content' }"
        size="middle"
        :loading="loading"
        class="user-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- 头像列 -->
          <template v-if="column.dataIndex === 'userAvatar'">
            <div class="avatar-preview">
              <a-avatar
                :src="record.userAvatar"
                :size="64"
                :alt="record.userName"
              />
            </div>
          </template>

          <!-- 用户名列 -->
          <template v-if="column.dataIndex === 'userName'">
            <a-tooltip :title="record.userName">
              <span class="truncated-text">{{ record.userName }}</span>
            </a-tooltip>
          </template>

          <!-- 简介列 -->
          <template v-if="column.dataIndex === 'userProfile'">
            <a-tooltip :title="record.userProfile">
              <span class="truncated-text">{{ record.userProfile || '暂无简介' }}</span>
            </a-tooltip>
          </template>

          <!-- 用户角色列 -->
          <template v-if="column.dataIndex === 'userRole'">
            <a-tag
              :color="record.userRole === 'admin' ? 'green' : 'blue'"
              class="role-tag"
            >
              {{ record.userRole === 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>

          <!-- 创建时间列 -->
          <template v-if="column.dataIndex === 'createTime'">
            <a-tooltip :title="dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')">
              {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm') }}
            </a-tooltip>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <div class="action-buttons">

              <a-tooltip title="删除用户">
                <a-button
                  danger
                  size="small"
                  shape="circle"
                  @click="doDelete(record.id)"
                  class="delete-btn action-icon-btn"
                >
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined
} from '@ant-design/icons-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 70,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    width: 120,
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 120,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    width: 100,
    align: 'center',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]

// 定义数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)
const loading = ref(false)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await listUserVoByPageUsingPost({
      ...searchParams,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('获取用户列表失败，请稍后重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped>
/*
 * 全局颜色定义
 * 主题背景色：#87CEFA (Light Sky Blue)
 * 卡片背景色：#F0F8FF (Alice Blue)
 * 文本主色：#333333
 * 文本副色：#666666
 * 分割线颜色：#E8E8E8
 */

#userManagePage {
  padding: 20px;
  background-color: #f7fafd;
  min-height: 100vh;
  color: #333333;
}

/* ===== 卡片公共样式 ===== */
.search-card,
.content-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #F0F8FF;
  overflow: hidden;
  margin-bottom: 12px;
}

/* ===== 搜索区域 ===== */
.search-card {
  padding: 8px 16px;
}

.search-section {
  padding: 8px 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  position: relative;
  padding-left: 10px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  background-color: #87CEFA;
  border-radius: 1.5px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px;
  align-items: flex-start;
}

.search-form :deep(.ant-form-item) {
  margin-bottom: 12px;
  margin-right: 16px;
}

.search-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.search-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

.right-actions {
  margin-left: auto; /* 将元素推到右侧 */
}

.page-actions {
  display: flex;
  gap: 8px;
}

/* 按钮样式统一 */
.action-button {
  border-radius: 4px;
  height: 36px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button {
  background-color: #87CEFA;
  border-color: #87CEFA;
}

.add-button:hover {
  background-color: #75bdea;
  border-color: #75bdea;
}

/* ===== 内容区域：表格 ===== */
.content-card {
  padding: 0;
}

.user-table {
  width: 100%;
}

.user-table :deep(.ant-table-thead > tr > th) {
  background-color: rgba(135, 206, 250, 0.1);
  color: #333333;
  font-weight: 600;
  padding: 10px 8px;
  text-align: center;
}

.user-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px;
  text-align: center;
}

.user-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(135, 206, 250, 0.05);
}

.user-table :deep(.ant-pagination-item-active) {
  border-color: #87CEFA;
}

.user-table :deep(.ant-pagination-item-active a) {
  color: #87CEFA;
}

/* 头像预览优化 */
.avatar-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 角色标签样式 */
.role-tag {
  border-radius: 12px;
  padding: 0 10px;
}

/* 文本截断样式 */
.truncated-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin: 0 auto;
}

/* 操作按钮样式优化 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.action-icon-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  border-color: #87CEFA;
  color: #87CEFA;
}

.edit-btn:hover {
  color: #ffffff;
  background-color: #87CEFA;
}

.reset-btn {
  background-color: #faad14;
  border-color: #faad14;
}

.reset-btn:hover {
  background-color: #ffc53d;
  border-color: #ffc53d;
}

.delete-btn {
  background-color: white;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.delete-btn:hover {
  background-color: #ff4d4f;
  color: white;
}

/* 响应式适配 */
@media (max-width: 992px) {
  .page-actions {
    justify-content: flex-start;
    margin-top: 16px;
  }
}

@media (max-width: 768px) {
  #userManagePage {
    padding: 12px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-form :deep(.ant-form-item) {
    margin-right: 0;
    width: 100%;
  }

  .action-icon-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .user-table :deep(.ant-table-thead > tr > th) {
    padding: 8px 4px;
  }

  .user-table :deep(.ant-table-tbody > tr > td) {
    padding: 6px 4px;
  }
}
</style>
