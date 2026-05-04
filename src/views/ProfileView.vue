<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCardStore } from '@/stores/cardStore'

const router = useRouter()
const userStore = useUserStore()
const cardStore = useCardStore()

const isEditing = ref(false)
const editingField = ref('')
const editValue = ref('')
const showToast = ref(false)
const toastMessage = ref('')

const editForm = ref({
  name: userStore.user.name,
  phone: userStore.user.phone,
  email: userStore.user.email,
  address: userStore.user.address,
})

const profileFields = computed(() => [
  { key: 'name', label: '姓名', value: userStore.user.name, icon: '👤' },
  { key: 'phone', label: '手机号', value: userStore.user.phone, icon: '📱' },
  { key: 'email', label: '邮箱', value: userStore.user.email, icon: '📧' },
  { key: 'idNumber', label: '身份证号', value: userStore.user.idNumber, icon: '🪪' },
  { key: 'address', label: '地址', value: userStore.user.address, icon: '📍' },
])

const accountMenuItems = computed(() => [
  { icon: '💳', label: '我的卡包', desc: `${cardStore.totalCards} 张已绑定`, path: '/', type: 'link' },
  { icon: '🔐', label: '安全设置', desc: '密码、指纹、面容', path: '', type: 'link' },
  { icon: '🔔', label: '通知设置', desc: '交易提醒、促销通知', path: '', type: 'link' },
  { icon: '🌙', label: '深色模式', desc: userStore.darkMode ? '已开启' : '已关闭', path: '', type: 'toggle' },
  { icon: '❓', label: '帮助与反馈', desc: '常见问题、联系客服', path: '', type: 'link' },
  { icon: '📄', label: '关于', desc: '版本 1.0.0', path: '', type: 'link' },
])

function startEdit(field: string, currentValue: string) {
  editingField.value = field
  editValue.value = currentValue
  isEditing.value = true
}

function saveEdit() {
  if (!editValue.value.trim()) return
  const field = editingField.value as keyof typeof editForm.value
  userStore.updateUser({ [field]: editValue.value.trim() })
  editForm.value[field] = editValue.value.trim()
  isEditing.value = false
  editingField.value = ''
  showToastMsg('修改成功')
}

function cancelEdit() {
  isEditing.value = false
  editingField.value = ''
}

function getEditLabel(): string {
  const labels: Record<string, string> = {
    name: '姓名',
    phone: '手机号',
    email: '邮箱',
    idNumber: '身份证号',
    address: '地址',
  }
  return labels[editingField.value] || ''
}

function getEditPlaceholder(): string {
  const placeholders: Record<string, string> = {
    name: '请输入姓名',
    phone: '请输入手机号',
    email: '请输入邮箱地址',
    idNumber: '请输入身份证号',
    address: '请输入地址',
  }
  return placeholders[editingField.value] || ''
}

function getEditInputType(): string {
  if (editingField.value === 'email') return 'email'
  if (editingField.value === 'phone') return 'tel'
  return 'text'
}

function showToastMsg(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 2000)
}

function handleMenuClick(path: string) {
  if (path) router.push(path)
  else showToastMsg('功能开发中...')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)] pb-20">
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-4">
      <h1 class="text-xl font-bold text-[var(--gp-dark)]">我的</h1>
    </div>

    <!-- Profile header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-2 pb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-[var(--gp-blue)] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
          {{ userStore.getInitial() }}
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-bold text-[var(--gp-dark)]">{{ userStore.user.name }}</h2>
          <p class="text-sm text-[var(--gp-gray)] mt-0.5">{{ userStore.user.phone }}</p>
        </div>
        <button
          @click="startEdit('name', userStore.user.name)"
          class="px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--gp-blue)] text-white active:opacity-80 transition-opacity"
        >
          编辑
        </button>
      </div>
    </div>

    <!-- Personal info section -->
    <div class="px-5 pt-4 pb-3">
      <h3 class="text-sm font-semibold text-[var(--gp-gray)] mb-2 px-1">个人信息</h3>
      <div class="bg-[var(--gp-surface)] rounded-2xl overflow-hidden">
        <button
          v-for="(field, idx) in profileFields"
          :key="field.key"
          @click="startEdit(field.key, field.value)"
          class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[var(--gp-bg)] transition-colors text-left"
          :class="idx < profileFields.length - 1 ? 'border-b border-[var(--gp-bg)]' : ''"
        >
          <span class="text-lg">{{ field.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs text-[var(--gp-gray)] mb-0.5">{{ field.label }}</div>
            <div class="text-sm text-[var(--gp-dark)] font-medium truncate">{{ field.value }}</div>
          </div>
          <svg class="w-4 h-4 text-[var(--gp-light-gray)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Account settings -->
    <div class="px-5 pt-2 pb-3">
      <h3 class="text-sm font-semibold text-[var(--gp-gray)] mb-2 px-1">设置</h3>
      <div class="bg-[var(--gp-surface)] rounded-2xl overflow-hidden">
        <template v-for="(item, idx) in accountMenuItems" :key="item.label">
          <button
            v-if="item.type === 'toggle'"
            @click="userStore.toggleDarkMode()"
            class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[var(--gp-bg)] transition-colors text-left"
            :class="idx < accountMenuItems.length - 1 ? 'border-b border-[var(--gp-bg)]' : ''"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-[var(--gp-dark)] font-medium">{{ item.label }}</div>
              <div class="text-xs text-[var(--gp-gray)]">{{ item.desc }}</div>
            </div>
            <div
              class="relative w-12 h-7 rounded-full transition-colors duration-300 flex-shrink-0"
              :class="userStore.darkMode ? 'bg-[var(--gp-blue)]' : 'bg-[var(--gp-light-gray)]'"
            >
              <div
                class="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300"
                :class="userStore.darkMode ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </div>
          </button>
          <button
            v-else
            @click="handleMenuClick(item.path)"
            class="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[var(--gp-bg)] transition-colors text-left"
            :class="idx < accountMenuItems.length - 1 ? 'border-b border-[var(--gp-bg)]' : ''"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-[var(--gp-dark)] font-medium">{{ item.label }}</div>
              <div class="text-xs text-[var(--gp-gray)]">{{ item.desc }}</div>
            </div>
            <svg class="w-4 h-4 text-[var(--gp-light-gray)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>
      </div>
    </div>

    <!-- Logout button -->
    <div class="px-5 pt-4">
      <button
        @click="showToastMsg('已退出登录（演示模式）')"
        class="w-full py-3.5 rounded-2xl text-sm font-medium text-[var(--gp-red)] bg-[var(--gp-surface)] active:bg-red-50 transition-colors"
      >
        退出登录
      </button>
    </div>

    <!-- Version info -->
    <p class="text-xs text-[var(--gp-gray)] text-center mt-4">Pay Demo v1.0.0 · 仅供演示</p>

    <!-- Edit modal -->
    <Teleport to="body">
      <div v-if="isEditing" class="fixed inset-0 z-[100] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="cancelEdit" />
        <div class="relative w-full max-w-[430px] bg-[var(--gp-surface)] rounded-t-3xl p-6 pb-10 animate-slide-up">
          <div class="w-10 h-1 bg-[var(--gp-light-gray)] rounded-full mx-auto mb-5" />
          <h3 class="text-lg font-bold text-[var(--gp-dark)] mb-5">修改{{ getEditLabel() }}</h3>
          <div class="mb-6">
            <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">{{ getEditLabel() }}</label>
            <input
              v-model="editValue"
              :type="getEditInputType()"
              :placeholder="getEditPlaceholder()"
              class="w-full px-4 py-3.5 bg-[var(--gp-bg)] rounded-xl text-[var(--gp-dark)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 focus:bg-[var(--gp-surface)] outline-none transition-all border border-transparent focus:border-[var(--gp-blue)]"
              @keyup.enter="saveEdit"
            />
          </div>
          <div class="flex gap-3">
            <button @click="cancelEdit" class="flex-1 py-3.5 rounded-full font-medium border border-[var(--gp-light-gray)] text-[var(--gp-dark)] active:bg-[var(--gp-bg)]">
              取消
            </button>
            <button
              @click="saveEdit"
              :disabled="!editValue.trim()"
              class="flex-1 py-3.5 rounded-full font-medium text-white transition-all"
              :class="editValue.trim() ? 'bg-[var(--gp-blue)] active:opacity-80' : 'bg-[var(--gp-light-gray)] text-[var(--gp-gray)] cursor-not-allowed'"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <transition name="toast">
        <div
          v-if="showToast"
          class="fixed top-16 left-1/2 -translate-x-1/2 z-[200] bg-[var(--gp-dark)] text-white text-sm px-5 py-2.5 rounded-full shadow-lg"
        >
          {{ toastMessage }}
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
