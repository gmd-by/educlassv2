<script setup>
import { ref, computed } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useAnnouncementStore } from "../stores/announcements.js";
import AppLayout from '../components/AppLayout.vue'

const studentId = ref('')
const studentsStore = useStudentsStore()
const foundStudent = ref(null)
const notFound = ref(false)
const totalStudents = computed(() => studentsStore.students.length)
const totalSections = computed(() => studentsStore.sections.length)
const chartColors = [
    '#b91c1c', '#65a30d', '#d97706', '#0f766e', '#eab308', '#1e40af', '#78716c', '#c026d3'
]
const announcementsStore = useAnnouncementStore()
const posts = computed(() => announcementsStore.posts)

const circumference = 2 * Math.PI * 36

const studentsPerSection = computed(() => {
  return studentsStore.sections.map((section) => {
    return {
      id: section.id,
      label: `${section.course} ${section.yearLevel} - ${section.name}`,
      count: studentsStore.students.filter((s) => s.sectionId === section.id).length,
    }
  })
})

const studentsPerCourse = computed(() => {
  const courses = [...new Set(studentsStore.students.map((s) => s.course))]
  return courses.map((course) => {
    return {
      course: course,
      count: studentsStore.students.filter((s) => s.course === course).length,
    }
  })
})

const expandedIds = ref([])
function isExpanded(id) {
  return expandedIds.value.includes(id)
}

function buildSlices(items, keyName) {
  let total = 0
  items.forEach((item) => {
    total = total + item.count
  })
  if (total === 0 ) return []
  let startAt = 0
  return items.map((item) => {
    const length = (item.count / total) * circumference
    const slice = {
      key: item[keyName],
      length: length,
      offset: -startAt,
    }
    startAt = startAt + length
    return slice
  })
}
const courseSlices = computed(() => buildSlices(studentsPerCourse.value, 'course'))
const sectionSlices = computed(() => buildSlices(studentsPerSection.value, 'id'))

function toggleExpanded(id) {
  if (isExpanded(id)) {
    expandedIds.value = expandedIds.value.filter((i) => i !== id)
  } else {
    expandedIds.value.push(id)
  }
}

function handleLookup() {
  const match = studentsStore.students.find(s => s.id === studentId.value)

  if (match) {
    foundStudent.value = match
    notFound.value = false
    } else {
    foundStudent.value = null
    notFound.value = true
  }
}

const foundFields = [
  { key: 'name', label: 'NAME' },
  { key: 'id', label: 'STUDENT NUMBER' },
  { key: 'email', label: 'EMAIL' },
  { key: 'academicYear', label: 'ACADEMIC YEAR' },
  { key: 'yearLevel', label: 'YEAR LEVEL' },
  { key: 'course', label: 'COURSE' }
]
</script>

<template>
  <AppLayout page-name="Dashboard">
  <!-- banner START -->
    <div class="relative overflow-hidden h-32 mb-6 shrink-0 bg-emerald-600">
      <img src="/bannerlogo.svg"
           alt=""
           class="absolute right-2 -bottom-14 h-52 w-auto opacity-80 pointer-events-none">
    </div>
    <!-- banner END -->

    <div class="w-full mb-6 px-[25px]">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- I. left column START -->
        <div class="lg:col-span-2 flex flex-col gap-4">

          <!-- student search START -->
          <div class="bg-white rounded shadow overflow-hidden">
            <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
              QUICK SEARCH
            </h2>
            <div class="p-4">
              <p class="text-gray-500 text-sm mb-3">Enter a student ID number.</p>
              <div class="flex gap-2">
                <input v-model.number="studentId"
                       type="text"
                       placeholder="Student ID"
                       class="flex-1 border border-gray-300 rounded px-3 py-2 selection:bg-emerald-100"/>
                <button @click="handleLookup()"
                        class="bg-emerald-700 text-sm text-white font-medium rounded-lg px-4 py-2 hover:bg-emerald-900">
                  Enter
                </button>
              </div>

              <!-- found student (TABLE) START -->
              <div v-if="foundStudent"
                   class="mt-4 pt-4 text-sm border-t border-gray-200">
                <div class="bg-white rounded border-1 border-gray-200 overflow-hidden flex flex-col xl:flex-row">
                  <div class="flex-1 min-w-0 py-2 px-2">
                    <table class="w-full">
                      <tbody class="tex-sm">
                      <tr v-for="field in foundFields"
                          :key="field.key">
                        <td class="py-2 px-4 font-medium">{{ field.label }}</td>
                        <td class="py-2 px-4">{{ foundStudent[field.key ]}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="shrink-0 flex items-center justify-center p-4 border-t border-gray-200 xl:border-t-0 xl:border-l xl:w-[40%]">
                    <div class="h-42 w-42 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      No photo
                    </div>
                  </div>
                </div>
              </div>
              <!-- found student END -->
              <p v-if="notFound"
                 class="mt-4 text-sm text-red-600">
                No student was found with that Student ID in our database. Try a different ID.
              </p>
            </div>
          </div>
          <!-- student search END -->

          <!-- layout (2x2) START -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- total students START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">{{ totalStudents }}</p>
              <p class="text-sm text-gray-500 font-medium">TOTAL STUDENTS</p>
              <svg xmlns="https://w3.org/2000/svg"
                   viewBox="0 0 640 640"
                   fill="currentColor"
                   class="absolute -right-1 -bottom-9 h-32 w-32 text-emerald-600 opacity-20 pointer-events-none">
                   <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
              </svg>
            </div>
            <!-- total students END -->

            <!-- sections START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">{{ totalSections }}</p>
              <p class="text-sm text-gray-500 font-medium">SECTIONS</p>
              <svg xmlns="https://w3.org/2000/svg"
                   viewBox="0 0 640 640"
                   fill="currentColor"
                   class="absolute -right-1 -bottom-9 h-32 w-32 text-emerald-600 opacity-20 pointer-events-none">
                <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4"/>
              </svg>
            </div>
            <!-- sections END -->

            <!-- sections per course (doughnut) START -->
            <div class="bg-white rounded shadow overflow-hidden flex flex-col">
              <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
                STUDENTS PER COURSE
              </h2>
              <div class="p-4 flex flex-col xl:flex-row items-center gap-4 flex-1">
                <div class="relative h-24 w-24 shrink-0">
                  <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
                    <circle v-for="(slice, index) in courseSlices"
                            :key="slice.key"
                            cx="50" cy="50" r="36"
                            fill="none"
                            stroke-width="16"
                            :stroke="chartColors[index]"
                            :stroke-dasharray="`${slice.length} ${circumference - slice.length}`"
                            :stroke-dashoffset="slice.offset"/>
                  </svg>
                </div>
                <ul class="w-full xl:flex-1">
                  <li v-for="(item, index) in studentsPerCourse"
                      :key="item.course"
                      class="flex justify-between gap-3 py-1 text-xs">
                    <span class="flex items-center gap-2 text-gray-600">
                      <span class="h-2.5 w-2.5 rounded-full shrink-0"
                            :style="{ backgroundColor: chartColors[index] }"></span>
                      {{ item.course }}
                    </span>
                    <span class="font-semibold text-gray-800">{{ item.count }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- students per course (doughnut) END -->

            <!-- students per section (doughnut) START -->
            <div class="bg-white rounded shadow overflow-hidden flex flex-col">
              <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
                STUDENTS PER SECTION
              </h2>
              <div class="p-4 flex flex-col xl:flex-row items-center gap-4 flex-1">
                <div class="relative h-24 w-24 shrink-0">
                  <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
                    <circle v-for="(slice, index) in sectionSlices"
                            :key="slice.key"
                            cx="50" cy="50" r="36"
                            fill="none"
                            stroke-width="16"
                            :stroke="chartColors[index]"
                            :stroke-dasharray="`${slice.length} ${circumference - slice.length}`"
                            :stroke-dashoffset="slice.offset"/>
                  </svg>
                </div>
                <ul class="w-full xl:flex-1">
                  <li v-for="(section, index) in studentsPerSection"
                      :key="section.id"
                      class="flex justify-between gap-3 py-1 text-xs">
                    <span class="flex items-center gap-2 text-gray-600">
                      <span class="h-2.5 w-2.5 rounded-full shrink-0"
                            :style="{ backgroundColor: chartColors[index] }"></span>
                      {{ section.label }}
                    </span>
                    <span class="font-semibold text-gray-800">{{ section.count }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- students per section (doughnut) END -->
          </div>
          <!-- stats and rings (2x2) END -->
        </div>
        <!-- left column END -->
        <!-- news column START -->
        <div class="bg-white rounded shadow overflow-hidden">
          <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
            ANNOUNCEMENTS
          </h2>
          <div class="px-4 divide-y divide-gray-200">
            <div v-for="post in posts"
                 :key="post.id"
                 class="py-3">
              <img :src="post.image || '/newsplaceholder.webp'"
                   :alt="post.image ? post.title : ''"
                   loading="lazy"
                   class="mb-2 h-32 w-full rounded object-cover">
              <div class="flex justify-between items-baseline">
                <h3 class="font-semibold text-gray-800 text-sm">{{ post.title }}</h3>
                <span class="text-xs text-gray-400">{{ post.date }}</span>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ post.author }}</p>
              <p class="text-sm text-gray-600"
                 :class="isExpanded(post.id) ? '' : 'truncate'">{{ post.body }}</p>
              <div class="text-right">
                <button type="button"
                        @click="toggleExpanded(post.id)"
                        class="text-xs text-emerald-700 hover:underline">
                  {{ isExpanded(post.id) ? 'Show less' : 'Show more...' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- VIII. news column END -->
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>

</style>