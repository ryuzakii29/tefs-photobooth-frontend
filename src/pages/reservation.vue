<template>
    <v-container>
        <v-card class="mx-auto" max-width="600" elevation="2">
            <v-card-title class="text-h5 pt-4 px-6">Make a Reservation</v-card-title>
            <v-card-subtitle class="px-6">Fill out the details below to book your event.</v-card-subtitle>

            <v-card-text>
                <v-form ref="formRef" v-model="isValid">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="formData.name" label="Full Name" variant="outlined"
                                density="comfortable" :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formData.email" label="Email" type="email" variant="outlined"
                                density="comfortable" :rules="[rules.required, rules.email]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formData.contact_number" label="Contact Number" type="text"
                                inputmode="numeric" variant="outlined" density="comfortable"
                                placeholder="Ex: 09123456789" :rules="[rules.required, rules.phone]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formData.event_date" label="Event Date" type="date"
                                variant="outlined" density="comfortable" prepend-inner-icon="mdi-calendar"
                                :rules="[rules.required]" :min="minDate"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="formData.event_time" label="Event Time" type="time"
                                variant="outlined" density="comfortable" prepend-inner-icon="mdi-clock-outline"
                                :rules="[rules.required, rules.futureTime]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field v-model="addrParts.house" label="House/Unit No." variant="outlined"
                                density="comfortable" :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="8">
                            <v-text-field v-model="addrParts.street" label="Street / Village / Brgy" variant="outlined"
                                density="comfortable" :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="addrParts.city" label="City / Municipality" variant="outlined"
                                density="comfortable" :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field v-model="addrParts.province" label="Province" variant="outlined"
                                density="comfortable" :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="formData.package" :items="availablePackages" item-title="name"
                                item-value="id" label="Select Package" variant="outlined" density="comfortable"
                                :rules="[rules.required]"></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="formData.notes" label="Special Requests / Notes (Optional)"
                                variant="outlined" rows="3" hide-details></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
                <v-btn variant="text" color="error" @click="clearForm" class="text-capitalize">
                    Clear Form
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn color="primary" variant="elevated" size="large" :disabled="!isValid" :loading="loading"
                    @click="triggerSubmit">
                    Submit Reservation
                </v-btn>
            </v-card-actions>
        </v-card>
        <ReservationStatusDialog :show-success="dialogs.success" :show-error="dialogs.error" :tracking-id="formData.url"
            :error-message="dialogs.message" @track="handleTrackNavigation" @close-error="dialogs.error = false" />
    </v-container>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue' // Added watch
import ReservationStatusDialog from '@/components/Dialog.vue'
import { usePackageStore, useUserStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { submitReservation } from '@/api'

const formRef = ref(null)
const isValid = ref(false)
const loading = ref(false)
const availablePackages = ref([])
const packageStore = usePackageStore()
const userStore = useUserStore()

const minDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })).toLocaleDateString('en-CA');

// Address parts for the UI
const addrParts = reactive({
    house: '',
    street: '',
    city: '',
    province: ''
})

// Watch address parts and combine them into formData.address
watch(addrParts, (newVal) => {
    const { house, street, city, province } = newVal
    // Concatenate into a standard string format
    formData.value.address = [house, street, city, province]
        .filter(part => part.trim() !== '') // Only include non-empty parts
        .join(', ')
}, { deep: true })

// Validation Rules
const rules = {
    required: value => !!value || 'This field is required.',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
    phone: value => {
        const str = String(value)
        return (str.length >= 11 && str.length <= 11) || 'Enter a valid contact number.'
    },
    futureTime: value => {
        if (!formData.value.event_date || !value) return true

        const today = new Date()
        const selectedDate = new Date(formData.value.event_date)
        const isToday = selectedDate.toDateString() === today.toDateString()

        if (isToday) {
            const [hours, minutes] = value.split(':')
            const selectedTime = new Date()
            selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
            return selectedTime > today || 'This time has already passed.'
        }
        return true
    }
}

const formData = ref({
    name: '',
    email: '',
    contact_number: '',
    event_date: '',
    event_time: '',
    package: null,
    notes: '',
    progress: 'pending',
    payment: false,
    url: '',
    address: ''
})

const router = useRouter()

const dialogs = reactive({
    success: false,
    error: false,
    message: ''
})

const handleTrackNavigation = () => {
    dialogs.success = false
    router.push(`/reservation/${formData.value.url}`)
}

const clearForm = () => {
    formRef.value.reset()
    addrParts.house = ''
    addrParts.street = ''
    addrParts.city = ''
    addrParts.province = ''

    if (userStore.selectedPackage) {
        formData.value.package = null
    }
}

const triggerSubmit = async function () {
    loading.value = true
    const response = await submitReservation(formData)
    if (response.ok) {
        dialogs.success = true;
        loading.value = false
    } else {
        const errorData = await response.json();
        dialogs.message = errorData.error?.message || "Server error";
        dialogs.error = true;
    }
}

onMounted(async () => {
    if (packageStore.packages.length <= 1) {
        await packageStore.fetchPackages()
    }
    availablePackages.value = packageStore.packages

    if (userStore.selectedPackage) {
        formData.value.package = userStore.selectedPackage
    }
})
</script>