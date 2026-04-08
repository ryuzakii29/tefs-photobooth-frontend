<template>
    <v-container class="py-12">

        <h1 class="text-h4 font-weight-bold mb-6 text-center">
            About Us
        </h1>

        <!-- INTRO -->
        <p class="text-subtitle-1 text-center mb-8">
            Tefs Photobooth & Party Carts provides fun, high-quality photobooth
            experiences for all kinds of events.
        </p>

        <!-- MISSION -->
        <v-row class="mb-8">
            <v-col cols="12" md="6">
                <v-card class="pa-6">
                    <h3 class="mb-2">Our Mission</h3>
                    <p>
                        To make every event more memorable through fun and
                        hassle-free photobooth services.
                    </p>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-6">
                    <h3 class="mb-2">What We Offer</h3>
                    <p>
                        Photobooth, 360 video booth, and party cart services
                        for all types of events.
                    </p>
                </v-card>
            </v-col>
        </v-row>

        <!-- WHY CHOOSE US -->
        <v-card class="pa-6 mb-8">
            <h3 class="mb-4">Why Choose Us</h3>

            <v-list density="compact">
                <v-list-item>✔ Affordable packages</v-list-item>
                <v-list-item>✔ High-quality prints</v-list-item>
                <v-list-item>✔ Friendly service</v-list-item>
                <v-list-item>✔ Easy booking</v-list-item>
            </v-list>
        </v-card>

        <!-- CTA -->
        <div class="text-center">
            <v-btn color="primary" @click="$router.push('/packages')">
                View Packages
            </v-btn>
        </div>

    </v-container>
</template>

<script lang="ts" setup>
</script>

<style scoped></style>