import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAnnouncementStore = defineStore('announcements', () => {
    const posts = ref([
        {
            id: 1, title: 'Midterm Schedule Released', author: 'Registrar Office', date: 'Oct 3, 2026',
            body: 'Midterm exams will run from October 15 to 19. Check your department for the full schedule.',
            image: '/news1.webp'},
        { id: 2, title: 'Library Extended Hours', author: 'Library Staff', date: 'Sep 30, 2026',
            body: 'The library will stay open until 10 PM on weekdays for the rest of the semester.',
            image: '/news2.webp'},
        { id: 3, title: 'Enrollment for Next Term Opens Soon', author: 'Registrar Office', date: 'Sep 28, 2026',
            body: 'Enrollment slots for the Educlass University open November 3-6, 2026. Make sure you records are updated beforehand.' },

    ])
    return { posts }
})