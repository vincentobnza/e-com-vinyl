<script setup lang="ts">
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { HomeHeader } from "@/feature/home/components";
import { CatalogLayout } from "@/feature/home/layouts";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

defineOptions({ name: "CartPage" });

const authStore = useAuthStore();
const cart = useCartStore();
const { serverTotals, syncing } = storeToRefs(cart);

function lineTotal(price: number, qty: number) {
  return price * qty;
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <HomeHeader />
    <CatalogLayout>
      <template #content>
        <div class="space-y-8">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-primary md:text-3xl">
              Your cart
            </h1>
            <p class="mt-1 text-sm text-neutral-500">Review items before checkout.</p>
          </div>

          <p v-if="syncing && !cart.items.length" class="text-sm text-neutral-500" role="status">
            Loading your cart…
          </p>

          <div v-else-if="!cart.items.length" class="px-6 py-14 text-center">
            <p class="text-base md:text-lg lg:text-2xl font-medium text-primary">
              Your cart is empty
            </p>
            <p class="mt-2 text-xs sm:text-sm md:text-lg text-neutral-500">
              Browse the catalog and add vinyl to your cart.
            </p>
            <RouterLink
              to="/products"
              class="mt-6 inline-flex items-center justify-center border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Continue shopping
            </RouterLink>
          </div>

          <div v-else class="space-y-6" :class="{ 'pointer-events-none opacity-70': syncing }">
            <ul class="divide-y divide-border">
              <li
                v-for="line in cart.items"
                :key="line.albumId"
                class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <RouterLink :to="`/product/${line.slug}`" class="group flex shrink-0 gap-4">
                  <div class="w-60 shrink-0 overflow-hidden">
                    <img
                      :src="line.image ?? 'https://placehold.co/200x200/f5f5f5/999?text=Vinyl'"
                      :alt="line.title"
                      class="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0 flex-1 sm:hidden">
                    <p class="text-sm font-medium text-neutral-500">{{ line.artist }}</p>
                    <p class="mt-0.5 font-semibold text-primary group-hover:underline line-clamp-2">
                      {{ line.title }}
                    </p>
                    <p class="mt-2 text-sm text-neutral-600">
                      ${{ Number(line.price).toFixed(2) }} each
                    </p>
                  </div>
                </RouterLink>

                <div class="hidden min-w-0 flex-1 sm:block">
                  <RouterLink :to="`/product/${line.slug}`" class="group block">
                    <p class="text-sm font-medium text-neutral-500">{{ line.artist }}</p>
                    <p class="mt-0.5 font-semibold text-primary group-hover:underline">
                      {{ line.title }}
                    </p>
                  </RouterLink>
                  <p class="mt-2 text-sm text-neutral-600">
                    ${{ Number(line.price).toFixed(2) }} each
                  </p>
                </div>

                <div
                  class="flex flex-wrap items-center gap-4 sm:ml-auto sm:flex-nowrap sm:justify-end"
                >
                  <div
                    class="flex items-center border border-border bg-background"
                    role="group"
                    :aria-label="`Quantity for ${line.title}`"
                  >
                    <button
                      type="button"
                      class="flex h-10 w-10 items-center justify-center text-lg font-semibold text-primary transition-colors hover:bg-black/5 disabled:opacity-40"
                      aria-label="Decrease quantity"
                      :disabled="line.quantity <= 1"
                      @click="void cart.setQuantity(line.albumId, line.quantity - 1)"
                    >
                      −
                    </button>
                    <span
                      class="flex min-w-[2.5rem] items-center justify-center border-x border-border text-sm font-semibold tabular-nums"
                    >
                      {{ line.quantity }}
                    </span>
                    <button
                      type="button"
                      class="flex h-10 w-10 items-center justify-center text-lg font-semibold text-primary transition-colors hover:bg-black/5 disabled:opacity-40"
                      aria-label="Increase quantity"
                      :disabled="line.maxStock > 0 && line.quantity >= line.maxStock"
                      @click="void cart.setQuantity(line.albumId, line.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                  <p class="min-w-[5.5rem] text-right text-base font-semibold text-primary">
                    ${{ lineTotal(line.price, line.quantity).toFixed(2) }}
                  </p>
                  <button
                    type="button"
                    class="shrink-0 text-sm font-medium text-neutral-500 underline underline-offset-2 hover:text-primary"
                    @click="void cart.removeItem(line.albumId)"
                  >
                    Remove
                  </button>
                </div>
              </li>
            </ul>

            <div
              class="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <RouterLink
                to="/products"
                class="text-center text-sm font-semibold text-primary underline underline-offset-4 hover:opacity-90 sm:text-left"
              >
                Continue shopping
              </RouterLink>
              <div class="w-full text-right sm:w-auto">
                <template v-if="authStore.isAuthenticated && serverTotals">
                  <dl class="space-y-1 text-sm text-neutral-600">
                    <div class="flex justify-between gap-8">
                      <dt>Merchandise</dt>
                      <dd class="tabular-nums">${{ serverTotals.subtotal.toFixed(2) }}</dd>
                    </div>
                    <div class="flex justify-between gap-8 text-emerald-800">
                      <dt>Discount</dt>
                      <dd class="tabular-nums">−${{ serverTotals.discount.toFixed(2) }}</dd>
                    </div>
                    <div class="flex justify-between gap-8">
                      <dt>Estimated tax</dt>
                      <dd class="tabular-nums">${{ serverTotals.tax.toFixed(2) }}</dd>
                    </div>
                    <div class="flex justify-between gap-8">
                      <dt>Shipping</dt>
                      <dd class="tabular-nums">${{ serverTotals.shipping.toFixed(2) }}</dd>
                    </div>
                  </dl>
                  <p class="mt-4 text-sm text-neutral-500">Total</p>
                  <p class="text-xl font-semibold text-primary">
                    ${{ cart.grandTotal.toFixed(2) }}
                    <span class="text-base font-normal text-neutral-500">USD</span>
                  </p>
                </template>
                <template v-else>
                  <p class="text-sm text-neutral-500">Subtotal</p>
                  <p class="text-xl font-semibold text-primary">
                    ${{ cart.subtotal.toFixed(2) }}
                    <span class="text-base font-normal text-neutral-500">USD</span>
                  </p>
                  <p class="mt-2 text-xs text-neutral-500">
                    Sign in for saved cart, tax, and shipping estimates.
                  </p>
                </template>
                <button
                  type="button"
                  class="mt-4 w-full border-2 border-primary bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:w-auto"
                  disabled
                >
                  Checkout (coming soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CatalogLayout>
  </main>
</template>
