<template>
    <v-container>
        <v-row>
            <v-col v-for="gallery in galleryStore.galleries" :key="gallery.id" cols="12" sm="6" md="4">
                <v-card hover class="rounded-lg">
                    <v-img :src="gallery.imageUrl" aspect-ratio="1" cover class="bg-grey-lighten-2">
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey-lighten-5" />
                            </v-row>
                        </template>
                    </v-img>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useGalleryStore } from '@/stores/app'
import { onMounted } from 'vue'

const galleryStore = useGalleryStore();

onMounted(async () => {
    if (galleryStore.galleries.length === 0) {
        await galleryStore.fetchGalleries();
    }
});
</script>