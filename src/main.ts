import 'dssoca/theme.css'
import './app.scss'
import { mount } from 'svelte'
import { inject } from '@vercel/analytics'
import App from './App.svelte'

// Vercel Web Analytics: page views only, no cookies; disabled in dev.
inject({ mode: import.meta.env.DEV ? 'development' : 'production', framework: 'svelte' })

export default mount(App, { target: document.getElementById('app')! })
