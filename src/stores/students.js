import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStudentsStore = defineStore('students', () => {
    const sections = ref([
        { id: 1, course: 'BSCS', yearLevel: 2, name: 'Orion Horizons' },
        { id: 2, course: 'BSIT', yearLevel: 3, name: 'Lyra Scuola' },
        { id: 3, course: 'BSAS', yearLevel: 4, name: 'Admire Vega'},
    ])

    const students = ref([
        { id: 101, sectionId: 2, name: 'Ana Cruz', email: 'ana.cruz@school.edu',
            academicYear:'2025-2026', yearLevel: '2nd Year', course: 'BS Computer Science'},
        { id: 102, sectionId: 3, name: 'Ben Reyes', email: 'ben.reyes@school.edu',
            academicYear:'2024-2025', yearLevel: '3rd Year', course: 'BS Information Technology'},
        { id: 103, sectionId: 2, name: 'Juan Cruz', email: 'juan.cruz@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Arts and Sciences'},
        { id: 104, sectionId: 4, name: 'Jose Rizal', email: 'jose.rizal@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Arts and Sciences'},
        { id: 105, sectionId: 2, name: 'Lea Gutierrez', email: 'lea.gutierrez@school.edu',
            academicYear:'2023-2024', yearLevel: '1st Year', course: 'BS Arts and Sciences'},
        { id: 106, sectionId: 1, name: 'Roman Alfonso', email: 'roman.alfonso@school.edu',
            academicYear:'2023-2024', yearLevel: '1st Year', course: 'BS Criminology'},
        { id: 107, sectionId: 2, name: 'Leonardo Davinsi', email: 'leo.davinsi@school.edu',
            academicYear:'2023-2024', yearLevel: '2nd Year', course: 'BS Arts and Sciences'},
        { id: 108, sectionId: 3, name: 'Roman Aguilar', email: 'roman.aguilar@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Accountancy'},
        { id: 109, sectionId: 2, name: 'Linda Gonzales', email: 'linda.gonzales@school.edu',
            academicYear:'2023-2024', yearLevel: '2nd Year', course: 'BS Information Systems'},
        { id: 110, sectionId: 3, name: 'Mary Anne Abelinda', email: 'maryanne.abelinda@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Nursing'},
        { id: 111, sectionId: 3, name: 'Jeanne Evangelista', email: 'jeanne.evangelista@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Computer Science'},
        { id: 112, sectionId: 4, name: 'Marco Polo', email: 'marco.polo@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Criminology'},
        { id: 113, sectionId: 4, name: 'Angelica Gonzales', email: 'angel.gonzales@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Civil Engineering'},
    ])

    const selectedSectionId = ref(null)

    const sectionTitle = computed(() => {
        if (selectedSectionId.value === null) return 'All Students'
        const section = sections.value.find((s) => s.id === selectedSectionId.value)
        return `${section.course} ${section.yearLevel} - ${section.name}`
    })

    return { sections, students, selectedSectionId, sectionTitle }
})