<script setup>
defineProps({
  student: {
    type: Object,
    required: true,
  },
    })

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-gray-700">Student Info</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600">X</button>
      </div>

      <p>Email: {{ student.email }}</p>
      <p>Academic Year: {{ student.academicYear }}</p>
      <p>Year Level: {{ student.yearLevel }}</p>
      <p>Course: {{ student.course }}</p>
    </div>
  </div>
</template>