import Alpine from 'alpinejs'

export class AuthSignUp {
  constructor() {
    this.init()
  }

  init() {
    // Disable Webflow's default form handling
    $(document).off("submit")
    $("form").submit(function (e) {
      e.preventDefault()
    })

    // Initialize Alpine.js component
    Alpine.data('authSignUp', () => ({
      // Form data
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        termsAccepted: false,
        privacyAccepted: false
      },
      
      // Pricing selection
      selectedPricing: 'monthly',
      
      // Form state
      isSubmitting: false,
      errors: {},
      
      // Methods
      async submitForm() {
        if (!this.validateForm()) return
        
        this.isSubmitting = true
        this.errors = {}
        
        try {
          // Create account
          const signupResponse = await this.createAccount()
          
          if (signupResponse.authToken) {
            localStorage.setItem('authToken', signupResponse.authToken)
            await this.createStripeCheckout()
          } else {
            window.location.href = "/user/log-in"
          }
        } catch (error) {
          this.handleError(error)
        } finally {
          this.isSubmitting = false
        }
      },
      
      async createAccount() {
        const response = await fetch("https://api.3821digitalsolutions.io/api:GiCzrV5E/auth/signup", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.formData.email,
            password: this.formData.password,
            first_name: this.formData.firstName,
            last_name: this.formData.lastName,
            terms_accepted: this.formData.termsAccepted,
            privacy_accepted: this.formData.privacyAccepted
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return response.json()
      },
      
      async createStripeCheckout() {
        const response = await fetch("https://api.3821digitalsolutions.io/api:JADpEOzO/stripe/create-checkout-session", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
          },
          body: JSON.stringify({
            subscription_type: this.selectedPricing
          })
        })
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        
        const checkoutUrl = await response.text()
        let cleanUrl = checkoutUrl.trim()
        if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
          cleanUrl = cleanUrl.slice(1, -1)
        }
        
        window.location.href = cleanUrl
      },
      
      validateForm() {
        this.errors = {}
        
        if (!this.formData.firstName) this.errors.firstName = 'First name is required'
        if (!this.formData.lastName) this.errors.lastName = 'Last name is required'
        if (!this.formData.email) this.errors.email = 'Email is required'
        if (!this.isValidEmail(this.formData.email)) this.errors.email = 'Invalid email format'
        if (!this.formData.password) this.errors.password = 'Password is required'
        if (!this.isValidPassword(this.formData.password)) this.errors.password = 'Password does not meet requirements'
        if (!this.formData.termsAccepted) this.errors.terms = 'Terms must be accepted'
        if (!this.formData.privacyAccepted) this.errors.privacy = 'Privacy policy must be accepted'
        
        return Object.keys(this.errors).length === 0
      },
      
      isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      },
      
      isValidPassword(password) {
        const lengthPass = password.length >= 8
        const upperPass = (password.match(/[A-Z]/g) || []).length >= 2
        const lowerPass = (password.match(/[a-z]/g) || []).length >= 2
        const numberPass = (password.match(/[0-9]/g) || []).length >= 2
        const specialPass = (password.match(/[^A-Za-z0-9]/g) || []).length >= 2
        
        return lengthPass && upperPass && lowerPass && numberPass && specialPass
      },
      
      handleError(error) {
        console.error('Signup error:', error)
        
        if (error.message.includes('409')) {
          alert('An account with this email address already exists. Please try logging in instead.')
        } else if (error.message.includes('400')) {
          alert('Please check your information and try again.')
        } else {
          alert('There was an error creating your account. Please try again later.')
        }
      },
      
      selectPricing(type) {
        this.selectedPricing = type
      }
    }))
  }
}
