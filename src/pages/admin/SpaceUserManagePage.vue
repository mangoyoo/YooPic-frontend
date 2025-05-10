<template>
  <div id="spaceMemberManagePage">
    <!-- 搜索区域 -->
    <a-card class="search-card" :bordered="false">
      <div class="search-section">
        <div class="section-header">
          <span class="section-title">空间成员管理</span>
          <a-divider type="vertical" />
        </div>
        <a-form layout="inline" :model="formData" @finish="handleSubmit" class="search-form">
          <a-form-item label="用户 ID" name="userId">
            <a-input v-model:value="formData.userId" placeholder="请输入用户 ID" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="search-button">
              <template #icon><UserAddOutlined /></template>
              添加用户
            </a-button>
          </a-form-item>

          <!-- 将操作按钮放在右侧 -->
          <a-form-item class="right-actions">
            <div class="page-actions">
              <a-button
                type="primary"
                href="/add_space"
                target="_blank"
                class="action-button add-button"
              >
                <template #icon><PlusOutlined /></template>
                创建空间
              </a-button>
              <a-button
                type="primary"
                ghost
                href="/space_analyze?queryPublic=1"
                target="_blank"
                class="action-button analyze-button"
              >
                <template #icon><LineChartOutlined /></template>
                分析公共图库
              </a-button>
              <a-button
                type="primary"
                ghost
                href="/space_analyze?queryAll=1"
                target="_blank"
                class="action-button analyze-button"
              >
                <template #icon><BarChartOutlined /></template>
                分析全部空间
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <!-- 内容区域：成员表格 -->
    <a-card class="content-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :rowKey="record => record.id"
        :scroll="{ x: 'max-content' }"
        size="middle"
        class="member-table"
      >
        <template #bodyCell="{ column, record }">
          <!-- 用户信息列 -->
          <template v-if="column.dataIndex === 'userInfo'">
            <div class="user-info">
              <a-avatar :src="record.user?.userAvatar" :size="40" class="user-avatar" />
              <div class="user-name">{{ record.user?.userName }}</div>
            </div>
          </template>

          <!-- 角色列 -->
          <template v-if="column.dataIndex === 'spaceRole'">
            <a-select
              :value="record.spaceRole"
              :options="SPACE_ROLE_OPTIONS"
              style="width: 120px"
              class="role-select"
              @change="(newValue) => {
                const last = record.spaceRole;
                record.spaceRole = newValue;
                editSpaceRole(newValue, record, last, nowrole);
              }"
            />
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
              <a-tooltip title="删除成员">
                <a-button
                  danger
                  size="small"
                  shape="circle"
                  @click="doDelete(record.id, record)"
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
import { message, Modal } from 'ant-design-vue'
import { SPACE_ROLE_OPTIONS } from '../../constants/space.ts'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/api/spaceUserController.ts'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import {
  PlusOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LineChartOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
    width: 200,
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
    width: 150,
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
    width: 100,
    align: 'center',
  },
]

// 定义数据
const dataList = ref<API.SpaceUserVO[]>([])

// 获取当前登录用户
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

// 计算当前用户角色
const nowrole = computed(() => {
  // 确保 loginUser 和 loginUser.id 存在，并且 dataList 已加载
  if (!loginUser?.id || !dataList.value || dataList.value.length === 0) {
    console.warn('登录用户信息或数据列表尚未准备好，无法计算 nowrole')
    return undefined // 或者一个默认角色，例如 'guest'
  }
  // 在 dataList 中查找当前登录用户对应的记录
  const currentUserRecordInDataList = dataList.value.find(
    (record: API.SpaceUserVO) => record.user?.id === loginUser.id
  )
  if (currentUserRecordInDataList) {
    return currentUserRecordInDataList.spaceRole
  } else {
    // 通常这意味着当前登录用户不在此空间成员列表中，或者数据还没同步
    console.warn(`在空间成员列表中未找到当前登录用户 (ID: ${loginUser.id}) 的记录`)
    return undefined // 或者一个默认角色
  }
})

// 获取数据
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  try {
    const res = await listSpaceUserUsingPost({
      spaceId,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data ?? []
    } else {
      message.error('获取数据失败，' + res.data.message)
    }
  } catch (error) {
    message.error('获取成员列表失败，请稍后重试')
    console.error(error)
  }
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})

// 添加成员表单
const formData = reactive<API.SpaceUserAddRequest>({})

// 创建成员
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }

  if (!formData.userId) {
    message.warning('请输入用户 ID')
    return
  }

  try {
    const res = await addSpaceUserUsingPost({
      spaceId,
      ...formData,
    })
    if (res.data.code === 0) {
      message.success('添加成功')
      // 清空表单
      formData.userId = ''
      // 刷新数据
      fetchData()
    } else {
      message.error('添加失败，' + res.data.message)
    }
  } catch (error) {
    message.error('添加用户操作失败，请稍后重试')
    console.error(error)
  }
}

// 编辑成员角色
const editSpaceRole = async (value, record, last) => {
  // 检查1: 如果原来的角色是 'creator'
  if (last === 'creator') {
    message.error("创建者默认是最高权限，无法修改")
    record.spaceRole = last // 回滚UI上的乐观更新
    return
  }

  // 检查2: 如果试图将角色修改为 'creator'
  if (value === 'creator') {
    message.error("无法修改为创建者") // 或者 "无法修改"
    record.spaceRole = last // 回滚UI上的乐观更新
    return
  }

  if (nowrole.value === 'admin' && (last === 'admin' || value === 'admin')) {
    message.error("管理员无法修改管理员")
    record.spaceRole = last // 回滚UI上的乐观更新
    return
  }

  if (record.user.id === loginUser.id) {
    message.error("管理员无法自己降级")
    record.spaceRole = last // 回滚UI上的乐观更新
    return
  }

  try {
    const res = await editSpaceUserUsingPost({
      id: record.id,
      spaceRole: value,
    })

    if (res.data && res.data.code === 0) {
      message.success('修改成功')
      // 此时 record.spaceRole 已经是 value，与后端一致，无需操作
    } else {
      message.error('修改失败，' + (res.data ? res.data.message : '未知错误'))
      record.spaceRole = last // API调用失败，回滚UI上的乐观更新
    }
  } catch (error) {
    console.error('修改空间角色API出错:', error) // 打印详细错误到控制台
    message.error('修改操作发生异常，请稍后重试') // 给用户一个通用的错误提示
    record.spaceRole = last // 发生异常，回滚UI上的乐观更新
  }
}

// 删除数据
const doDelete = async (id: string, record) => {
  if (!id) {
    return
  }

  if (record.user.id === loginUser.id) {
    message.error("无法删除自己")
    return
  }
  else if (record.spaceRole === "admin" || record.spaceRole === "creator") {
    message.error("无权限删除管理员或创建者")
    return
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除成员 "${record.user?.userName}" 吗？`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await deleteSpaceUserUsingPost({ id })
        if (res.data.code === 0) {
          message.success('删除成功')
          // 刷新数据
          fetchData()
        } else {
          message.error('删除失败，' + res.data.message)
        }
      } catch (error) {
        message.error('删除操作失败，请稍后重试')
        console.error(error)
      }
    }
  })
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

#spaceMemberManagePage {
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
  flex-wrap: wrap;
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

.analyze-button {
  border-color: #87CEFA;
  color: #87CEFA;
}

.analyze-button:hover {
  color: #ffffff;
  background-color: #87CEFA;
}

/* ===== 内容区域：表格 ===== */
.content-card {
  padding: 0;
}

.member-table {
  width: 100%;
}

.member-table :deep(.ant-table-thead > tr > th) {
  background-color: rgba(135, 206, 250, 0.1);
  color: #333333;
  font-weight: 600;
  padding: 10px 8px;
  text-align: center;
}

.member-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px;
  text-align: center;
}

.member-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(135, 206, 250, 0.05);
}

.member-table :deep(.ant-pagination-item-active) {
  border-color: #87CEFA;
}

.member-table :deep(.ant-pagination-item-active a) {
  color: #87CEFA;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.user-avatar {
  border: 2px solid rgba(135, 206, 250, 0.3);
}

.user-name {
  font-weight: 500;
  color: #333333;
}

/* 角色选择器样式 */
.role-select {
  border-radius: 4px;
}

.role-select :deep(.ant-select-selector) {
  border-color: #d9d9d9;
}

.role-select:hover :deep(.ant-select-selector) {
  border-color: #87CEFA;
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
  #spaceMemberManagePage {
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

  .member-table :deep(.ant-table-thead > tr > th) {
    padding: 8px 4px;
  }

  .member-table :deep(.ant-table-tbody > tr > td) {
    padding: 6px 4px;
  }

  .user-info {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
