<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12 pa-4" rounded="lg">
                    <v-card-item class="text-center">
                        <v-avatar color="primary" size="64" class="mb-4">
                            <v-icon icon="mdi-lock" size="32" color="white"></v-icon>
                        </v-avatar>
                        <v-card-title class="text-h5 font-weight-bold">Admin Portal</v-card-title>
                        <v-card-subtitle>Please enter your credentials to continue</v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <v-form @submit.prevent="login" ref="form">
                            <v-text-field v-model="email" label="Email / Username" prepend-inner-icon="mdi-account"
                                type="text" variant="outlined" :rules="[v => !!v || 'Required']"
                                required></v-text-field>

                            <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock-outline"
                                :type="showPassword ? 'text' : 'password'"
                                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="outlined"
                                @click:append-inner="showPassword = !showPassword" :rules="[v => !!v || 'Required']"
                                required></v-text-field>

                            <v-btn type="submit" color="primary" block size="large" :loading="loading" class="mt-4">
                                Login
                            </v-btn>
                        </v-form>
                    </v-card-text>

                    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4" closable>
                        {{ errorMessage }}
                    </v-alert>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { handleLogin } from '@/api';

const router = useRouter();

// State
const email = ref('');
const password = ref('');
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const login = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        const success = await handleLogin(email.value, password.value);
        if (success) {
            router.push('/admin/reservations');
        } else {
            errorMessage.value = 'Invalid credentials. Please try again.';
        }
    } catch (error) {
        errorMessage.value = 'An error occurred during login. Please try again.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.fill-height {
    background: #f4f7f6;
    /* Subtle light background */
}
</style>