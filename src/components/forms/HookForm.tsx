import CountryAutocomplete from '../forms/CountryAutocomplete';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useFormsStore } from '../../store/useFormsStore';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { calculatePasswordStrength } from '../../utils/PasswordStrength';
import { fileToBase64 } from '../../utils/fileToBase64';
import { FieldError } from '../ui/FieldError';
import { Field } from '../ui/Field';
import {
  inputClass,
  selectClass,
  fileClass,
  checkboxClass,
} from '../ui/formClasses';
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
      className="space-y-3 p-6 bg-neutral-900 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <Field label="Имя" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={inputClass}
        />
      </Field>

      <Field label="Возраст" htmlFor="age" error={errors.age?.message}>
        <input
          id="age"
          type="number"
          {...register('age')}
          className={inputClass}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={inputClass}
        />
      </Field>

      <Field label="Пароль" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={inputClass}
        />
      </Field>
      <div className="mt-[-6px] mb-1">
        <PasswordStrengthMeter score={strengthScore} />
      </div>

      <Field
        label="Подтвердите пароль"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className={inputClass}
        />
      </Field>

      <Field label="Пол" htmlFor="gender" error={errors.gender?.message}>
        <select id="gender" {...register('gender')} className={selectClass}>
          <option value="">Выберите пол...</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </Field>

      <Field label="Страна" htmlFor="country" error={errors.country?.message}>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              inputId="country"
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Начните вводить страну..."
            />
          )}
        />
      </Field>

      <Field
        label="Изображение профиля"
        htmlFor="imageFile"
        error={errors.imageFile?.message as string | undefined}
      >
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          {...register('imageFile')}
          className={fileClass}
        />
      </Field>

      <div>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            {...register('acceptedTnC')}
            className={checkboxClass}
          />
          Я принимаю Условия и Положения
        </label>
        <FieldError msg={errors.acceptedTnC?.message} />
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
