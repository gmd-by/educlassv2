<script setup>
import { ref, computed } from 'vue'
import { useStudentsStore } from '../stores/students'
import { Doughnut } from 'vue-chartjs'
import { Users, Layers } from 'lucide-vue-next'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import AppLayout from '../components/AppLayout.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const studentId = ref('')
const studentsStore = useStudentsStore()
const foundStudent = ref(null)
const notFound = ref(false)
const totalStudents = computed(() => studentsStore.students.length)
const totalSections = computed(() => studentsStore.sections.length)
const chartColors = [
    '#dc2626', '#65a30d', '#d97706', '#0f766e', '#eab308', '#1e40af', '#78716c', '#c026d3'
]

const studentsPerSection = computed(() => {
  return studentsStore.sections.map((section) => {
    return {
      id: section.id,
      label: `${section.course} ${section.yearLevel} - ${section.name}`,
      count: studentsStore.students.filter((s) => s.sectionId === section.id).length,
    }
  })
})

const sectionChartData = computed(() => {
  return {
    labels: studentsPerSection.value.map((item) => item.label),
    datasets: [
    { label: 'Students',
      data: studentsPerSection.value.map((item) => item.count),
      backgroundColor: chartColors,
    },
  ]
  }
})

const courseChartData = computed(() => {
  return {
    labels: studentsPerCourse.value.map((item) => item.course),
    datasets: [
      {
        data: studentsPerCourse.value.map((item) => item.count),
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
}

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

    <!-- stats START -->
    <div class="w-full mb-6 px-[25px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- total students START -->
        <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24 px-6">
          <p class="text-2xl font-semibold text-gray-800">{{ totalStudents }}</p>
          <p class="text-sm text-emerald-700 font-medium">TOTAL STUDENTS</p>
          <Users class="absolute -right-2 -bottom-4 h-20 w-20 text-emerald-700 opacity-20 pointer-events-none"/>
        </div>
        <!-- total students END -->
        <!-- sections START -->
        <div class="relative overflow-hidden bg-white rounded shadow p-4 h-24 px-6">
          <p class="text-2xl font-semibold text-gray-800">{{ totalSections }}</p>
          <p class="text-sm text-emerald-700 font-medium">SECTIONS</p>
          <Layers class="absolute -right-2 -bottom-4 h-20 w-20 text-emerald-700 opacity-20 pointer-events-none"/>
        </div>
        <!-- sections END -->
        <!-- students per course (doughnut) START -->
        <div class="bg-white rounded shadow flex flex-col overflow-hidden">
          <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
            Students per course
          </h2>
          <div class="p-4 flex flex-col sm:flex-row items-center gap-4 flex-1">
            <div class="relative h-24 w-24 shrink-0">
              <Doughnut :data="courseChartData"
                        :options="doughnutOptions"/>
              </div>
            <ul class="w-full sm:flex-1">
              <li v-for="(item, index) in studentsPerCourse"
                  :key="item.courrse"
                  class="flex justify-between py-1 text-xs">
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
        <div class="bg-white rounded shadow flex flex-col overflow-hidden">
          <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
            Students per section
          </h2>
          <div class="p-4 flex flex-col sm:flex-row items-center gap-4 flex-1">
            <div class="relative h-24 w-24 shrink-0">
              <Doughnut :data="sectionChartData"
                        :options="doughnutOptions"/>
            </div>
            <ul class="w-full sm:flex-1">
              <li v-for="(section, index) in studentsPerSection"
                  :key="section.id"
                  class="flex justify-between py-1 text-xs">
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
    </div>
    <!-- stats END -->

    <div class="w-full mb-6 px-[25px]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- student search START -->
    <div class="bg-white rounded shadow overflow-hidden">
      <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
        Quick Search
      </h2>
    <div class="p-4">
      <p class="text-gray-500 text-sm mb-3">Enter a student ID number to view student info.</p>
        <div class="flex gap-2">
          <input v-model.number="studentId"
                 type="text"
                 placeholder="Student ID"
                 class="flex-1 border border-gray-300 rounded text-sm px-3 py-2"/>
          <button @click="handleLookup()"
                  class="bg-emerald-700 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-gray-800">
            Enter
          </button>
        </div>
        <div v-if="foundStudent"
             class="mt-4 pt-4 border-t border-gray-200 text-sm text-sm/7">
          <table class="border-separate border-spacing-x-4">
            <thead>
            <tr>
              <p class="font-medium">NAME </p>
                <td>{{ foundStudent.name }}</td>
            </tr>
            <tr>
              <p class="font-medium">STUDENT ID </p>
              <td>{{ foundStudent.id }}</td>
            </tr>
            <tr>
              <p class="font-medium">EMAIL </p>
              <td>{{ foundStudent.email }}</td>
            </tr>
            <tr>
              <p class="font-medium">ACADEMIC YEAR </p>
              <td>{{ foundStudent.academicYear }}</td>
            </tr>
            <tr>
              <p class="font-medium">YEAR LEVEL </p>
              <td>{{ foundStudent.yearLevel }}</td>
            </tr>
            <tr>
              <p class="font-medium">COURSE </p>
              <td>{{ foundStudent.course }}</td>
            </tr>
            </thead>
          </table>
        </div>
        <p v-if="notFound"
           class="mt-4 text-sm text-red-600">
          No student was found with that Student ID. Please try a different ID.
        </p>
      </div>
    </div>
    <!-- student search END -->
    <!-- announcement board START -->
    <div class="bg-white rounded shadow overflow-hidden">
      <h2 class="bg-emerald-700 text-white font-medium text-sm px-4 py-2 border-b border-emerald-700">
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
   <!-- announcement board END -->
  </div>
  </div>
  </AppLayout>
</template>

<style scoped>

</style>