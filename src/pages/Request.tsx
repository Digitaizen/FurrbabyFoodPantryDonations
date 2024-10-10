import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const requestSchema = z.object({
  petType: z.enum(['cat', 'dog', 'other']),
  foodType: z.enum(['dry', 'wet', 'specialized']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type RequestFormData = z.infer<typeof requestSchema>;

const Request: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit: SubmitHandler<RequestFormData> = async (data) => {
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'requests'), {
        ...data,
        userId: user?.uid,
        status: 'pending',
        timestamp: new Date(),
      });
      // Show success message
    } catch (error) {
      console.error('Request submission error:', error);
      // Handle submission error (e.g., show error message)
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Request Pet Food</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Pet Type</label>
          <select {...register('petType')} className="w-full p-2 border rounded">
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="other">Other</option>
          </select>
          {errors.petType && <p className="text-red-500">{errors.petType.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Food Type</label>
          <select {...register('foodType')} className="w-full p-2 border rounded">
            <option value="dry">Dry Food</option>
            <option value="wet">Wet Food</option>
            <option value="specialized">Specialized Diet</option>
          </select>
          {errors.foodType && <p className="text-red-500">{errors.foodType.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Quantity</label>
          <input type="number" {...register('quantity', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Name</label>
          <input {...register('name')} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input {...register('phone')} className="w-full p-2 border rounded" />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Request;