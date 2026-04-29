import React from "react";

export default function LoginPage() {
  return (
    <div className="bg-background font-body text-on-surface flex min-h-screen items-center justify-center p-4 relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-2/5 h-2/5 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-2/5 h-2/5 bg-tertiary/5 rounded-full blur-[120px]" />
      </div>
      <main className="w-full max-w-md">
        {/* Brand Identity Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-xl mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-inverse-surface mb-2">Acada</h1>
          <p className="text-on-surface-variant font-medium">Curation for the modern learner.</p>
        </div>
        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
          <form className="space-y-6" method="POST">
            {/* Input Group: Email */}
            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">alternate_email</span>
                </div>
                <input className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200 font-body" id="email" name="email" placeholder="name@example.com" required type="email" />
              </div>
            </div>
            {/* Input Group: Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a className="font-label text-xs font-bold text-primary hover:text-primary-dim transition-colors uppercase tracking-widest" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <input className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200 font-body" id="password" name="password" placeholder="••••••••" required type="password" />
              </div>
            </div>
            {/* Primary Action Button */}
            <button className="w-full bg-linear-to-br from-primary to-primary-dim text-on-primary font-headline font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2" type="submit">
              Log In
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>
          {/* Divider */}
          <div className="relative my-8">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-surface-container-high"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-label font-bold">
              <span className="bg-surface-container-lowest px-4 text-outline">or continue with</span>
            </div>
          </div>
          {/* Social Sign-in */}
          <button className="w-full flex items-center justify-center gap-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-headline font-bold py-4 px-6 rounded-xl transition-all duration-200 group" type="button">
            {/* Google SVG */}
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>
        </div>
        {/* Secondary Navigation */}
        <p className="mt-8 text-center text-on-surface-variant font-medium">
          Don't have an account?{' '}
          <a className="text-primary font-bold hover:underline" href="#">Sign up for free</a>
        </p>
      </main>
    </div>
  );
}
