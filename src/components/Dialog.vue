<template>
    <v-dialog v-model="props.showSuccess" max-width="500" persistent>
        <v-card class="rounded-xl pa-4 text-center">
            <v-card-text>
                <v-icon color="success" size="80" class="mb-4">mdi-check-circle-outline</v-icon>
                <h2 class="text-h4 font-weight-bold mb-2">Reservation Success!</h2>
                <p class="text-body-1 text-medium-emphasis mb-6">
                    Your booking has been received. We’ll reach out to you through your email or phone number shortly to
                    confirm.
                </p>

                <v-sheet border rounded="lg" class="pa-4 mb-6 bg-grey-lighten-4">
                    <div class="text-caption text-uppercase font-weight-bold mb-1">Tracking ID</div>
                    <div class="text-primary font-weight-bold text-break">{{ props.trackingId }}</div>
                </v-sheet>
            </v-card-text>

            <v-card-actions class="justify-center pb-6">
                <v-btn color="primary" variant="elevated" size="large" rounded="lg" class="px-10"
                    @click="$emit('track')">
                    Track My Status
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showErrorComputed" max-width="400">
        <v-card class="rounded-xl pa-4 text-center">
            <v-card-text>
                <v-icon color="error" size="64" class="mb-4">mdi-alert-circle-outline</v-icon>
                <h3 class="text-h5 font-weight-bold mb-2">Oops! Something went wrong</h3>
                <p class="text-body-2 text-medium-emphasis">
                    {{ props.errorMessage || 'We encountered a network error. Please try again or contact us directly.'
                    }}
                </p>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn variant="text" @click="$emit('close-error')">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    showSuccess: Boolean,
    showError: Boolean,
    trackingId: String,
    errorMessage: String
})

const emit = defineEmits(['track', 'close-error'])

// We use a computed setter to handle Vuetify's internal dialog closing (like clicking outside)
const showErrorComputed = computed({
    get: () => props.showError,
    set: (val) => { if (!val) emit('close-error') }
})
</script>