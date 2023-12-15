export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  IDENTITY_URL: import.meta.env.VITE_IDENTITY_URL,
  CHAT_HUB_URL: import.meta.env.VITE_CHAT_HUB_URL,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  ADMIN_CONTACT:
    import.meta.env.VITE_ADMIN_CONTACT || 'admin@autolog.vrealsoft.com',
}
