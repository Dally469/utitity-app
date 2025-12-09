<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Import useHead for app-wide head configuration
const { $i18n } = useNuxtApp() // Optional: if using i18n for locale-aware titles

// Define app-wide head metadata
useHead({
  title: 'BePay Utility Services', // Main title for the app
  titleTemplate: (title) => {
    // Dynamic title template for pages
    return title ? `${title} - BePay Utility Services` : 'BePay Utility Services'
  },
  meta: [
    { name: 'description', content: 'BePay Utility Services is a comprehensive web application for managing utility payments, billing, and account services with ease and security.' },
    { name: 'keywords', content: 'utility payments, billing, BePay, services, web app' },
    { name: 'author', content: 'BePay Team' },
    { property: 'og:title', content: 'BePay Utility Services' },
    { property: 'og:description', content: 'Streamline your utility management with BePay.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://bepay-utility-services.com' }, // Replace with actual domain
    { property: 'og:image', content: '/og-image.png' }, // Add a suitable OG image
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'BePay Utility Services' },
    { name: 'twitter:description', content: 'Streamline your utility management with BePay.' },
    { name: 'twitter:image', content: '/twitter-image.png' } // Add a suitable Twitter image
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Add favicon
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } // iOS icon
  ],
  script: [
    // Optional: Add any app-wide scripts, e.g., Google Analytics
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID', // Replace with actual ID
      async: true
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
      `,
      type: 'text/plain'
    }
  ]
})
</script>

<style>
/* Optional: Add global styles or improvements here for better UX */
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  min-height: 100vh;
}
</style>