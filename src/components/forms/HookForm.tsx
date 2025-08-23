import CountryAutocomplete from '../forms/CountryAutocomplete';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useFormsStore } from '../../store/useFormsStore';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { calculatePasswordStrength } from '../../utils/PasswordStrength';
import { fileToBase64 } from '../../utils/fileToBase64';
import {
  schema,
  type FormInput,
  type FormValues,
} from '../../utils/validation';

type Props = { onSuccess?: () => void };

function firstFile(v: unknown): File | undefined {
  if (!v) return undefined;
  if (v instanceof FileList) return v[0] ?? undefined;
  if (v instanceof File) return v;
  if (Array.isArray(v) && v[0] instanceof File) return v[0];
  return undefined;
}

export const HookForm = ({ onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormInput, undefined, FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTnC: undefined,
      country: '',
    },
  });

  const pwd = watch('password') ?? '';
  const strengthScore = useMemo(() => calculatePasswordStrength(pwd), [pwd]);

  const addEntry = useFormsStore((s) => s.addEntry);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const file = firstFile(data.imageFile);
    const imageBase64 = file ? await fileToBase64(file) : undefined;

    addEntry({
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      acceptedTnC: data.acceptedTnC,
      country: data.country,
      imageBase64,
      source: 'rhf',
      createdAt: Date.now(),
    });

    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 p-6 bg-neutral-900 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-200"
        >
          Имя
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-neutral-200"
        >
          Возраст
        </label>
        <input
          id="age"
          type="number"
          {...register('age')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.age && (
          <p className="mt-1 text-xs text-rose-400">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-200"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-200"
        >
          Пароль
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        <PasswordStrengthMeter score={strengthScore} />
        {errors.password && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-neutral-200"
        >
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-neutral-200"
        >
          Пол
        </label>
        <select
          id="gender"
          {...register('gender')}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        >
          <option value="">Выберите пол...</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-xs text-rose-400">{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-neutral-200"
        >
          Страна
        </label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              inputId="country"
              value={field.value}
              onChange={field.onChange}
              placeholder="Начните вводить страну..."
            />
          )}
        />

        {errors.country && (
          <p className="mt-1 text-xs text-rose-400">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageFile"
          className="block text-sm font-medium text-neutral-200"
        >
          Изображение профиля
        </label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          {...register('imageFile')}
          className="mt-1 block w-full text-sm text-neutral-100 file:mr-3 file:rounded-md file:bg-neutral-700 file:px-3 file:py-1 file:text-neutral-100"
        />
        {errors.imageFile && (
          <p className="mt-1 text-xs text-rose-400">
            {String(errors.imageFile.message)}
          </p>
        )}
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            {...register('acceptedTnC')}
            className="rounded bg-neutral-800"
          />
          Я принимаю Условия и Положения
        </label>
        {errors.acceptedTnC && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.acceptedTnC.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};
