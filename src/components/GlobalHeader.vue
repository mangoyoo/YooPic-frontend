<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <!-- Logo部分 -->
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/YooPic_logo.png" alt="logo" />
          </div>
        </router-link>
      </a-col>

      <!-- 菜单部分 -->
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
          class="header-menu"
        />
      </a-col>

      <!-- 用户信息展示栏 -->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/my_info">
                      <UserOutlined />
                      用户中心
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/my_space">
                      <UserOutlined />
                      我的空间
                    </router-link>
                  </a-menu-item>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  PictureOutlined,
  CaretDownOutlined,
  CloudOutlined,
  UploadOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileImageOutlined
} from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()

// 团队空间列表
const teamSpaceList = ref<API.SpaceUserVO[]>([])

// 基础菜单项 - 交换了云空间和发布图片的位置
const fixedMenuItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
  },
  {
    key: '/add_picture',
    label: '发布图片',
    title: '发布图片',
    icon: () => h(UploadOutlined),
  },
  {
    key: '/my_space',
    label: '云空间',
    icon: () => h(CloudOutlined),
  },
]

// 管理员菜单项 - 添加了图标
const adminItems = [
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
    icon: () => h(UserOutlined),
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
    icon: () => h(FileImageOutlined),
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
    icon: () => h(AppstoreOutlined),
  },
]

// 团队空间子菜单
const getTeamSpaceMenu = computed(() => ({
  key: 'team',
  label: '团队空间',
  icon: () => h(TeamOutlined),
  children: [
    {
      key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
      label: '创建团队',
      icon: () => h(PictureOutlined),
    },
    ...teamSpaceList.value.map(spaceUser => ({
      key: '/space/' + spaceUser.spaceId,
      label: spaceUser.space?.spaceName,
      icon: () => h(TeamOutlined),
    }))
  ]
}))

// 根据权限过滤菜单项
const items = computed(() => {
  const allItems = [...fixedMenuItems]

  // 添加团队空间菜单
  if (loginUserStore.loginUser.id) {
    allItems.push(getTeamSpaceMenu.value)
  }

  // 管理员菜单
  if (loginUserStore.loginUser.userRole === 'admin') {
    allItems.push(...adminItems)
  }

  return allItems
})

// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to) => {
  current.value = [to.path]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  try {
    const res = await listMyTeamSpaceUsingPost()
    if (res.data.code === 0 && res.data.data) {
      teamSpaceList.value = res.data.data
    } else {
      message.error('加载团队空间失败: ' + res.data.message)
    }
  } catch (error) {
    console.error('获取团队空间失败', error)
  }
}

// 监听登录状态，加载团队空间
watchEffect(() => {
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push(key)
}

// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader {
  background: transparent !important;
  box-shadow: none !important;
}

#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: white;
  font-size: 18px;
  margin-left: 16px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.logo {
  height: 40px;
}

.header-menu {
  border-bottom: none;
  line-height: 48px;
  background: transparent !important;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* 覆盖菜单的背景色 */
:deep(.ant-menu) {
  background: transparent !important;
}

/* 覆盖菜单项的背景色 */
:deep(.ant-menu-item) {
  background: transparent !important;
  color: white !important;
  padding: 0 16px;
  margin: 0 4px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-bottom: none !important;
}

:deep(.ant-menu-submenu) {
  background: transparent !important;
  color: white !important;
  margin: 0 4px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-bottom: none !important;
}

/* 移除选中样式，统一使用普通状态 */
:deep(.ant-menu-item-selected) {
  color: white !important;
  background: transparent !important;
  border-bottom: none !important;
  font-weight: normal !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transform: none;
  box-shadow: none;
}

/* 移除菜单项的默认下划线 */
:deep(.ant-menu-horizontal::after) {
  display: none !important;
}

:deep(.ant-menu-item-selected)::after,
:deep(.ant-menu-item::after) {
  display: none !important;
  border-bottom: none !important;
}

:deep(.ant-menu-submenu::after) {
  display: none !important;
  border-bottom: none !important;
}

/* 只保留悬停效果 */
:deep(.ant-menu-item:hover) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 6px;
  transform: translateY(-2px);
  transition: all 0.3s ease;
  border-bottom: none !important;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

:deep(.ant-menu-submenu:hover) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: 6px;
  transform: translateY(-2px);
  transition: all 0.3s ease;
  border-bottom: none !important;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

:deep(.ant-menu-title-content) {
  color: white !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

/* 移除选中项的特殊文本效果 */
:deep(.ant-menu-item-selected .ant-menu-title-content) {
  letter-spacing: normal;
  transform: none;
}

:deep(.ant-menu-submenu-title) {
  color: white !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
}

/* 覆盖下拉菜单项的背景色 */
:deep(.ant-dropdown-menu) {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

:deep(.ant-dropdown-menu-item) {
  transition: all 0.2s ease;
}

:deep(.ant-dropdown-menu-item:hover) {
  background: rgba(255, 255, 255, 0.5);
}

.user-login-status {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
</style>
