<script setup lang="ts">
defineOptions({ name: 'HomeBanner' })
import { ref } from 'vue'

const percentOff = ref(10)
</script>

<template>
    <section class="w-full p-2.5 bg-primary flex items-center justify-center">
        <h1 class="text-xs sm:text-sm font-semibold text-white">
            {{ percentOff }}% OFF ON ALL PRODUCTS
        </h1>
    </section>
</template>