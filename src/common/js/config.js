export const currentAgent = window.localStorage.getItem('agents') || 'qibao'

export const primaryColor = window.localStorage.getItem('agentTheme')

export const prefix = process.env.NODE_ENV === 'development' ? '/static/' : './static/'
