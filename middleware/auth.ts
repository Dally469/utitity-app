export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Try to restore auth from localStorage on first load
    if (process.client && !authStore.isLoggedIn) {
        authStore.restoreAuth();
    }

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        // Redirect to login page
        return navigateTo('/');
    }

    // Check if token is expired
    if (authStore.isTokenExpired()) {
        console.warn('Token expired, attempting refresh...');

        // Try to refresh token
        authStore.refreshAccessToken().then(success => {
            if (!success) {
                // If refresh fails, redirect to login
                return navigateTo('/');
            }
        });
    }
});