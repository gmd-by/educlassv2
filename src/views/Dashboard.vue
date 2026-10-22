<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useAnnouncementStore } from "../stores/announcements.js";
import { usePagination } from "../composables/usePagination.js";
import AppLayout from '../components/AppLayout.vue'
import DonutChart from '../components/DonutChart.vue'

const foundFields = [
  { key: 'name', label: 'NAME' },
  { key: 'id', label: 'STUDENT NUMBER' },
  { key: 'email', label: 'EMAIL' },
  { key: 'academicYear', label: 'ACADEMIC YEAR' },
  { key: 'yearLevel', label: 'YEAR LEVEL' },
  { key: 'course', label: 'COURSE' },
]

const studentsStore = useStudentsStore()
const announcementsStore = useAnnouncementStore()

// #student search (quick search) CARD
const query = ref('')
const foundStudent = ref(null)
const searchMessage = ref('')

function handleLookup() {
  const text = query.value.trim()
  if (!text) {
    foundStudent.value = null
    searchMessage.value = 'Input box is empty. Please enter a valid Student ID.'
    return
  }

  const match = studentsStore.students.find((s) => String(s.id) === text)
  foundStudent.value = match ?? null
  searchMessage.value = match
    ? ''
    : 'No student was found with that Student ID in our database. Try a different Student ID.'
}

// #stat & chart CARD
const totalStudents = computed(() => studentsStore.students.length)
const totalSections = computed(() => studentsStore.sections.length)

const studentsPerSection = computed(() => {
  return studentsStore.sections.map((section) => ({
    key: section.id,
    label: section.label,
    count: studentsStore.students.filter((s) => s.sectionId === section.id).length,
  }))
})

const studentsPerCourse = computed(() => {
  const courses = [...new Set(studentsStore.students.map((s) => s.course))]
  return courses.map((course) => ({
    key: course,
    label: course,
    count: studentsStore.students.filter((s) => s.course === course).length
  }))
})

// #announcements CARD
const posts = computed(() => announcementsStore.posts)
const postsPerPage = ref(2)
const postListRef = ref(null)
const bodyRefs = ref([])
const expandedIds = ref([])
const overflowingIds = ref([])

const {
    currentPage: postPage,
    totalPages: totalPostPages,
    pagedItems: pagedPosts,
    prev: prevPostPage,
    next: nextPostPage,
} = usePagination(posts, postsPerPage)

function isExpanded(id) {
  return expandedIds.value.includes(id)
}

function toggleExpanded(id) {
  if (isExpanded(id)) {
    expandedIds.value = expandedIds.value.filter((i) => i !== id)
  } else {
    expandedIds.value.push(id)
  }
}

function checkOverflow() {
  const ids = []
  bodyRefs.value.forEach((el) => {
    const id = el.dataset.id
    const isOpen = expandedIds.value.some((i) => String(i) === id)
    if (isOpen || el.scrollWidth > el.clientWidth) {
      ids.push(id)
    }
  })
  overflowingIds.value = ids
}

function fitPostsToHeight() {
  const list = postListRef.value
  if (!list || !list.firstElementChild) return
  if (expandedIds.value.length > 0) return

  const isWide = window.matchMedia('(min-width: 1024px)').matches
  if (!isWide) {
    postsPerPage.value = 2
    return
  }
  const fit = Math.floor(list.clientHeight / list.firstElementChild.offsetHeight)
  postsPerPage.value = Math.max(2, fit)
}

function handleResize() {
  fitPostsToHeight()
  nextTick(checkOverflow)
}

watch(pagedPosts, () => nextTick(checkOverflow))
watch(posts, () => nextTick(fitPostsToHeight))

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <AppLayout page-name="Dashboard">
    <!-- #banner START -->
    <div class="relative overflow-hidden h-32 mb-6 shrink-0 bg-emerald-600">
      <img src="/bannerlogo.svg"
           alt=""
           class="absolute right-2 -bottom-14 h-52 w-auto opacity-80 pointer-events-none">
    </div>
    <!-- #banner END -->

    <div class="flex flex-1 flex-col w-full mb-6 px-[25px]">
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- #left column START -->
        <div class="lg:col-span-2 flex flex-col gap-4">

          <!-- #student search (quick search) START -->
          <div class="bg-white rounded shadow overflow-hidden">
            <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
              QUICK SEARCH
            </h2>
            <div class="p-4">
              <label for="student-search"
                     class="block text-gray-500 text-sm mb-3">
                Enter a student ID number.
              </label>
              <div class="flex gap-2">
                <input id="student-search"
                       v-model="query"
                       @keyup.enter="handleLookup"
                       type="text"
                       inputmode="numeric"
                       placeholder="Student ID"
                       class="flex-1 border border-gray-300 rounded px-3 py-2 selection:bg-emerald-100"/>
                <button type="button"
                        @click="handleLookup"
                        class="bg-emerald-700 text-sm text-white font-medium rounded-lg px-4 py-2 hover:bg-emerald-900">
                  Enter
                </button>
              </div>

              <!-- #found student (TABLE) START -->
              <div v-if="foundStudent"
                   class="mt-4 pt-4 text-sm border-t border-gray-200">
                <div class="bg-white rounded border-1 border-gray-200 overflow-hidden flex flex-col xl:flex-row">
                  <div class="flex-1 min-w-0 py-2 px-2">
                    <table class="w-full table-fixed">
                      <tbody class="text-sm">
                      <tr v-for="field in foundFields"
                          :key="field.key">
                        <td class="w-46 py-2 px-4 font-medium text-left">{{ field.label }}</td>
                        <td class="py-2 px-4 text-left break-words">{{ foundStudent[field.key] }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="shrink-0 flex items-center justify-center p-4 border-t border-gray-200 xl:border-t-0 xl:border-l xl:w-[40%]">
                    <img v-if="foundStudent.photo"
                         :src="foundStudent.photo"
                         alt=""
                         class="h-42 w-42 rounded object-cover">
                    <div v-else
                         class="h-42 w-42 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      No photo
                    </div>
                  </div>
                </div>
              </div>
              <!-- #found student (TABLE) END -->

              <p v-if="searchMessage"
                 class="mt-4 text-sm text-red-600">
                {{ searchMessage }}
              </p>
            </div>
          </div>
          <!-- #student search (quick search) END -->

          <!-- #stats and charts START -->
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-[auto_1fr] gap-4">

            <!-- #total students START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">
                {{ totalStudents }}
              </p>
              <p class="text-sm text-gray-500 font-medium">
                TOTAL STUDENTS
              </p>
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 640 640"
                   fill="currentColor"
                   class="absolute -right-1 -bottom-9 h-32 w-32 text-emerald-600 opacity-20 pointer-events-none">
                <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
              </svg>
            </div>
            <!-- #total students END -->

            <!-- #sections START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">
                {{ totalSections }}
              </p>
              <p class="text-sm text-gray-500 font-medium">
                SECTIONS
              </p>
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 640 640"
                   fill="currentColor"
                   class="absolute -right-1 -bottom-9 h-32 w-32 text-emerald-600 opacity-20 pointer-events-none">
                <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4"/>
              </svg>
            </div>
            <!-- #sections END -->

            <!-- #students per course (CHART) START -->
            <DonutChart title="STUDENTS PER COURSE" :items="studentsPerCourse"/>
            <!-- #students per course (CHART) END -->

            <!-- #students per section (CHART) START -->
            <DonutChart title="STUDENTS PER SECTION" :items="studentsPerSection"/>
            <!-- #students per section (CHART) END -->

          </div>
          <!-- #stats and charts END -->

        </div>
        <!-- #left column END -->

        <!-- #news column START -->
        <div class="relative">
          <div class="bg-white rounded shadow overflow-hidden flex flex-col lg:absolute lg:inset-0">
            <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
              ANNOUNCEMENTS
            </h2>

            <div ref="postListRef"
                 class="px-4 divide-y divide-gray-200 flex-1 min-h-0 overflow-y-auto">
              <div v-for="post in pagedPosts"
                   :key="post.id"
                   class="py-3">
                <img :src="post.image || '/newsplaceholder.webp'"
                     :alt="post.image ? post.title : ''"
                     loading="lazy"
                     class="mb-2 h-32 w-full rounded object-cover">
                <div class="flex justify-between items-baseline">
                  <h3 class="font-semibold text-gray-800 text-sm">
                    {{ post.title }}
                  </h3>
                  <span class="text-xs text-gray-400">
                    {{ post.date }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mb-1">
                  {{ post.author }}
                </p>
                <p ref="bodyRefs"
                   class="text-sm text-gray-600"
                   :data-id="post.id"
                   :class="isExpanded(post.id) ? '' : 'truncate'">
                  {{ post.body }}
                </p>
                <div v-if="overflowingIds.includes(String(post.id))"
                     class="text-right">
                  <button type="button"
                          @click="toggleExpanded(post.id)"
                          class="text-xs text-emerald-700 hover:underline">
                    {{ isExpanded(post.id) ? 'Show less' : 'Show more...' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- #pager START -->
            <div class="flex items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
              <RouterLink to="/announcements"
                          class="text-emerald-700 hover:underline">
                View all
              </RouterLink>
              <div v-if="totalPostPages > 1"
                   class="flex items-center gap-2">
                <button type="button"
                        :disabled="postPage === 1"
                        @click="prevPostPage"
                        class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
                  Newer
                </button>
                <span>{{ postPage }} / {{ totalPostPages }}</span>
                <button type="button"
                        :disabled="postPage === totalPostPages"
                        @click="nextPostPage"
                        class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
                  Older
                </button>
              </div>
            </div>
            <!-- #pager END -->

          </div>
        </div>
        <!-- #news column END -->

      </div>
    </div>
  </AppLayout>
</template>