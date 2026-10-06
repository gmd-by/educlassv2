<script setup>
import { ref, computed } from 'vue'
import { useStudentsStore } from '../stores/students'
import { Users, Layers } from 'lucide-vue-next'
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

const posts = [
  {
    id: 1, title: 'Midterm Schedule Released', author: 'Registrar Office', date: 'Oct 3, 2026',
    body: 'Midterm exams will run from October 15 to 19. Check your department for the full schedule.' },
  { id: 2, title: 'Library Extended Hours', author: 'Library Staff', date: 'Sep 30, 2026',
    body: 'The library will stay open until 10 PM on weekdays for the rest of the semester.' },
  { id: 3, title: 'Enrollment for Next Term Opens Soon', author: 'Registrar Office', date: 'Sep 28, 2026',
    body: 'Enrollment slots for the Educlass University open November 3-6, 2026. Make sure you records are updated beforehand.' },
]

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
</script>

<template>
  <AppLayout page-name="Dashboard">
  <div class="overflow-hidden h-40 mb-6 shrink-0">
    <img src="/bannerv2.webp"
         alt="banner"
         class="w-full h-full object-cover"
         />
    </div>
    <div class="w-full mb-6 px-[25px]">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- I. left column START -->
        <div class="lg:col-span-2 flex flex-col gap-4">

          <!-- student search START -->
          <div class="bg-white rounded shadow overflow-hidden">
            <h2 class="bg-emerald-100 text-emerald-800 font-medium text-sm px-4 py-2 border-b border-emerald-200">
              Quick Search
            </h2>
            <div class="p-4">
              <p class="font-light text-gray-500 text-sm mb-3">Enter a student ID number.</p>
              <div class="flex gap-2">
                <input v-model.number="studentId"
                       type="text"
                       placeholder="Student ID"
                       class="flex-1 border border-gray-300 rounded px-3 py-2"/>
                <button @click="handleLookup()"
                        class="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue:700">
                  Enter
                </button>
              </div>
            <div v-if="foundStudent"
                  class="mt-4 pt-4 border-t border-gray-200">
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
              <p><span class="font-bold">Name:</span> {{ foundStudent.name }}</p>
            </div>
              <p v-if="notFound"
                 class="mt-4 text-red-600">
                No student was found with that Student ID in our database. Try another.
              </p>
            </div>
          </div>
          <!-- student search END -->

          <!-- layout (2x2) START -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- total students START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">{{ totalStudents }}</p>
              <p class="text-sm text-gray-500 font-medium">Total Students</p>
              <Users class="absolute -right-2 -bottom-4 h-20 w-20 text-emerald-600 opacity-20 pointer-events-none"/>
            </div>
            <!-- total students END -->

            <!-- sections START -->
            <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24">
              <p class="text-2xl font-semibold text-gray-800">{{ totalSections }}</p>
              <p class="text-sm text-gray-500 font-medium">Sections</p>
              <Layers class="absolute -right-2 -bottom-4 h-20 w-20 text-emerald-600 opacity-20 pointer-events-none"/>
            </div>
            <!-- sections END -->

            <!-- sections per course (doughnut) START -->
            <div class="bg-white rounded shadow overflow-hidden flex flex-col">
              <h2 class="bg-emerald-100 text-emerald-800 font-medium text-sm px-4 py-2 border-b border-emerald-200">
                Students per Course
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
              <h2 class="bg-emerald-100 text-emerald-100 font-medium text-sm px-4 py-2 border-b border-emerald-200">
                Students per Section
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
          <h2 class="bg-emerald-100 text-emerald-800 font-medium text-sm px-4 py-2 border-b border-emerald-200">
            Announcements
          </h2>
          <div class="px-4 divide-y divide-gray-200">
            <div v-for="post in posts"
                 :key="post.id"
                 class="py-3">
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