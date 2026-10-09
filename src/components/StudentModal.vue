<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseSelect from './BaseSelect.vue'
import { useStudentsStore, YEAR_LABELS, ACADEMIC_YEARS } from '../stores/students'

const props = defineProps({
  student: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved', 'remove'])

const EMAIL_DOMAIN = '@school.edu'
const PHOTO_SIZE = 300
const INPUT_CLASS = 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-700'
const READONLY_CLASS = 'w-full px-3 py-2 text-gray-600 bg-gray-100 border border-gray-200 rounded'
const SECONDARY_BUTTON_CLASS = 'px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100'

const store = useStudentsStore()
const { sections, sectionsById } = storeToRefs(store)

const isEditing = props.student !== null
const source = props.student ?? {
  id: '',
  name: '',
  email: '',
  sectionId: null,
  academicYear: ACADEMIC_YEARS[0],
  course: '',
  yearLevel: '',
}

const form = reactive({
  id: source.id,
  name: source.name,
  emailName: source.email.split('@')[0],
  sectionId: source.sectionId,
  academicYear: source.academicYear,
  course: source.course,
  yearLevel: source.yearLevel,
})
const errors = reactive({})
const photo = ref(props.student?.photo ?? null)
const fileInput = ref(null)

function startsIrregular() {
  if (!isEditing) return false
  const section = sectionsById.value.get(props.student.sectionId)
  return !section
      || props.student.course !== section.courseName
      || props.student.yearLevel !== YEAR_LABELS[section.yearLevel - 1]
}

const irregular = ref(startsIrregular())

const toOptions = (values) => values.map((value) => ({ value, label: value }))
const academicYearOptions = toOptions(ACADEMIC_YEARS)
const yearOptions = toOptions(YEAR_LABELS)
const courseOptions = computed(() => toOptions([...new Set(sections.value.map((s) => s.courseName))]))
const sectionOptions = computed(() => sections.value.map((s) => ({ value: s.id, label: s.label })))

const selectedSection = computed(() => sectionsById.value.get(form.sectionId))
const sectionCourse = computed(() => selectedSection.value ? selectedSection.value.courseName : '')
const sectionYear = computed(() => selectedSection.value ? YEAR_LABELS[selectedSection.value.yearLevel - 1] : '')
const course = computed(() => irregular.value ? form.course : sectionCourse.value)
const yearLevel = computed(() => irregular.value ? form.yearLevel : sectionYear.value)
const email = computed(() => `${form.emailName.trim().toLowerCase()}${EMAIL_DOMAIN}`)

watch(irregular, (on) => {
  if (!on) return
  form.course = sectionCourse.value
  form.yearLevel = sectionYear.value
})

function borderClass(key) {
  return errors[key] ? 'border-red-500' : 'border-gray-300'
}

async function resizeImage(file) {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = PHOTO_SIZE
  canvas.height = PHOTO_SIZE
  canvas.getContext('2d').drawImage(
      bitmap,
      (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side,
      0, 0, PHOTO_SIZE, PHOTO_SIZE
  )
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.8)
}

async function handlePhotoChange(event) {
  const [file] = event.target.files
  event.target.value = ''
  delete errors.photo
  if (!file) return
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
  } else if (store.students.some((s) => s.email === email.value && s.id !== props.student?.id)) {
    errors.email = 'That email is already in use.'
  }
  if (form.sectionId === null) errors.sectionId = 'Choose a section.'
  if (irregular.value && !form.course) errors.course = 'Choose a course.'
  if (irregular.value && !form.yearLevel) errors.yearLevel = 'Choose a year level.'

  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const fields = {
    name: form.name.trim(),
    email: email.value,
    sectionId: form.sectionId,
    academicYear: form.academicYear,
    course: course.value,
    yearLevel: yearLevel.value,
    photo: photo.value,
  }
  if (isEditing) {
    store.updateStudent(props.student.id, fields)
    emit('saved')
  } else if (store.addStudent({ id: form.id, ...fields })) {
    emit('saved')
  } else {
    errors.id = 'That student number already exists.'
  }
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/45"
       @click.self="emit('close')">
    <form class="w-full max-w-2xl max-h-full overflow-y-auto bg-white rounded shadow-lg"
          @submit.prevent="handleSubmit">
      <!-- header START -->
      <div class="flex items-center justify-between px-4 py-2 text-white bg-emerald-700">
        <h2 class="text-sm font-medium uppercase">{{ isEditing ? 'Manage Student' : 'Add Student' }}</h2>
        <button type="button"
                class="px-2 text-lg leading-none rounded hover:bg-emerald-900"
                aria-label="Close"
                @click="emit('close')">
          &times;
        </button>
      </div>
      <!-- header END -->

      <div class="flex flex-col text-sm sm:flex-row">
        <!-- fields START -->
        <div class="flex-1 min-w-0 p-4">
          <table class="w-full table-fixed">
            <tbody>
            <tr>
              <td class="w-36 pt-[15px] pr-3 font-medium align-top">NAME</td>
              <td class="py-1.5">
                <input v-model="form.name"
                       type="text"
                       :class="[INPUT_CLASS, borderClass('name')]">
                <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">STUDENT NUMBER</td>
              <td class="py-1.5">
                <input v-model.number="form.id"
                       type="text"
                       :disabled="isEditing"
                       :class="isEditing ? READONLY_CLASS : [INPUT_CLASS, borderClass('id')]">
                <p v-if="errors.id" class="mt-1 text-xs text-red-600">{{ errors.id }}</p>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">EMAIL</td>
              <td class="py-1.5">
                <div class="flex">
                  <input v-model="form.emailName"
                         type="text"
                         class="flex-1 min-w-0 px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-emerald-700"
                         :class="borderClass('email')">
                  <span class="flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r">
                    {{ EMAIL_DOMAIN }}
                  </span>
                </div>
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">ACADEMIC YEAR</td>
              <td class="py-1.5">
                <BaseSelect v-model="form.academicYear" :options="academicYearOptions"/>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">SECTION</td>
              <td class="py-1.5">
                <BaseSelect v-model="form.sectionId"
                            :options="sectionOptions"
                            :invalid="!!errors.sectionId"
                            placeholder="Choose a section"/>
                <p v-if="errors.sectionId" class="mt-1 text-xs text-red-600">{{ errors.sectionId }}</p>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">COURSE</td>
              <td class="py-1.5">
                <BaseSelect v-if="irregular"
                            v-model="form.course"
                            :options="courseOptions"
                            :invalid="!!errors.course"
                            placeholder="Choose a course"/>
                <div v-else :class="READONLY_CLASS">{{ course || '—' }}</div>
                <p v-if="errors.course" class="mt-1 text-xs text-red-600">{{ errors.course }}</p>
              </td>
            </tr>
            <tr>
              <td class="pt-[15px] pr-3 font-medium align-top">YEAR LEVEL</td>
              <td class="py-1.5">
                <BaseSelect v-if="irregular"
                            v-model="form.yearLevel"
                            :options="yearOptions"
                            :invalid="!!errors.yearLevel"
                            placeholder="Choose a year level"/>
                <div v-else :class="READONLY_CLASS">{{ yearLevel || '—' }}</div>
                <p v-if="errors.yearLevel" class="mt-1 text-xs text-red-600">{{ errors.yearLevel }}</p>
              </td>
            </tr>
            </tbody>
          </table>
          <label class="flex items-center gap-2 mt-2 text-gray-600">
            <input v-model="irregular" type="checkbox" class="accent-emerald-700">
            Irregular student (different course or year level from the section)
          </label>
        </div>
        <!-- fields END -->

        <!-- photo START -->
        <div class="flex flex-col items-center justify-center gap-3 p-4 border-t border-gray-200 shrink-0 sm:w-56 sm:border-t-0 sm:border-l">
          <img v-if="photo"
               :src="photo"
               alt=""
               class="object-cover rounded h-36 w-36">
          <div v-else
               class="flex items-center justify-center text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded h-36 w-36">
            No photo
          </div>
          <p class="text-xs text-gray-500">Student picture</p>
          <input ref="fileInput"
                 type="file"
                 accept="image/*"
                 class="hidden"
                 @change="handlePhotoChange">
          <div class="flex gap-2 text-xs">
            <button type="button" :class="SECONDARY_BUTTON_CLASS" @click="fileInput.click()">
              Upload photo
            </button>
            <button v-if="photo" type="button" :class="SECONDARY_BUTTON_CLASS" @click="photo = null">
              Clear
            </button>
          </div>
          <p v-if="errors.photo" class="text-xs text-center text-red-600">{{ errors.photo }}</p>
        </div>
        <!-- photo END -->
      </div>

      <!-- footer START -->
      <div class="flex justify-end gap-2 px-4 py-3 text-sm border-t border-gray-200">
        <button v-if="isEditing"
                type="button"
                class="px-3 py-1 text-red-700 bg-white border border-red-200 rounded hover:bg-red-100 hover:text-red-900"
                @click="emit('remove')">
          Remove
        </button>
        <button type="button" :class="SECONDARY_BUTTON_CLASS" @click="emit('close')">
          Cancel
        </button>
        <button type="submit"
                class="px-3 py-1 font-medium text-white rounded bg-emerald-700 hover:bg-emerald-900">
          {{ isEditing ? 'Save Changes' : 'Add Student' }}
        </button>
      </div>
      <!-- footer END -->
    </form>
  </div>
</template>