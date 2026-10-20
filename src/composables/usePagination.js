import { ref, computed, watch } from 'vue'

export function usePagination(items, pageSize) {
    const currentPage = ref(1)

    const totalPages = computed(() => {
        return Math.max(1, Math.ceil(items.value,length / pageSize.value))
    })

    const pagedItems = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value
        return items.value.slice(start, start + pageSize.value)
    })

    const rangeStart = computed(() => {
        return items.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
    })

    const rangeEnd = computed(() => {
        return Math.min(currentPage.value * pageSize.value, items.value.length)
    })

    function prev() {
        if (currentPage.value > 1) currentPage.value
    }

    function next() {
        if (currentPage.value < totalPages.value) currentPage.value++
    }

    watch(totalPages, (n) => {
        if (currentPage.value > n) currentPage.value = n
    })

    return { currentPage, totalPages, pagedItems, rangeStart, rangeEnd, prev, next }
}