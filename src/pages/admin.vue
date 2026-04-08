<template>
    <v-container fluid>
        <v-card variant="outlined" class="pa-4">
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-calendar-check" class="me-2"></v-icon>
                Reservation Management
                <v-spacer></v-spacer>

                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" single-line hide-details
                    density="compact" class="me-4"></v-text-field>

                <v-btn color="success" prepend-icon="mdi-download" @click="triggerDownload">
                    Export CSV
                </v-btn>
            </v-card-title>

            <v-divider class="my-3"></v-divider>

            <v-data-table :headers="headers" :items="reservations" :search="search" :loading="loading" hover>
                <template v-slot:item.package="{ item }">
                    {{ item.package?.name || 'N/A' }}
                </template>

                <template v-slot:item.payment="{ item }">
                    <v-chip :color="item.payment ? 'green' : 'red'" size="small" label>
                        {{ item.payment ? 'Paid' : 'Unpaid' }}
                    </v-chip>
                </template>

                <template v-slot:item.progress="{ item }">
                    <v-select v-model="item.progress" :items="statusOptions" density="compact" hide-details
                        variant="underlined" @update:model-value="triggerUpdateStatus(item)"></v-select>
                </template>

                <template v-slot:item.event_date="{ item }">
                    {{ new Date(item.event_date).toLocaleDateString() }}
                </template>
            </v-data-table>
        </v-card>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color">
            {{ snackbar.text }}
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchReservations, updateStatus } from '@/api';
import { downloadCSV } from '@/composables';

// Configuration
const statusOptions = ['pending', 'confirmed', 'cancelled', 'done'];

// State
const reservations = ref([]);
const loading = ref(true);
const search = ref('');
const snackbar = ref({ show: false, text: '', color: '' });

const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Reservation Date', key: 'event_date' },
    { title: 'Reservation Time', key: 'event_time' },
    { title: 'Package', key: 'package' },
    { title: 'Address', key: 'address' },
    { title: 'Payment', key: 'payment' },
    { title: 'Status', key: 'progress', width: '150px' },
];

const triggerFetchReservations = async () => {
    loading.value = true;
    const response = await fetchReservations();
    console.log("API Response:", response);
    if (response.data.length > 0) {
        reservations.value = response.data.map(item => ({
            ...item
        }));
        loading.value = false;
    } else {
        showMsg('Failed to fetch reservations', 'error');
    }
};

const triggerUpdateStatus = async (reservation) => {
    const response = await updateStatus(reservation);
    if (response) {
        showMsg(`Status updated to ${reservation.progress}`, 'success');
        triggerFetchReservations();
    } else {
        showMsg('Failed to update status', 'error');
    }
};

// CSV Export Logic
const triggerDownload = () => {
    downloadCSV(reservations.value);
};

const showMsg = (text, color) => {
    snackbar.value = { show: true, text, color };
};

onMounted(triggerFetchReservations);
</script>