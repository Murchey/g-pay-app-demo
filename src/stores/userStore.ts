import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserProfile {
  name: string
  phone: string
  email: string
  avatar: string
  idNumber: string
  address: string
}

const DEFAULT_USER: UserProfile = {
  name: '张三',
  phone: '138****8888',
  email: 'zhangsan@example.com',
  avatar: '',
  idNumber: '310***********1234',
  address: '上海市浦东新区',
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile>({ ...DEFAULT_USER })
  const darkMode = ref(false)

  function updateUser(data: Partial<UserProfile>) {
    user.value = { ...user.value, ...data }
  }

  function getInitial(): string {
    return user.value.name.charAt(0)
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  return { user, darkMode, updateUser, getInitial, toggleDarkMode }
})
