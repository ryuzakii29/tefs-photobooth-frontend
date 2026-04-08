<template>
    <v-container class="fill-height">
        <v-row justify="center">
            <v-col cols="12">
                <v-card elevation="0" border class="rounded-xl pa-6">

                    <v-row align="center" justify="center" class="mb-10">
                        <v-col cols="12" class="text-center mb-6">
                            <h2 class="text-h4 font-weight-bold mb-2">Get in Touch</h2>
                            <p class="text-medium-emphasis">Tef's Photobooth & Party Carts — Making memories last.</p>
                        </v-col>

                        <v-col v-for="(img, i) in logos" :key="i" cols="6" sm="4" class="d-flex justify-center">
                            <v-avatar size="200" border class="bg-surface elevation-2">
                                <v-img :src="img.src" :alt="img.alt" />
                            </v-avatar>
                        </v-col>
                    </v-row>

                    <v-divider class="mb-10"></v-divider>

                    <v-row class="px-md-10">
                        <v-col v-for="(contact, i) in contactDetails" :key="i" cols="12" sm="6" class="py-4">
                            <div class="d-flex align-center justify-center">
                                <v-btn :icon="contact.icon" color="primary" variant="tonal" class="mr-4" readonly
                                    tabindex="-1"></v-btn>
                                <div>
                                    <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis">
                                        {{ contact.label }}
                                    </div>
                                    <div v-if="contact.label == 'Email'">
                                        <a :href="`mailto:${contact.value}`"
                                            class="text-decoration-none text-body-1 font-weight-medium">
                                            {{ contact.value }}
                                        </a>
                                    </div>
                                    <div v-else-if="contact.label == 'Facebook'">
                                        <a href="https://www.facebook.com/people/Tefs-Photobooth-Party-Carts-V2/61574507524483/"
                                            target="_blank" rel="noopener noreferrer"
                                            class="text-decoration-none text-body-1 font-weight-medium">
                                            {{ contact.value }}
                                        </a>
                                    </div>
                                    <div v-else class="text-body-1 font-weight-medium" style="overflow-wrap: anywhere;">
                                        {{ contact.value }}
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import logo1 from '@/assets/logo.png'
import logo2 from '@/assets/dark-logo.png'
import logo3 from '@/assets/cafe-logo.png'

const logos = [
    { src: logo1, alt: 'Tef\'s Photo Booth' },
    { src: logo2, alt: 'Tef\'s Photo Booth Dark' },
    { src: logo3, alt: 'Tef\'s Cafe' },
]

const contactDetails = [
    { label: 'Phone', value: '0905-445-2056 / 0916-646-0805', icon: 'mdi-phone' },
    { label: 'Email', value: 'tefsphotobooth1013@gmail.com', icon: 'mdi-email' },
    { label: 'Facebook', value: 'Tef\'s Photobooth & Party Cart', icon: 'mdi-facebook' },
    { label: 'Location', value: 'Bagumbayan, Sta. Cruz, Laguna', icon: 'mdi-map-marker' },
]
</script>

<style scoped>
/* Matching the subtle emphasis of the header */
.v-card {
    transition: transform 0.2s ease-in-out;
}
</style>