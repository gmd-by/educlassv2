import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useStudentsStore = defineStore('students', () => {
    const sections = ref([
        { id: 1, course: 'BSCS', courseName: 'BS Computer Science', yearLevel: 2, name: 'Orion Horizons' },
        { id: 2, course: 'BSIT', courseName: 'BS Information Technology', yearLevel: 3, name: 'Lyra Scuola' },
        { id: 3, course: 'BSAS', courseName: 'BS Arts and Sciences', yearLevel: 4, name: 'Admire Vega' },
        { id: 4, course: 'BSCrim', courseName: 'BS Criminology', yearLevel: 1, name: 'Draco Heights' },
        { id: 5, course: 'BSA', courseName: 'BS Accountancy', yearLevel: 3, name: 'Cygnus Hall' },
        { id: 6, course: 'BSIS', courseName: 'BS Information Systems', yearLevel: 2, name: 'Aquila Grove' },
        { id: 7, course: 'BSN', courseName: 'BS Nursing', yearLevel: 3, name: 'Perseus Ridge' },
        { id: 8, course: 'BSCE', courseName: 'BS Civil Engineering', yearLevel: 4, name: 'Pegasus Bay' },
    ])

    const seedStudents = [
        { id: 101, sectionId: 1, name: 'Ana Cruz', email: 'ana.cruz@school.edu',
            academicYear:'2025-2026', yearLevel: '2nd Year', course: 'BS Computer Science'},
        { id: 102, sectionId: 2, name: 'Ben Reyes', email: 'ben.reyes@school.edu',
            academicYear:'2024-2025', yearLevel: '3rd Year', course: 'BS Information Technology'},
        { id: 103, sectionId: 3, name: 'Juan Cruz', email: 'juan.cruz@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Arts and Sciences'},
        { id: 104, sectionId: 3, name: 'Jose Rizal', email: 'jose.rizal@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Arts and Sciences'},
        { id: 105, sectionId: 3, name: 'Lea Gutierrez', email: 'lea.gutierrez@school.edu',
            academicYear:'2023-2024', yearLevel: '1st Year', course: 'BS Arts and Sciences'},
        { id: 106, sectionId: 4, name: 'Roman Alfonso', email: 'roman.alfonso@school.edu',
            academicYear:'2023-2024', yearLevel: '1st Year', course: 'BS Criminology'},
        { id: 107, sectionId: 3, name: 'Leonardo Davinsi', email: 'leo.davinsi@school.edu',
            academicYear:'2023-2024', yearLevel: '2nd Year', course: 'BS Arts and Sciences'},
        { id: 108, sectionId: 5, name: 'Roman Aguilar', email: 'roman.aguilar@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Accountancy'},
        { id: 109, sectionId: 6, name: 'Linda Gonzales', email: 'linda.gonzales@school.edu',
            academicYear:'2023-2024', yearLevel: '2nd Year', course: 'BS Information Systems'},
        { id: 110, sectionId: 7, name: 'Mary Anne Abelinda', email: 'maryanne.abelinda@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Nursing'},
        { id: 111, sectionId: 1, name: 'Jeanne Evangelista', email: 'jeanne.evangelista@school.edu',
            academicYear:'2023-2024', yearLevel: '3rd Year', course: 'BS Computer Science'},
        { id: 112, sectionId: 4, name: 'Marco Polo', email: 'marco.polo@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Criminology'},
        { id: 113, sectionId: 8, name: 'Angelica Gonzales', email: 'angel.gonzales@school.edu',
            academicYear:'2023-2024', yearLevel: '4th Year', course: 'BS Civil Engineering'},
    ]
        const STORAGE_KEY = 'educlass-students'
        function loadStudents() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : structuredClone(seedStudents)
        } catch {
            return structuredClone(seedStudents)
        }
    }
    const students = ref(loadStudents())
    watch(students, (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        } catch {
            console.warn('Could not save students: browser storage is full.')
        }
    }, { deep: true })

    const selectedSectionId = ref(null)

    const sectionTitle = computed(() => {
        if (selectedSectionId.value === null) return 'All Students'
        const section = sections.value.find((s) => s.id === selectedSectionId.value)
        return `${section.course} ${section.yearLevel} - ${section.name}`
    })

    function addStudent(student) {
        if (students.value.some((s) => s.id === student.id)) return false
        students.value.push(student)
        return true
    }

    function removeStudent(id) {
        students.value = students.value.filter((s) => s.id !== id)
    }

    function updateStudent(id, changes) {
        const index = students.value.findIndex((s) => s.id === id)
        if (index === -1) return false
        students.value[index] = { ...students.value[index], ...changes, id }
        return true
    }

    return { sections, students, selectedSectionId, sectionTitle, addStudent, removeStudent, updateStudent }
})