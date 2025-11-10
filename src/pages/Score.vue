<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { Search, Info, ChevronDown, ChevronUp } from 'lucide-vue-next'
import Button from '../components/Button.vue'
import Cap from '@cap.js/widget'
import axios from 'axios'

const types = ['全部', '流行', '动漫', '游戏', '古典', '儿童', '博歌乐', '综合', '南梦宫原创']
const selectedType = ref('全部')

const crowns = ['全部', '未通关', '银冠（通关）', '金冠（全连）', '虹冠（全良连段）']
const selectedCrown = ref('全部')

const levels = ['全部', '简单', '一般', '困难', '魔王', '魔王里']
const selectedLevel = ref('全部')

const ranks = ['全部', '白粹', '铜粹', '银粹', '金雅', '粉雅', '紫雅', '极']
const selectedRank = ref('全部')

const sorts = ['更新时间', '刷新记录时间', '得分', '难度']
const selectedSort = ref('更新时间')
const sortDirection = ref<'asc' | 'desc'>('desc')

const searchQuery = ref('')

const selectSort = (sort: string) => {
  if (selectedSort.value === sort) {
    // 切换顺序
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    selectedSort.value = sort
    sortDirection.value = 'desc' // 默认降序
  }
}

const userId = inject<Ref<number | null>>('userId') || ref(null)
const scores = inject<Ref<any[]>>('scores') || ref([])

const detailVisible = inject<Ref<boolean>>('detailVisible')
const detailSongId = inject<Ref<number | undefined>>('detailSongId')
const detailLevel = inject<Ref<number | undefined>>('detailLevel')

const handleOpenDetail = (songId: number, level: number) => {
  if (detailVisible && detailSongId && detailLevel) {
    detailSongId.value = songId
    detailLevel.value = level
    detailVisible.value = true
  }
}

const filteredScores = computed(() => {
  let filtered = scores.value

  // 搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((score: any) =>
      score.score_name.toLowerCase().includes(query) ||
      (score.subtitle && typeof score.subtitle === 'string' && score.subtitle.toLowerCase().includes(query)) ||
      score.score_name_jp.toLowerCase().includes(query)
    )
  }

  // 类型筛选
  if (selectedType.value !== '全部') {
    filtered = filtered.filter((score: any) => score.type === `${selectedType.value}音乐`)
  }

  // 难度筛选
  if (selectedLevel.value !== '全部') {
    const levelMap: Record<string, number> = {
      '简单': 1,
      '一般': 2,
      '困难': 3,
      '魔王': 4,
      '魔王里': 5,
    }
    const levelNum = levelMap[selectedLevel.value]
    filtered = filtered.filter((score: any) => score.level === levelNum)
  }

  // 皇冠筛选
  if (selectedCrown.value !== '全部') {
    filtered = filtered.filter((score: any) => {
      if (selectedCrown.value === '未通关') {
        return score.clear_cnt === 0
      } else if (selectedCrown.value === '银冠（通关）') {
        return score.clear_cnt > 0 && score.full_combo_cnt === 0
      } else if (selectedCrown.value === '金冠（全连）') {
        return score.full_combo_cnt > 0 && score.dondaful_combo_cnt === 0
      } else if (selectedCrown.value === '虹冠（全良连段）') {
        return score.dondaful_combo_cnt > 0
      }
      return true
    })
  }

  // 评价筛选
  if (selectedRank.value !== '全部') {
    const rankMap: Record<string, string> = {
      '白粹': '2',
      '铜粹': '3',
      '银粹': '4',
      '金雅': '5',
      '粉雅': '6',
      '紫雅': '7',
      '极': '8',
    }
    filtered = filtered.filter((score: any) => score.best_score_rank.toString() === rankMap[selectedRank.value])
  }

  // 排序
  filtered.sort((a: any, b: any) => {
    let aValue: any
    let bValue: any

    switch (selectedSort.value) {
      case '更新时间':
        aValue = new Date(a.update_datetime).getTime()
        bValue = new Date(b.update_datetime).getTime()
        break
      case '刷新记录时间':
        aValue = new Date(a.highscore_datetime).getTime()
        bValue = new Date(b.highscore_datetime).getTime()
        break
      case '得分':
        aValue = a.high_score
        bValue = b.high_score
        break
      case '难度':
        const aLevel = a.level
        const bLevel = b.level
        if (aLevel !== bLevel) {
          aValue = aLevel
          bValue = bLevel
        } else {
          const levelKey = `level_${aLevel}`
          const aLevelStr = a.song_detail?.[levelKey] || '-'
          const bLevelStr = b.song_detail?.[levelKey] || '-'
          if (aLevelStr === '-') {
            aValue = sortDirection.value === 'asc' ? Infinity : -Infinity
          } else {
            aValue = parseInt(aLevelStr)
          }
          if (bLevelStr === '-') {
            bValue = sortDirection.value === 'asc' ? Infinity : -Infinity
          } else {
            bValue = parseInt(bLevelStr)
          }
        }
        break
      default:
        aValue = 0
        bValue = 0
    }

    if (sortDirection.value === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  return filtered.map((item: any) => {
    let crown = ''

    if (item.dondaful_combo_cnt) {
      crown = 'rainbow'
    } else if (item.full_combo_cnt) {
      crown = 'gold'
    } else if (item.clear_cnt) {
      crown = 'silver'
    }

    return {
      songId: item.song_no,
      type: item.song_detail?.type || '',
      song_name: item.song_detail?.song_name || '未知曲目',
      subtitle: item.song_detail?.subtitle || '',
      level_1: item.song_detail?.level_1 || '-',
      level_2: item.song_detail?.level_2 || '-',
      level_3: item.song_detail?.level_3 || '-',
      level_4: item.song_detail?.level_4 || '-',
      level_5: item.song_detail?.level_5 || '-',

      level: item.level,
      high_score: item.high_score,
      best_score_rank: item.best_score_rank,
      crown,
    }
  })
})

const getScore = async (id: number) => {
  const res = await axios.get('https://hasura.llx.life/api/rest/donder/get-score', {
    params: { id }
  })
  const data = res.data.score.data
  const scores = typeof data === 'string' ? JSON.parse(data) : data || []
  const updateTime = new Date(res.data.score.updated_at).toLocaleString().replace(/\//g, '.')
  return { scores, updateTime }
}

const bindLoading = ref(false)
const bindError = ref('')
const handleBind = async (refresh: boolean = false) => {
  if (!captchaToken.value && userId.value) {
    return
  }
  const id = userId.value
  localStorage.setItem('userId', `${id}`)
  bindLoading.value = true

  if (refresh) {
    const { scores: newScores, updateTime: newUpdateTime } = await getScore(id!)
    scores.value = newScores
    updateTime.value = newUpdateTime
    bindLoading.value = false
    return
  }

  axios.post('http://localhost:7001/refresh_score', {
    id,
    token: captchaToken.value
  }).then(res => {
    if (res.data.code) {
      getScore(id!).then(({ scores: newScores, updateTime: newUpdateTime }) => {
        scores.value = newScores
        updateTime.value = newUpdateTime
      }).finally(() => {
        bindLoading.value = false
      })
    } else {
      bindError.value = res.data.message
      bindLoading.value = false
      resetCaptcha()
    }
  }).catch(() => {
    bindError.value = '绑定失败，请稍后重试咚~'
    bindLoading.value = false
    resetCaptcha()
  })
}

const handleRefresh = async () => {
  bindLoading.value = true
  const cap = new Cap({
    apiEndpoint: 'https://capjs.llx.life/8da786bced/',
  })
  const solution = await cap.solve()
  captchaToken.value = solution.token
  await handleBind(true)
}

const handleUnbind = () => {
  localStorage.removeItem('userId')
  userId.value = null
  scores.value = []
}

const updateTime = ref('')
onMounted(() => {
  Cap
  if (localStorage.getItem('userId')) {
    userId.value = Number(localStorage.getItem('userId')) || null
    // 自动加载成绩
    getScore(userId.value!).then(({ scores: newScores, updateTime: newUpdateTime }) => {
      scores.value = newScores
      updateTime.value = newUpdateTime
    })
  }
})

const captchaToken = ref('');

(window as any).handleCaptchaSolved = (e: any) => {
  console.log("Captcha solved with token:", e.detail.token)
  captchaToken.value = e.detail.token
}

const resetCaptcha = () => {
  const widget = document.querySelector('#cap') as any
  if (widget && widget.reset) {
    widget.reset()
  }
}
</script>

<template>
  <div class="w-screen-xl mx-auto my-8 flex flex-col items-center gap-8 text-dark">
    <!-- 玩家ID绑定 -->
    <div v-if="!scores.length" class="bg-white/50 w-100 rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 space-y-4 flex flex-col items-center">
      <img class="w-30" src="/img/sticker/sticker_1.png" alt="">
      <input
        v-model="userId"
        type="number"
        placeholder="请输入要查询成绩的玩家ID咚~"
        class="w-full p-4 bg-white rounded-xl border-white border-2 ring-2 ring-amber-950 outline-none"
      >
      <p v-if="bindError" class="text-red-400">{{ bindError }}</p>
      <cap-widget
        id="cap"
        data-cap-api-endpoint="https://capjs.llx.life/8da786bced/"
        data-cap-i18n-verifying-label="验证中..."
        data-cap-i18n-initial-state="我是人类咚~"
        data-cap-i18n-solved-label="验证通过咚~"
        data-cap-i18n-error-label="验证失败"
        onsolve="handleCaptchaSolved"
      ></cap-widget>
      <Button class="px-8" @click="handleBind" :disabled="!captchaToken || !userId || bindLoading">
        {{ bindLoading ? '绑定中...' : '确认' }}
      </Button>
    </div>
    <!-- 查询结果 -->
    <template v-else>
      <div class="bg-white/50 w-full rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 flex justify-between items-center">
        <div>
          <p>同步时间：{{ updateTime }}</p>
          <p class="text-amber-600 cursor-pointer hover:underline" @click="handleUnbind">解除绑定</p>
        </div>
        <div class="flex items-center space-x-4">
          <p v-if="bindError" class="text-red-400">{{ bindError }}</p>
          <Button class="px-4" @click="handleRefresh" :disabled="bindLoading">
            {{ bindLoading ? '同步中...' : '同步成绩' }}
          </Button>
        </div>
      </div>
      <div class="bg-white/50 w-full rounded-xl p-4 border-white border-2 ring-2 ring-amber-950 space-y-4">
        <!-- 搜索 -->
        <div class="relative flex items-center">
          <Search class="absolute ml-4" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="请输入歌曲名称、作曲家，或者别名咚~"
            class="w-full pl-12 p-4 bg-white rounded-xl border-white border-2 ring-2 ring-amber-950 outline-none"
          >
        </div>
        <!-- 筛选与排序 -->
        <div class="space-y-2">
          <div class="flex items-center">
            <p class="w-15">分类</p>
            <div class="flex space-x-2">
              <p
                v-for="type in types" :key="type"
                @click="selectedType = type"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': selectedType === type }"
              >
                {{ type }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <p class="w-15">难度</p>
            <div class="flex space-x-2">
              <p
                v-for="level in levels" :key="level"
                @click="selectedLevel = level"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': selectedLevel === level }"
              >
                {{ level }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <p class="w-15">皇冠</p>
            <div class="flex space-x-2">
              <p
                v-for="crown in crowns" :key="crown"
                @click="selectedCrown = crown"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': selectedCrown === crown }"
              >
                {{ crown }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <p class="w-15">评价</p>
            <div class="flex space-x-2">
              <p
                v-for="rank in ranks" :key="rank"
                @click="selectedRank = rank"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': selectedRank === rank }"
              >
                {{ rank }}
              </p>
            </div>
          </div>
          <div class="flex items-center">
            <p class="w-15">排序</p>
            <div class="flex space-x-2">
              <div
                v-for="sort in sorts" :key="sort"
                @click="selectSort(sort)"
                class="text-amber-950 px-2 py-0.5 rounded cursor-pointer flex items-center hover:bg-amber-400/50"
                :class="{ 'text-border !bg-amber-400 text-white': selectedSort === sort }"
              >
                <p>{{ sort }}</p>
                <ChevronDown v-if="selectedSort === sort && sortDirection === 'desc'" class="w-5 !text-amber-950 opacity-50" />
                <ChevronUp v-else-if="selectedSort === sort && sortDirection === 'asc'" class="w-5 !text-amber-950 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-blue-200 rounded-full px-4 py-2 text-sm shadow flex items-center space-x-2">
        <Info class="w-5" />
        <p>查找到 {{ filteredScores.length }} 条数据</p>
      </div>
      <div class="w-full">
        <div
          v-for="(score, index) in filteredScores"
          :key="index"
          @click="handleOpenDetail(score.songId, score.level)"
          class="p-4 rounded-xl flex justify-between items-center [content-visibility:auto] transition-colors hover:(bg-black/5) cursor-pointer"
        >
          <div class="flex items-center space-x-2">
            <p
              v-if="score.type"
              class="text-sm px-2 py-1 rounded-full text-white text-shadow border-2 border-white"
              :class="{
                'bg-blue-500' : score.type === '流行音乐',
                'bg-pink-500' : score.type === '动漫音乐',
                'bg-purple-500' : score.type === '游戏音乐',
                'bg-amber-500' : score.type === '古典音乐',
                'bg-yellow-500' : score.type === '儿童音乐',
                'bg-gray-500' : score.type === '博歌乐音乐',
                'bg-green-500' : score.type === '综合音乐',
                'bg-red-500' : score.type === '南梦宫原创音乐',
              }"
            >
              {{ score.type }}
            </p>
            <div>
              <p class="text-xl">{{ score.song_name }}</p>
              <p v-if="score.subtitle" class="text-sm text-gray-500">{{ score.subtitle }}</p>
            </div>
          </div>
          <div class="flex space-x-4 items-center">
            <!-- 皇冠 -->
            <img v-if="score.crown" class="w-10" :src="`/img/crown/crown_${score.crown}.png`" alt="">
            <!-- 评价 -->
            <img class="w-10" :src="`/img/score_badge/score_${score.best_score_rank}.png`" alt="">
            <!-- 分数 -->
            <div>
              <p class="text-white font-bold text-2xl text-border w-24 text-center">{{ score.high_score }}</p>
            </div>
            <!-- 难度 -->
            <div
              class="relative w-15 h-10 rounded-lg border-2 border-white"
              :class="{
                'bg-red-300': score.level === 1,
                'bg-lime-300': score.level === 2,
                'bg-blue-300': score.level === 3,
                'bg-pink-300': score.level === 4,
                'bg-purple-300': score.level === 5,
              }"
            >
              <div class="absolute w-full h-full bg-gradient-to-b from-white/50 to-transparent"></div>
              <div class="relative w-full h-full flex items-center justify-center space-x-1">
                <img class="w-6" :src="`/img/level/level_${score.level}.png`" alt="">
                <p class="text-white font-bold text-xl text-border">
                  {{ (score as any)[`level_${score.level}`] || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>