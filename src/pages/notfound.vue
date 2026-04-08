<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
                <v-icon size="150" color="primary" icon="mdi-calendar-search" class="mb-6"></v-icon>

                <h1 class="text-h2 font-weight-bold mb-2">404</h1>
                <h2 class="text-h5 font-weight-medium mb-6 text-medium-emphasis">
                    Oops! We can't find that page.
                </h2>

                <p class="text-body-1 mb-8 text-grey-darken-1">
                    The link might be broken, or the page URL you entered
                    is incorrect. Double-check your link and try again.
                </p>

                <v-btn color="primary" size="large" variant="elevated" prepend-icon="mdi-home" to="/" elevation="2">
                    Back to Home
                </v-btn>

                <v-btn class="ml-4" variant="text" color="secondary" @click="$router.go(-1)">
                    Go Back
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
</script>

<style scoped>
.v-icon {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }

    100% {
        transform: translateY(0px);
    }
}
</style>