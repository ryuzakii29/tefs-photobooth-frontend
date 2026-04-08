<template>
    <v-container fluid>
        <v-card variant="outlined" class="pa-4">
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-calendar-check" class="me-2"></v-icon>
                Reservation Management
                <v-spacer></v-spacer>

                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search" single-line hide-details
                    density="compact" class="me-4"></v-text-field>

                <v-btn color="success" prepend-icon="mdi-download" @click="downloadCSV">
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
                        variant="underlined" @update:model-value="updateStatus(item)"></v-select>
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
import axios from 'axios';

// Configuration
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
const STRAPI_URL = `${baseURL}/api/reservations`;
const statusOptions = ['pending', 'confirmed', 'cancelled', 'done'];

// State
const reservations = ref([]);
const loading = ref(true);
const search = ref('');
const snackbar = ref({ show: false, text: '', color: '' });

const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Date', key: 'event_date' },
    { title: 'Time', key: 'event_time' },
    { title: 'Package', key: 'package' },
    { title: 'Payment', key: 'payment' },
    { title: 'Status', key: 'progress', width: '150px' },
];

// Fetch Data
const fetchReservations = async () => {
    const token = localStorage.getItem('strapi_jwt'); // You get this after logging in
    loading.value = true;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
    try {
        const response = await axios.get(`${apiBaseUrl}/api/reservations?populate=*`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        reservations.value = response.data.data.map(item => ({
            id: item.id,
            ...item.attributes
        }));
    } catch (error) {
        if (error.response?.status === 403) alert("You don't have permission!");
    } finally {
        loading.value = false;
    }
};

// Update Status in Strapi
const updateStatus = async (item) => {
    try {
        await axios.put(`${STRAPI_URL}/${item.id}`, {
            data: { progress: item.progress }
        });
        showMsg(`Status updated to ${item.progress}`, 'success');
    } catch (error) {
        showMsg('Update failed', 'error');
    }
};

// CSV Export Logic
const downloadCSV = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `tefs-reservations-${currentDate}.csv`;

    // Define columns for CSV
    const rows = reservations.value.map(r => ({
        Name: r.name,
        Email: r.email,
        Contact: r.contact_number,
        Date: r.event_date,
        Time: r.event_time,
        Status: r.progress,
        Paid: r.payment ? 'Yes' : 'No'
    }));

    if (rows.length === 0) return;

    const headerKeys = Object.keys(rows[0]);
    const csvContent = [
        headerKeys.join(','),
        ...rows.map(row => headerKeys.map(key => `"${row[key]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const showMsg = (text, color) => {
    snackbar.value = { show: true, text, color };
};

onMounted(fetchReservations);
</script>