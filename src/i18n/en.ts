const en = {
  common: {
    learnMore: 'Learn more',
  },
  home: {
    title: 'Welcome to Expo',
    getStarted: 'get started',
    tryEditing: 'Try editing',
    devTools: 'Dev tools',
    freshStart: 'Fresh start',
    devMenu: {
      web: 'use browser devtools',
      deviceStart: 'shake device or press',
      deviceEnd: 'in terminal',
      press: 'press',
    },
  },
  explore: {
    title: 'Explore',
    subtitle: 'This starter app includes example\ncode to help you get started.',
    expoDocumentation: 'Expo documentation',
    sections: {
      fileRouting: 'File-based routing',
      platforms: 'Android, iOS, and web support',
      images: 'Images',
      darkMode: 'Light and dark mode components',
      animations: 'Animations',
    },
  },
  auth: {
    appName: 'Fenrir',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInSubtitle: 'Sign in to your account',
    signUpSubtitle: 'Create your account',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    emailInvalid: 'Please enter a valid email',
    password: 'Password',
    passwordPlaceholder: '\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7',
    passwordMinLength: 'Password must be at least 8 characters',
    passwordUppercase: 'Password must contain at least one uppercase letter',
    passwordLowercase: 'Password must contain at least one lowercase letter',
    passwordNumber: 'Password must contain at least one number',
    passwordSpecial: 'Password must contain at least one special character',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    checkEmail: 'Check your email to confirm your account, then sign in.',
  },
} as const;

export default en;
