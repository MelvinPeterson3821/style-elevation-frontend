// Import Alpine.js
import Alpine from 'alpinejs'

// Import all your modules
import { AuthSignUp } from './modules/AuthSignUp.js'
import { AuthLogin } from './modules/AuthLogin.js'
import { MemberOnboarding } from './modules/MemberOnboarding.js'
import { VerifyEmail } from './modules/VerifyEmail.js'
import { AdminAddContent } from './modules/AdminAddContent.js'
import { UploadcareHandler } from './modules/UploadcareHandler.js'
import { RichTextEditor } from './modules/RichTextEditor.js'

// Make Alpine available globally
window.Alpine = Alpine

// Initialize Alpine
Alpine.start()

// Initialize Webflow integration
window.Webflow = window.Webflow || []
window.Webflow.push(function () {
  console.log('Style Elevation Frontend Loaded')
  
  // Initialize modules based on page
  initializeModules()
})

function initializeModules() {
  // Check which page we're on and initialize appropriate modules
  const path = window.location.pathname
  
  if (path.includes('/auth/sign-up')) {
    new AuthSignUp()
  } else if (path.includes('/auth/log-in')) {
    new AuthLogin()
  } else if (path.includes('/member-onboarding')) {
    new MemberOnboarding()
  } else if (path.includes('/verify-email')) {
    new VerifyEmail()
  } else if (path.includes('/admin/add-content')) {
    new AdminAddContent()
  }
  
  // Initialize global modules
  new UploadcareHandler()
  new RichTextEditor()
}
