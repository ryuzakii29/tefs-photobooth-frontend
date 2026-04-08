<template>
    <v-app-bar elevation="0" border="b" class="px-md-10">
        <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

        <router-link to="/" class="text-decoration-none color-inherit  d-none d-md-flex">
            <div class="d-flex align-center py-2">
                <v-img src="@/assets/logo.png" alt="Logo" width="45" height="45" class="mr-3"></v-img>
                <span class="text-medium-emphasis ml-1 font-weight-regular">
                    Tefs Photobooth &<br> Party Carts
                </span>

            </div>
        </router-link>

        <v-spacer></v-spacer>

        <div class="d-none d-md-flex align-center">
            <v-btn v-for="item in navItems" :key="item.title" variant="text" class="text-capitalize mx-1" :to="item.to">
                {{ item.title }}
            </v-btn>
        </div>

        <v-divider vertical inset class="mx-4 d-none d-md-flex"></v-divider>

        <div class="d-flex align-center">
            <v-btn @click="$router.push('/reservation')" color="primary" variant="elevated" rounded="lg"
                class="text-capitalize font-weight-bold px-6">
                Book Now
            </v-btn>

            <v-btn icon variant="text" @click="toggleTheme" class="ml-2">
                <v-icon size="small">
                    {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                </v-icon>
            </v-btn>
        </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
        <div class="pa-6 text-center">
            <v-img src="@/assets/logo.png" max-width="80" class="mx-auto mb-4"></v-img>
            <div class="text-h6 font-weight-bold">Tefs Photobooth</div>
        </div>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item v-for="item in navItems" :key="item.title" :title="item.title" :to="item.to" rounded="lg" />
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/app'

const theme = useTheme()
const drawer = ref(false)
const userStore = useUserStore()

function toggleTheme() {
    userStore.setTheme(theme.global.current.value.dark ? 'light' : 'dark');
}

onMounted(() => {
    theme.change(userStore.currentTheme);
})

watch(
    () => userStore.currentTheme,
    (newTheme) => {
        theme.change(newTheme);
    }
)


const navItems = [
    { title: 'Home', to: '/' },
    { title: 'Packages', to: '/packages' },
    { title: 'Gallery', to: '/gallery' },
    { title: 'About', to: '/about' },
    { title: 'Contact', to: '/contact' },
]
</script>

<style scoped>
.color-inherit {
    color: inherit !important;
}
</style>