<template>
    <v-container class="py-10">
        <v-card class="mx-auto text-center pa-8 rounded-xl" max-width="500" elevation="4">
            <div v-if="loading">
                <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
                <p>Fetching your reservation details...</p>
            </div>

            <div v-else-if="reservation">
                <v-icon color="success" size="80" class="mb-4">mdi-calendar-check</v-icon>
                <h2 class="text-h4 font-weight-bold mb-2">Reservation Details</h2>

                <v-divider class="my-6"></v-divider>

                <div class="text-left mb-6">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <span class="text-subtitle-1 text-medium-emphasis">Status:</span>
                        <v-chip :color="statusColor" variant="elevated" class="text-uppercase font-weight-bold">
                            {{ reservation.progress || 'Pending' }}
                        </v-chip>
                    </div>

                    <div class="d-flex justify-space-between mb-2">
                        <span class="text-medium-emphasis">Tracking ID:</span>
                        <span class="font-weight-medium">{{ trackingId }}</span>
                    </div>

                    <div class="d-flex justify-space-between mb-2">
                        <span class="text-medium-emphasis">Client Name:</span>
                        <span class="font-weight-medium">{{ reservation.name }}</span>
                    </div>

                    <div class="d-flex justify-space-between">
                        <span class="text-medium-emphasis">Event Date:</span>
                        <span class="font-weight-medium">{{ reservation.event_date }}</span>
                    </div>

                    <div class="d-flex justify-space-between">
                        <span class="text-medium-emphasis">Event Time:</span>
                        <span class="font-weight-medium">{{ reservation.event_time }}</span>
                    </div>
                </div>

                <v-btn to="/" block color="primary" variant="tonal" size="large" rounded="lg">
                    Back to Home
                </v-btn>
            </div>

            <div v-else>
                <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
                <h3 class="text-h5">Reservation Not Found</h3>
                <p class="text-body-2 text-medium-emphasis mt-2">We couldn't find a record for that ID.</p>
                <v-btn to="/reservation" variant="text" class="mt-4">Try Booking Again</v-btn>
            </div>
            <v-card-subtitle class="mt-6 text-medium-emphasis text-wrap">
                We will contact you through your email or phone number shortly to confirm your reservation. If you have
                any questions, feel free to reach out to us directly.
            </v-card-subtitle>
        </v-card>
    </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

const route = useRoute()
const trackingId = route.params.id
const reservation = ref(null)
const loading = ref(true)

const statusColor = computed(() => {
    const status = reservation.value?.progress?.toLowerCase()
    switch (status) {
        case 'confirmed': return 'success'
        case 'cancelled': return 'error'
        case 'processing': return 'info'
        default: return 'warning' // for 'pending'
    }
})

onMounted(async () => {
    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.LOCAL_STRAPI_URL
        // Strapi filter syntax: filters[field][$eq]=value
        const response = await fetch(`${BASE_URL}/api/reservations?filters[url][$eq]=${trackingId}`)
        const result = await response.json()

        // Strapi returns an array in result.data
        if (result.data && result.data.length > 0) {
            reservation.value = result.data[0].attributes || result.data[0]
        }
    } catch (error) {
        console.error('Fetch error:', error)
    } finally {
        loading.value = false
    }
})
</script>