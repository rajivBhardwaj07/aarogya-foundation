/** Admin login. On success the server sets an httpOnly cookie; we redirect in. */
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Seo from '../../components/Seo.jsx';
import Lifeline from '../../components/Lifeline.jsx';
import { TextField } from '../../components/Field.jsx';
import { loginFormSchema } from '../../lib/validators.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  if (!loading && user) return <Navigate to="/admin" replace />;

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values);
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <>
      <Seo title="Admin sign in" path="/admin/login" />
      <div className="grid min-h-screen place-items-center bg-paper px-5">
        <div className="w-full max-w-sm">
          <Link to="/" className="mx-auto block w-fit text-healing">
            <Lifeline height={36} animate={false} showDots={false} />
          </Link>
          <h1 className="mt-4 text-center font-display text-3xl text-ink">Admin sign in</h1>
          <p className="mt-1 text-center text-sm text-slate">Aarogya Foundation dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="card mt-7 space-y-4 p-7" noValidate>
            <TextField id="email" label="Email" type="email" autoComplete="username" error={errors.email} {...register('email')} />
            <TextField id="password" label="Password" type="password" autoComplete="current-password" error={errors.password} {...register('password')} />
            {serverError && (
              <p className="rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">
                {serverError}
              </p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate">
            Seeded demo: admin@aarogyafoundation.org / Admin@12345
          </p>
        </div>
      </div>
    </>
  );
}
