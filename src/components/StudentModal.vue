<script setup>
import BaseSelect from './BaseSelect.vue'
import { reactive, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'

const props = defineProps({
  student: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved', 'remove'])
const store = useStudentsStore()
const { sections } = storeToRefs(store)

const isEditing = props.student !== null

const photo = ref(props.student ? props.student.photo ?? null : null)
const fileInput = ref(null)
const PHOTO_SIZE = 300

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = PHOTO_SIZE
      canvas.height = PHOTO_SIZE
      canvas.getContext('2d').drawImage(
          img,
          (img.width - side) / 2, (img.height - side) / 2, side, side,
          0, 0, PHOTO_SIZE, PHOTO_SIZE
      )
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable image'))
    }
    img.src = url
  })
}

async function handlePhotoChange(event) {
  const file = event.target.files[0]
  event.target.value = ''
  if (!file) return
  delete errors.photo
  if (!file.type.startsWith('image/')) {
    errors.photo = 'Choose an image file.'
    return
  }
  try {
    photo.value = await resizeImage(file)
  } catch {
    errors.photo = "Couldn't read that image."
  }
}

function clearPhoto() {
  photo.value = null
}

const EMAIL_DOMAIN = '@school.edu'
const academicYears = ['2026-2027', '2025-2026', '2024-2025', '2023-2024']
const yearLabels = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const courseNames = computed(() => [...new Set(sections.value.map((s) => s.courseName))])

const academicYearOptions = academicYears.map((year) => ({ value: year, label: year }))
const yearOptions = yearLabels.map((level) => ({ value: level, label: level }))
const courseOptions = computed(() => courseNames.value.map((name) => ({ value: name, label: name })))
const sectionOptions = computed(() => sections.value.map((section) => ({
  value: section.id,
  label: `${section.course} ${section.yearLevel} - ${section.name}`,
})))

const form = reactive({
  id: props.student ? props.student.id : '',
  academicYear: props.student ? props.student.academicYear : academicYears[0],
  name: props.student ? props.student.name : '',
  emailName: props.student ? props.student.email.split('@')[0] : '',
  sectionId: props.student ? props.student.sectionId : null,
  course: props.student ? props.student.course : '',
  yearLevel: props.student ? props.student.yearLevel : '',
})

function startsIrregular() {
  if (!props.student) return false
  const section = sections.value.find((s) => s.id === props.student.sectionId)
  if (!section) return true
  return props.student.course !== section.courseName
      || props.student.yearLevel !== yearLabels[section.yearLevel - 1]
}

const irregular = ref(startsIrregular())
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

  if (!isEditing) {
    if (!Number.isInteger(form.id) || form.id <= 0) {
      errors.id = 'Enter a student number.'
    } else if (store.students.some((s) => s.id === form.id)) {
      errors.id = 'That student number already exists.'
    }
  }
  if (!form.name.trim()) errors.name = 'Enter a full name.'

  const emailName = form.emailName.trim()
  if (!emailName) {
    errors.email = 'Enter the email name.'
  } else if (/[\s@]/.test(emailName)) {
    errors.email = 'Enter only the part before @.'
  } else if (store.students.some((s) => s.email === email.value && (!isEditing || s.id !== props.student.id))) {
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
  const fields = {
    sectionId: form.sectionId,
    name: form.name.trim(),
    email: email.value,
    academicYear: form.academicYear,
    yearLevel: yearLevel.value,
    course: course.value,
    photo: photo.value,
  }
  if (isEditing) {
    store.updateStudent(props.student.id, fields)
    emit('saved')
    return
  }
  const added = store.addStudent({ id: form.id, ...fields })
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
    <form class="w-full max-w-2xl max-h-full overflow-y-auto bg-white rounded shadow-lg"
          @submit.prevent="handleSubmit">
      <div class="flex items-center justify-between bg-emerald-700 text-white px-4 py-2">
        <h2 class="font-medium text-sm uppercase">{{ isEditing ? 'Manage Student' : 'Add Student' }}</h2>
        <button type="button"
                class="text-lg leading-none hover:text-emerald-100"
                @click="emit('close')">
          &times;
        </button>
      </div>

      <div class="flex flex-col sm:flex-row text-sm">
        <div class="flex-1 min-w-0 p-4">
          <table class="w-full table-fixed">
            <tbody>
            <tr>
              <td class="w-36 py-3 pr-3 align-top font-medium">NAME</td>
              <td class="py-1.5">
                <input v-model="form.name"
                       type="text"
                       class="w-full border rounded px-3 py-2"
                       :class="errors.name ? 'border-red-500' : 'border-gray-300'">
                <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">STUDENT NUMBER</td>
              <td class="py-1.5">
                <input v-model.number="form.id"
                       type="text"
                       :disabled="isEditing"
                       class="w-full border rounded px-3 py-2"
                       :class="isEditing ? 'bg-gray-100 text-gray-600 border-gray-200'
                                           : errors.id ? 'border-red-500' : 'border-gray-300'">
                <p v-if="errors.id" class="text-xs text-red-600 mt-1">{{ errors.id }}</p>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">EMAIL</td>
              <td class="py-1.5">
                <div class="flex">
                  <input v-model="form.emailName"
                         type="text"
                         class="min-w-0 flex-1 border rounded-l px-3 py-2"
                         :class="errors.email ? 'border-red-500' : 'border-gray-300'">
                  <span class="flex items-center border border-l-0 border-gray-300 rounded-r bg-gray-100 px-3 text-gray-500">
                      {{ EMAIL_DOMAIN }}
                    </span>
                </div>
                <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">ACADEMIC YEAR</td>
              <td class="py-1.5">
                <BaseSelect v-model="form.academicYear" :options="academicYearOptions"/>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">SECTION</td>
              <td class="py-1.5">
                <BaseSelect v-model="form.sectionId"
                            :options="sectionOptions"
                            placeholder="Choose a section"
                            :invalid="!!errors.sectionId"/>
                <p v-if="errors.sectionId" class="text-xs text-red-600 mt-1">{{ errors.sectionId }}</p>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">COURSE</td>
              <td class="py-1.5">
                <BaseSelect v-if="irregular"
                            v-model="form.course"
                            :options="courseOptions"
                            placeholder="Choose a course"
                            :invalid="!!errors.course"/>
                <div v-else
                     class="w-full border border-gray-200 rounded bg-gray-100 px-3 py-2 text-gray-600">
                  {{ course || '—' }}
                </div>
                <p v-if="errors.course" class="text-xs text-red-600 mt-1">{{ errors.course }}</p>
              </td>
            </tr>
            <tr>
              <td class="py-3 pr-3 align-top font-medium">YEAR LEVEL</td>
              <td class="py-1.5">
                <BaseSelect v-if="irregular"
                            v-model="form.yearLevel"
                            :options="yearOptions"
                            placeholder="Choose a year level"
                            :invalid="!!errors.yearLevel"/>
                <div v-else
                     class="w-full border border-gray-200 rounded bg-gray-100 px-3 py-2 text-gray-600">
                  {{ yearLevel || '—' }}
                </div>
                <p v-if="errors.yearLevel" class="text-xs text-red-600 mt-1">{{ errors.yearLevel }}</p>
              </td>
            </tr>
            </tbody>
          </table>
          <label class="flex items-center gap-2 mt-2 text-gray-600">
            <input v-model="irregular"
                   type="checkbox"
                   class="accent-emerald-600">
            Irregular student (different course or year level from the section)
          </label>
        </div>

        <div class="shrink-0 flex flex-col items-center justify-center gap-3 p-4 border-t border-gray-200 sm:border-t-0 sm:border-l sm:w-56">
          <img v-if="photo"
               :src="photo"
               alt=""
               class="h-36 w-36 rounded object-cover">
          <div v-else
               class="h-36 w-36 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
            No photo
          </div>
          <input ref="fileInput"
                 type="file"
                 accept="image/*"
                 class="hidden"
                 @change="handlePhotoChange">
          <div class="flex gap-2 text-xs">
            <button type="button"
                    class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50"
                    @click="fileInput.click()">
              Upload photo
            </button>
            <button v-if="photo"
                    type="button"
                    class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50"
                    @click="clearPhoto">
              Clear
            </button>
          </div>
          <p v-if="errors.photo" class="text-xs text-red-600 text-center">{{ errors.photo }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 text-sm">
        <button v-if="isEditing"
                type="button"
                class="border border-red-200 rounded bg-white px-3 py-1 text-red-600 hover:bg-red-50"
                @click="emit('remove')">
          Remove
        </button>
        <button type="button"
                class="border border-gray-300 rounded bg-white px-3 py-1 hover:bg-gray-50"
                @click="emit('close')">
          Cancel
        </button>
        <button type="submit"
                class="bg-emerald-700 text-white font-medium rounded px-3 py-1 hover:bg-emerald-900">
          {{ isEditing ? 'Save Changes' : 'Add Student' }}
        </button>
      </div>
    </form>
  </div>
</template>