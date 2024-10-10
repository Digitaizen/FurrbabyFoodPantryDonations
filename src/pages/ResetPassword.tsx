import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      await resetPassword(data.email);
      // Show success message
    } catch (error) {
      console.error('Reset password error:', error);
      // Handle reset password error (e.g., show error message)
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;