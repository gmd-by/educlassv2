<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'

const emit = defineEmits(['close', 'saved'])
const store = useStudentsStore()
const { sections } = storeToRefs(store)

const EMAIL_DOMAIN = '@school.edu'
const academicYears = ['2026-2027', '2025-2026', '2024-2025', '2023-2024']
const yearLabels = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const courseNames = computed(() => [...new Set(sections.value.map((s) => s.courseName))])

const form = reactive({
  id: '',
  academicYear: academicYears[0],
  name: '',
  emailName: '',
  sectionId: null,
  course: '',
  yearLevel: '',
})
const irregular = ref(false)
const errors = reactive({})

const selectedSection = computed(() => sections.value.find((s) => s.id === form.sectionId))
const sectionCourse = computed(() => selectedSection.value ? selectedSection.value.courseName : '')
const sectionYear = computed(() => selectedSection.value ? yearLabels[selectedSection.value.yearLevel - 1] : '')
const course = computed(() => irregular.value ? form.course : sectionCourse.value)
const yearLevel = computed(() => irregular.value ? form.yearLevel : sectionYear.value)
const email = computed(() => `${form.emailName.trim().toLowerCase()}${EMAIL_DOMAIN}`)

watch(irregular, (on) => {
  if (on) {
    form.course = sectionCourse.value
    form.yearLevel = sectionYear.value
  }
})

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!Number.isInteger(form.id) || form.id <= 0) {
    errors.id = 'Enter a student number.'
  } else if (store.students.some((s) => s.id === form.id)) {
    errors.id = 'That student number already exists.'
  }
  if (!form.name.trim()) errors.name = 'Enter a full name.'

  const emailName = form.emailName.trim()
  if (!emailName) {
    errors.email = 'Enter the email name.'
  } else if (/[\s@]/.test(emailName)) {
    errors.email = 'Enter only the part before @.'
  } else if (store.students.some((s) => s.email === email.value)) {
    errors.email = 'That email is already in use.'
  }
  if (form.sectionId === null) errors.sectionId = 'Choose a section.'
  if (irregular.value) {
    if (!form.course) errors.course = 'Choose a course.'
    if (!form.yearLevel) errors.yearLevel = 'Choose a year level.'
  }

  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const added = store.addStudent({
    id: form.id,
    sectionId: form.sectionId,
    name: form.name.trim(),
    email: email.value,
    academicYear: form.academicYear,
    yearLevel: yearLevel.value,
    course: course.value,
  })
  if (added) {
    emit('saved')
  } else {
    errors.id = 'That student number already exists.'
  }
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center bg-black/45 p-4"
       @click.self="emit('close')">
    <form class="w-full max-w-md bg-white rounded shadow-lg overflow-hidden"
          @submit.prevent="handleSubmit">
      <div class="flex items-center justify-between bg-emerald-700 text-white px-4 py-2">
        <h2 class="font-medium text-sm uppercase">Add Student</h2>
        <button type="button"
                class="text-lg leading-none hover:text-emerald-100"
                @click="emit('close')">
          &times;
        </button>
      </div>

      <div class="grid grid-cols-2 gap-x-3 gap-y-3 p-4 text-sm">
        <div>
          <label class="block text-gray-500 mb-1">Student Number</label>
          <input v-model.number="form.id"
                 type="text"
                 class="w-full border rounded px-3 py-2"
                 :class="errors.id ? 'border-red-500' : 'border-gray-300'">
          <p v-if="errors.id" class="text-xs text-red-600 mt-1">{{ errors.id }}</p>
        </div>
        <div>
          <label class="block text-gray-500 mb-1">Academic Year</label>
          <select v-model="form.academicYear"
                  class="w-full border border-gray-300 rounded bg-white px-3 py-2">
            <option v-for="year in academicYears"
                    :key="year"
                    :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="col-span-2">
          <label class="block text-gray-500 mb-1">Full Name</label>
          <input v-model="form.name"
                 type="text"
                 class="w-full border rounded px-3 py-2"
                 :class="errors.name ? 'border-red-500' : 'border-gray-300'">
          <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <div class="col-span-2">
          <label class="block text-gray-500 mb-1">Email</label>
          <div class="flex">
            <input v-model="form.emailName"
                   type="text"
                   placeholder="name"
                   class="min-w-0 flex-1 border rounded-l px-3 py-2"
                   :class="errors.email ? 'border-red-500' : 'border-gray-300'">
            <span class="flex items-center border border-l-0 border-gray-300 rounded-r bg-gray-100 px-3 text-gray-500">
              {{ EMAIL_DOMAIN }}
            </span>
          </div>
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
        </div>

        <div class="col-span-2">
          <label class="block text-gray-500 mb-1">Section</label>
          <select v-model="form.sectionId"
                  class="w-full border rounded bg-white px-3 py-2"
                  :class="errors.sectionId ? 'border-red-500' : 'border-gray-300'">
            <option :value="null" disabled>Choose a section</option>
            <option v-for="section in sections"
                    :key="section.id"
                    :value="section.id">
              {{ section.course }} {{ section.yearLevel }} - {{ section.name }}
            </option>
          </select>
          <p v-if="errors.sectionId" class="text-xs text-red-600 mt-1">{{ errors.sectionId }}</p>
        </div>

        <div>
          <label class="col-span-2 flex items-center gap-2 text-gray-600">
            <input v-model="irregular"
                   type="checkbox"
                   class="accent-emerald-600">
            Irregular student (different course or year level from the section)
          </label>

          <div>
            <label class="block text-gray-500 mb-1">Course</label>
            <select v-if="irregular"
                    v-model="form.course"
                    class="w-full border rounded bg-white px-3 py-2"
                    :class="errors.course ? 'border-red-500' : 'border-gray-300'">
              <option value="" disabled>Choose a course</option>
              <option v-for="name in courseNames"
                      :key="name"
                      :value="name">
                {{ name }}
              </option>
            </select>
            <div v-else
                 class="w-full border border-gray-200 rounded bg-gray-100 px-3 py-2 text-gray-600">
              {{ course || '—' }}
            </div>
            <p v-if="errors.course" class="text-xs text-red-600 mt-1">{{ errors.course }}</p>
          </div>
          <div>
            <label class="block text-gray-500 mb-1">Year Level</label>
            <select v-if="irregular"
                    v-model="form.yearLevel"
                    class="w-full border rounded bg-white px-3 py-2"
                    :class="errors.yearLevel ? 'border-red-500' : 'border-gray-300'">
              <option value="" disabled>Choose a year level</option>
              <option v-for="level in yearLabels"
                      :key="level"
                      :value="level">
                {{ level }}
              </option>
            </select>
            <div v-else
                 class="w-full border border-gray-200 rounded bg-gray-100 px-3 py-2 text-gray-600">
              {{ yearLevel || '—' }}
            </div>
            <p v-if="errors.yearLevel" class="text-xs text-red-600 mt-1">{{ errors.yearLevel }}</p>
          </div>git
        </div>
      </div>

      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 text-sm">
        <button type="button"
                class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50"
                @click="emit('close')">
          Cancel
        </button>
        <button type="submit"
                class="bg-emerald-700 text-white font-medium rounded px-3 py-1 hover:bg-emerald-900">
          Add Student
        </button>
      </div>
    </form>
  </div>
</template>