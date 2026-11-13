import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { StatusBanner } from '../components/shared/StateViews';
import { useAuth } from '../context/AuthContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { FCIT_IDENTITY } from '../data/verifiedShellContent';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(['student', 'visitor']),
});

export function LoginPage() {
  useDocumentMeta({
    title: 'Portal Sign In · FCIT, HBTU Kanpur',
    description: 'Sign in to the FCIT coordinator and student portal.',
    canonicalPath: '/login',
    noIndex: true,
  });

  const navigate = useNavigate();
  const { user, login, register: registerAccount, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [banner, setBanner] = useState({ type: '', message: '' });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'student' },
  });

  const handleLogin = async (values) => {
    setBanner({ type: '', message: '' });
    try {
      const signedUser = await login(values);
      if (['super_admin', 'admin', 'faculty', 'team_member'].includes(signedUser?.role)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setBanner({
        type: 'error',
        message: err?.message || 'Sign in failed. Verify your credentials.',
      });
    }
  };

  const handleRegister = async (values) => {
    setBanner({ type: '', message: '' });
    try {
      await registerAccount(values);
      setBanner({
        type: 'success',
        message: 'Student account registered cleanly.',
      });
      navigate('/', { replace: true });
    } catch (err) {
      setBanner({
        type: 'error',
        message: err?.message || 'Registration failed. Please check the form.',
      });
    }
  };

  return (
    <MainLayout>
      <ScrollSection tone="cream" revealContent={false} className="py-28 sm:py-36">
        <div className="mx-auto max-w-md px-4 hero-stage-item hero-stage-1">
          <div className="rounded-3xl border border-fcit-navy/15 bg-fcit-ivory/95 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={FCIT_IDENTITY.logoSrc}
                alt="FCIT Emblem"
                width="44"
                height="44"
                className="h-11 w-11 rounded-full object-contain"
              />
              <div>
                <p className="mono-meta text-fcit-goldInk uppercase">FCIT Portal</p>
                <h1 className="heading-5 text-fcit-navyDeep">
                  {mode === 'login' ? 'Coordinator & Member Sign In' : 'Create Student Account'}
                </h1>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <StatusBanner
                  type="success"
                  message={`Signed in as ${user.name} (${user.role}).`}
                />
                <div className="flex flex-wrap gap-3">
                  {['super_admin', 'admin', 'faculty', 'team_member'].includes(user.role) && (
                    <button
                      type="button"
                      onClick={() => navigate('/admin')}
                      className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream hover:bg-fcit-navy"
                    >
                      <ShieldCheck size={16} aria-hidden="true" />
                      <span>Open Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 button-sm text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-6 rounded-xl border border-fcit-navy/15 bg-fcit-cream p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setBanner({ type: '', message: '' });
                    }}
                    className={`rounded-lg py-2 button-sm transition duration-300 ease-fcit ${
                      mode === 'login'
                        ? 'bg-fcit-navyDeep text-fcit-cream'
                        : 'text-fcit-secondary hover:text-fcit-navyDeep'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setBanner({ type: '', message: '' });
                    }}
                    className={`rounded-lg py-2 button-sm transition duration-300 ease-fcit ${
                      mode === 'register'
                        ? 'bg-fcit-navyDeep text-fcit-cream'
                        : 'text-fcit-secondary hover:text-fcit-navyDeep'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <div className="mb-4">
                  <StatusBanner type={banner.type} message={banner.message} />
                </div>

                {mode === 'login' ? (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="login-email" className="title-4 text-fcit-navyDeep block mb-1">
                        Email
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        {...loginForm.register('email')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="caption-4 text-[#8C1D18] mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="login-pass" className="title-4 text-fcit-navyDeep block mb-1">
                        Password
                      </label>
                      <input
                        id="login-pass"
                        type="password"
                        autoComplete="current-password"
                        {...loginForm.register('password')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="caption-4 text-[#8C1D18] mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loginForm.formState.isSubmitting}
                      className="w-full rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream hover:bg-fcit-navy transition duration-300 ease-fcit disabled:opacity-60"
                    >
                      {loginForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="reg-fullname" className="title-4 text-fcit-navyDeep block mb-1">
                        Full Name
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        {...registerForm.register('name')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      />
                      {registerForm.formState.errors.name && (
                        <p className="caption-4 text-[#8C1D18] mt-1">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reg-email-acc" className="title-4 text-fcit-navyDeep block mb-1">
                        Email
                      </label>
                      <input
                        id="reg-email-acc"
                        type="email"
                        {...registerForm.register('email')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="caption-4 text-[#8C1D18] mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reg-role" className="title-4 text-fcit-navyDeep block mb-1">
                        Role
                      </label>
                      <select
                        id="reg-role"
                        {...registerForm.register('role')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      >
                        <option value="student">HBTU Student</option>
                        <option value="visitor">Visitor / External</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-pass-acc" className="title-4 text-fcit-navyDeep block mb-1">
                        Password (min 8 characters)
                      </label>
                      <input
                        id="reg-pass-acc"
                        type="password"
                        {...registerForm.register('password')}
                        className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="caption-4 text-[#8C1D18] mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={registerForm.formState.isSubmitting}
                      className="w-full rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream hover:bg-fcit-navy transition duration-300 ease-fcit disabled:opacity-60"
                    >
                      {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
