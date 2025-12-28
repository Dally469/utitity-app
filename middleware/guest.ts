export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Try to restore auth from localStorage
    if (process.client && !authStore.isLoggedIn) {
        authStore.restoreAuth();
    }

    // If user is already authenticated, redirect to dashboard
    if (authStore.isAuthenticated && !authStore.isTokenExpired()) {
        return navigateTo('/dashboard');
    }
});