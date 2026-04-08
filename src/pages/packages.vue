<template>
    THIS IS PACKAGE
    <v-container class="py-10">
        <p v-if="packageStore.packages.length === 0">Loading packages or no data found...</p>
        <div v-for="(item, index) in packageStore.allPackages" :key="item.id" class="mb-12">
            <v-row align="center" :class="index % 2 !== 0 ? 'flex-row-reverse' : ''">
                <v-col cols="12" md="6">
                    <v-hover v-slot="{ isHovering, props }">
                        <v-card v-bind="props" :elevation="isHovering ? 12 : 2"
                            class="rounded-xl overflow-hidden transition-swing">
                            <v-img :src="item.imageUrl" height="400" cover class="align-end text-white">
                                <v-card-title class="bg-black-lighten-2 pa-4" style="background: rgba(0,0,0,0.4)">
                                    {{ item.name }}
                                </v-card-title>
                            </v-img>
                        </v-card>
                    </v-hover>
                </v-col>

                <v-col cols="12" md="6" class="px-md-10">
                    <div :class="index % 2 !== 0 ? 'text-right' : 'text-left'">

                        <h2 class="text-h3 font-weight-bold mb-4">{{ item.name }}</h2>
                        <v-chip color="primary" variant="tonal" class="mb-4">
                            ₱{{ item.price.toLocaleString() }}
                        </v-chip>
                        <p class="text-body-1 text-medium-emphasis mb-6">
                            {{ item.description }}
                        </p>

                        <v-list lines="one" density="compact" bg-color="transparent">
                            <v-list-item-title>Premium Inclusion: </v-list-item-title>
                            <v-list-item v-for="(inc, i) in item.inclusions" :key="i"
                                :prepend-icon="index % 2 === 0 ? 'mdi-check-circle' : ''"
                                :append-icon="index % 2 !== 0 ? 'mdi-check-circle' : ''" color="success" class="pa-0">

                                <v-list-item-subtitle>{{ inc.children?.[0].text || inc }}</v-list-item-subtitle>
                                <br>
                            </v-list-item>
                        </v-list>

                        <v-btn color="primary" size="large" rounded="lg" variant="elevated"
                            class="text-capitalize font-weight-bold px-10"
                            prepend-icon="mdi-book-open-variant justify-center" @click="bookNow(item.id)">
                            Book Now
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup>
import router from '@/router';
import { usePackageStore, useUserStore } from '@/stores/app'
import { onMounted } from 'vue'

const packageStore = usePackageStore();
const userStore = useUserStore();

onMounted(async () => {
    if (packageStore.packages.length === 1 || packageStore.packages.length === 0) {
        await packageStore.fetchPackages()
    }
})

const bookNow = function (id) {
    userStore.setPackage(id);
    router.push('/reservation');
}
</script>

<style scoped>
.transition-swing {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>