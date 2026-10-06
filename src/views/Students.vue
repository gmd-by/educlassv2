<script setup>
import AppLayout from '../components/AppLayout.vue'
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStudentsStore } from '../stores/students'
import { Search, GraduationCap, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const columnWidths = computed(() => {
  const widths = {}
  columns.forEach((col) => {
    const longestValue = Math.max(
        ...studentsStore.students.map((student) => String(student[col.key]).length)
    )
    const longest = Math.max(longestValue, col.label.length, 8)
    widths[col.key] = `calc(${longest}ch + 3rem)`
  })
  return widths
})

const sortColumn = ref(null)
const sortDirection = ref('desc')
const studentsStore = useStudentsStore()
const { sectionTitle, selectedSectionId, sections } = storeToRefs(studentsStore)

const showColumnMenu = ref(false)
const showSectionMenu = ref(false)

function pickSection(id) {
  selectedSectionId.value = id
  showSectionMenu.value = false
}

const defaultKeys = ['id', 'name', 'email', 'academicYear', 'yearLevel', 'course']
const resetKeys = []
const visibleKeys = ref([...defaultKeys])
const visibleColumns = computed(() => {
  return columns.filter((col) => visibleKeys.value.includes(col.key))
})

const filters = reactive({
  id: '',
  name: '',
  email: '',
  academicYear: '',
  yearLevel: '',
  course: '',
})

const filteredStudents = computed(() => {
  return sectionStudents.value.filter((student) => {
    return (
        String(student.id).includes(filters.id) &&
            student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            student.email.toLowerCase().includes(filters.email.toLowerCase()) &&
            student.academicYear.toLowerCase().includes(filters.academicYear.toLowerCase()) &&
            student.yearLevel.toLowerCase().includes(filters.yearLevel.toLowerCase()) &&
            student.course.toLowerCase().includes(filters.course.toLowerCase())
    )
  })
})

const sortedStudents = computed(() => {
  if (!sortColumn.value) return filteredStudents.value

  const column = sortColumn.value
  const direction = sortDirection.value

  return [...filteredStudents.value].sort((a,b) => {
    let valA = a[column]
    let valB = b[column]

    if (typeof valA === 'string') {
      valA = valA.toLowerCase()
      valB = valB.toLowerCase()
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })
})

const currentPage = ref(1)
const pageSizeOptions = [5, 10, 25]
const pageSize = ref(10)
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedStudents.value.length / pageSize.value))
})

const pagedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedStudents.value.slice(start, start + pageSize.value)
})

const rangeStart = computed(() => {
  return sortedStudents.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
})

const rangeEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, sortedStudents.value.length)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const sectionStudents = computed(() => {
  if (selectedSectionId.value === null) return studentsStore.students
  return studentsStore.students.filter((student) => student.sectionId === selectedSectionId.value)
})

function toggleSort(column) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
}

function selectAll() {
  visibleKeys.value = columns.map((col) => col.key)
}

function resetColumns() {
  visibleKeys.value = [...resetKeys]
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'academicYear', label: 'Academic Year (S.Y.)' },
  { key: 'yearLevel', label: 'Year Level' },
  { key: 'course', label: 'Course' },
]

watch(visibleKeys, (keys) => {
  columns.forEach((col) => {
    if (!keys.includes(col.key)) filters[col.key] = ''
  })
  if (!keys.includes(sortColumn.value)) sortColumn.value = null
}, { deep: true })

watch(
    [filters, sortColumn, sortDirection, selectedSectionId, pageSize],
    () => {
      currentPage.value = 1
    }
)

const columnMenuRef = ref(null)
const sectionMenuRef = ref(null)
function handleClickOutside(event) {
  if (columnMenuRef.value && !columnMenuRef.value.contains(event.target)) {
    showColumnMenu.value = false
  }
  if (sectionMenuRef.value && !sectionMenuRef.value.contains(event.target)) {
    showSectionMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <AppLayout page-name="Students">
    <div class="p-6 flex flex-col flex-1 min-h-[28rem]">
      <div class="bg-white rounded shadow flex-1 min-h-0 flex flex-col">

        <!-- header START -->
        <div class="relative shrink-0 rounded-t bg-emerald-600 border-emerald-700">
          <div class="absolute inset-y-0 right-0 w-64 overflow-hidden rounded-tr pointer-events-none">
            <svg xmlns="https://w3.org/2000/svg"
                 viewBox="0 0 640 640"
                 fill="currentColor"
                 class="absolute -right-1 -bottom-15 h-48 w-48 text-white opacity-70 pointer-events-none">
              <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4"/>
            </svg>
          </div>
          <h2 class="px-4 pt-4 font-medium text-lg text-white">STUDENT MANAGEMENT</h2>

        <!-- toolbar START -->
        <div class="flex flex-wrap items-center gap-4 px-4 py-4">

          <!-- class/section toggle START -->
          <div ref="sectionMenuRef"
               class="relative w-full sm:w-72">
            <div class="relative text-sm font-medium w-full rounded border border-gray-300 bg-white pl-3 pr-3 py-1">
              <button type="button"
                      class="flex items-center justify-between gap-2 w-full"
                      @click="showSectionMenu = !showSectionMenu">
                {{ sectionTitle }}
                <ChevronDown class="w-4 h-4 text-gray-500"
                             :class="showSectionMenu ? 'rotate-180' : ''"/>
              </button>
              <div v-if="showSectionMenu"
                   class="absolute w-72 max-w-[85vw] flex flex-col items-start gap-1 absolute top-full left-0 right-0 z-20 rounded bg-white border border-gray-300 pl-3 pr-3 py-2">
                <button type="button"
                        class="mb-2"
                        @click="pickSection(null)"> All Students </button>
                <button v-for="section in sections"
                        class="mb-2 hover:bg-emerald-100"
                        :key="section.id"
                        @click="pickSection(section.id)">
                  {{ section.course }} {{ section.yearLevel }} - {{ section.name }}
                </button>
              </div>
            </div>
          </div>
          <!-- class/section toggle END -->

          <!-- columns START -->
          <div ref="columnMenuRef"
               class="relative w-full sm:w-72">
            <button type="button"
                    class="flex items-center w-full max-w-[85vw] border border-gray-300 rounded bg-white justify-between gap-2 pl-3 pr-3 py-1 text-sm font-medium"
                    @click="showColumnMenu = !showColumnMenu">
              Toggle Columns
              <ChevronDown class="w-4 h-4 text-gray-500"
                           :class="showColumnMenu ? 'rotate-180' : ''"/>
            </button>
            <div v-if="showColumnMenu"
                 class="absolute max-w-[85vw] w-full flex flex-col gap-1 z-20 pl-4 pr-4 py-4 bg-white border border-gray-300">
              <p class="text-sm">Select which columns to display:</p>
              <div class="flex gap-2 font-medium text-sm">
                <button type="button"
                        class="w-full border border-gray-300 hover:bg-gray-100 rounded pl-2 pr-2 py-1"
                        @click="selectAll">
                  Select All
                </button>
                <button type="button"
                        class="w-full border border-gray-300 hover:bg-gray-100 rounded pl-2 pr-2 py-1"
                        @click="resetColumns">
                  Clear All
                </button>
              </div>
              <label v-for="col in columns"
                     :key="col.key">
                <input type="checkbox"
                       class="accent-emerald-600"
                       :value="col.key"
                       v-model="visibleKeys"/>
                {{ col.label }}
              </label>
            </div>
          </div>
          <!-- columns END -->
        </div>
        <!-- toolbar END -->
          </div>
        <!-- header END -->
        <!-- table START -->
        <div class="overflow-auto flex-1 min-h-0">
          <table class="min-w-max w-full text-sm text-left">
            <thead class="sticky top-0 z-10 bg-gray-100 text-gray-700">
              <tr>
                <th v-for="col in visibleColumns"
                    :key="col.key"
                    :style="{ width: columnWidths[col.key] }"
                    class="px-4 py-2 whitespace-nowrap">
                  <button type="button"
                          class="flex items-center gap-1 hover:text-gray-900"
                          @click="toggleSort(col.key)">
                    {{ col.label }}
                    <ArrowUp v-if="sortColumn === col.key && sortDirection === 'asc'"
                             class="w-3 h-3 text-gray-900"/>
                    <ArrowDown v-else-if="sortColumn === col.key" class="w-3 h-3"
                               :class="sortColumn === col.key ? 'text-gray-900' : 'text-gray-400'"/>
                    <ArrowUpDown v-else class="w-3 h-3 text-gray-400"/>
                  </button>
                </th>
              </tr>
            <tr>
              <th v-for="col in visibleColumns"
                  :key="col.key"
                  class="px-4 pb-2">
                <div class="relative">
                  <input v-model="filters[col.key]"
                         class="w-full bg-gray-50 border border-gray-300 rounded pl-7 pr-2 py-1 text-sm font-normal">
                  <button type="button"
                          class="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Search class="w-3.5 h-3.5"/>
                  </button>
                </div>
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="student in pagedStudents"
                  :key="student.id">
                <td v-for="col in visibleColumns"
                    :key="col.key"
                    class="px-4 py-2 whitespace-nowrap">
                  {{ student[col.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--table END -->
        <!-- footer START -->
        <div class="flex flex-wrap items-center justify-between gap-3 shrink-0 px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
          <span>Showing {{ rangeStart }}-{{ rangeEnd }} of {{ sortedStudents.length }}</span>
          <div class="flex flex-wrap items-center gap-2">
            <label class="text-gray-500"> Rows per page </label>
            <select v-model.number="pageSize"
                    class="border border-gray-300 rounded bg-white px-2 py-1">
              <option v-for="size in pageSizeOptions"
                      :key="size"
                      :value="size">
                {{ size }}
              </option>
            </select>
            <button type="button"
                    :disabled="currentPage === 1"
                    @click="prevPage"
                    class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
              Prev
            </button>
            <span class="px-1">Page {{ currentPage }} of {{ totalPages }}</span>
            <button type="button"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                    class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white">
              Next
            </button>
          </div>
        </div>
        <!-- footer END-->
      </div>
    </div>
  </AppLayout>
</template>
