<template>
    <v-img src="@/assets/tefs-banner.png" height="100vh" cover class="align-center"
        gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.8)">
        <v-container class="text-center text-white">
            <v-row justify="center">
                <v-col cols="12" md="9">
                    <v-chip color="primary" variant="flat" class="mb-4 font-weight-bold">PREMIUM PHOTO BOOTH
                        RENTALS</v-chip>
                    <h1 class="text-h2 text-md-h1 font-weight-black mb-4">
                        MAKING MEMORIES <span class="text-primary">TANGIBLE.</span>
                    </h1>
                    <p class="text-h6 mb-8 font-weight-light">
                        We don't just take photos; we create an experience your guests will talk about for years.
                    </p>
                    <v-btn size="x-large" color="primary" rounded="pill" elevation="10"
                        @click="$router.push('/packages')">
                        View Pricing & Packages
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-img>

    <v-container class="py-16">
        <v-row align="center">
            <v-col cols="12" md="6">
                <h2 class="text-h3 font-weight-bold mb-6">More Than Just a Camera in a Box</h2>
                <p class="text-body-1 text-grey-darken-1 mb-4">
                    At <strong>TEFS</strong>, we believe every event has a unique heartbeat. Our open-air photo booths
                    are designed to blend seamlessly into your decor while providing professional-grade lighting and
                    instant keepsakes.
                </p>
                <p class="text-body-1 text-grey-darken-1">
                    Whether it’s a high-energy corporate gala or an intimate wedding, we bring the fun, the props, and
                    the high-resolution smiles.
                </p>
            </v-col>
            <v-col cols="12" md="6">
                <v-img src="@/assets/sampler1.jpg" cover rounded="xl" elevation="4"></v-img>
            </v-col>
        </v-row>
    </v-container>

    <v-container fluid class="bg-grey-lighten-4 py-16">
        <v-container>
            <div class="text-center mb-10">
                <h2 class="text-h4 font-weight-bold">Built for Every Celebration</h2>
            </div>
            <v-row>
                <v-col cols="6" sm="4" md="2" v-for="item in events" :key="item.title">
                    <v-card variant="flat" class="py-6 text-center hover-card border rounded-lg">
                        <v-icon size="40" color="primary" class="mb-3">{{ item.icon }}</v-icon>
                        <div class="text-subtitle-1 font-weight-bold">{{ item.title }}</div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>

    <v-container class="py-16">
        <div class="text-center mb-12">
            <h2 class="text-h4 font-weight-bold">Three Easy Steps</h2>
            <p class="text-grey">Booking your fun is easier than striking a pose.</p>
        </div>
        <v-timeline side="end">
            <v-timeline-item dot-color="primary" size="small">
                <template v-slot:opposite> Step 1 </template>
                <div class="mb-4">
                    <div class="text-h6 font-weight-bold">Pick Your Date & Package</div>
                    <p class="text-body-2 text-grey">Select from our tiered packages tailored to your event duration and
                        guest count.
                    </p>
                </div>
            </v-timeline-item>
            <v-timeline-item dot-color="primary" size="small">
                <template v-slot:opposite> Step 2 </template>
                <div class="mb-4">
                    <div class="text-h6 font-weight-bold">We Show Up & Level Up</div>
                    <p class="text-body-2 text-grey">Our team arrives 1 hour early to set up the booth, lighting, and
                        premium props.
                    </p>
                </div>
            </v-timeline-item>
            <v-timeline-item dot-color="primary" size="small">
                <template v-slot:opposite> Step 3 </template>
                <div class="mb-4">
                    <div class="text-h6 font-weight-bold">Print, Share & Enjoy</div>
                    <p class="text-body-2 text-grey">Your guests get instant prints and digital copies. You get a full
                        gallery after
                        the event!</p>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-container>

    <v-container fluid class="pa-0">
        <v-carousel v-if="galleryStore.galleries.length > 0" cycle height="600" show-arrows="hover">
            <v-carousel-item v-for="(slide, i) in galleryStore.galleries.slice(0, 5)" :key="i" :src="slide.imageUrl"
                cover>
                <div class="d-flex fill-height align-end justify-center pb-10">
                    <!-- <div class="bg-black-opacity-50 pa-4 rounded text-white font-weight-bold">
                        Real Moments from Recent Events
                    </div> -->
                </div>
            </v-carousel-item>
        </v-carousel>
    </v-container>

    <v-container class="py-16 text-center">
        <v-row justify="center">
            <v-col cols="12" md="7">
                <v-card color="secondary" dark class="pa-10 rounded-xl elevation-6 text-white">
                    <h2 class="text-h4 font-weight-bold mb-6">Standard in Every Package</h2>
                    <v-row class="text-left">
                        <v-col cols="12" sm="6" v-for="feat in features" :key="feat">
                            <v-icon color="primary" icon="mdi-check" class="mr-2"></v-icon> {{ feat }}
                        </v-col>
                    </v-row>
                    <v-divider class="my-8 opacity-20"></v-divider>
                    <h3 class="mb-6 text-h5">Ready to start the party?</h3>
                    <v-btn @click="$router.push('/reservation')" size="x-large" color="white" variant="elevated"
                        class="text-primary font-weight-bold px-10" rounded="pill">
                        Book Now
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useGalleryStore } from '@/stores/app'
import { onMounted } from 'vue'

const galleryStore = useGalleryStore();

onMounted(async () => {
    if (galleryStore.galleries.length === 0) {
        await galleryStore.fetchGalleries();
    }
});

const events = [
    { icon: 'mdi-cake-variant', title: 'Birthdays' },
    { icon: 'mdi-ring', title: 'Weddings' },
    { icon: 'mdi-office-building', title: 'Corporate' },
    { icon: 'mdi-school', title: 'Graduations' },
    { icon: 'mdi-party-popper', title: 'Parties' },
    { icon: 'mdi-star', title: 'VIP Events' }
]

const features = [
    'Unlimited Digital Photos',
    'Professional DSLR Quality',
    'Curated Prop Box',
    'Online Digital Gallery',
    'On-site Attendant',
    'Customized Print Templates'
]

const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.hover-card {
    transition: all 0.3s ease;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.bg-black-opacity-50 {
    background: rgba(0, 0, 0, 0.5);
}
</style>