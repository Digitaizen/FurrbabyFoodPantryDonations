import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, updateUsername } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.displayName || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      await updateUsername(data.username);
      // Show success message
    } catch (error) {
      console.error('Update profile error:', error);
      // Handle update profile error (e.g., show error message)
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input {...register('username')} className="w-full p-2 border rounded" />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;