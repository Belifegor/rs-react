import { useRef, useState, useEffect, useMemo, type FormEvent } from 'react';
import { schema } from '../../utils/validation';
import CountryAutocomplete from '../forms/CountryAutocomplete';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { fileToBase64 } from '../../utils/fileToBase64';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';
import { useFormsStore } from '../../store/useFormsStore';
import { Field } from '../ui/Field';
import { FieldError } from '../ui/FieldError';
import {
  inputClass,
  selectClass,
  fileClass,
  checkboxClass,
} from '../ui/formClasses';

type Props = { onSuccess?: () => void };

export default function UncontrolledForm({ onSuccess }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const acceptedTnCRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const addEntry = useFormsStore((s) => s.addEntry);

  const strengthScore = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const [country, setCountry] = useState('');
  useEffect(() => {
    if (countryRef.current) countryRef.current.value = country;
  }, [country]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = {
      name: nameRef.current?.value ?? '',
      age: ageRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
      confirmPassword: confirmPasswordRef.current?.value ?? '',
      gender: genderRef.current?.value ?? undefined,
      acceptedTnC: acceptedTnCRef.current?.checked ?? false,
      country: country.trim(),
      imageFile: imageFileRef.current?.files,
    };

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const validatedData = validationResult.data;
      let imageBase64: string | undefined = undefined;

      if (validatedData.imageFile && validatedData.imageFile.length > 0) {
        imageBase64 = await fileToBase64(validatedData.imageFile[0]);
      }

      addEntry({
        id: crypto.randomUUID(),
        name: validatedData.name,
        age: validatedData.age,
        email: validatedData.email,
        gender: validatedData.gender,
        acceptedTnC: validatedData.acceptedTnC,
        country: validatedData.country,
        imageBase64,
        source: 'uncontrolled',
        createdAt: Date.now(),
      });

      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при обработке формы:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-3 p-6 bg-neutral-900 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <Field label="Имя" htmlFor="name-uncontrolled" error={errors.name?.[0]}>
        <input
          id="name-uncontrolled"
          type="text"
          ref={nameRef}
          className={inputClass}
        />
      </Field>

      <Field label="Возраст" htmlFor="age-uncontrolled" error={errors.age?.[0]}>
        <input
          id="age-uncontrolled"
          type="number"
          ref={ageRef}
          className={inputClass}
        />
      </Field>

      <Field
        label="Email"
        htmlFor="email-uncontrolled"
        error={errors.email?.[0]}
      >
        <input
          id="email-uncontrolled"
          type="email"
          ref={emailRef}
          className={inputClass}
        />
      </Field>

      <Field
        label="Пароль"
        htmlFor="password-uncontrolled"
        error={errors.password?.[0]}
      >
        <input
          id="password-uncontrolled"
          type="password"
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="mt-0.5">
        <PasswordStrengthMeter score={strengthScore} />
      </div>

      <Field
        label="Подтвердите пароль"
        htmlFor="confirmPassword-uncontrolled"
        error={errors.confirmPassword?.[0]}
      >
        <input
          id="confirmPassword-uncontrolled"
          type="password"
          ref={confirmPasswordRef}
          className={inputClass}
        />
      </Field>

      <Field
        label="Пол"
        htmlFor="gender-uncontrolled"
        error={errors.gender?.[0]}
      >
        <select
          id="gender-uncontrolled"
          ref={genderRef}
          className={selectClass}
        >
          <option value="">Выберите...</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </Field>

      <Field
        label="Страна"
        htmlFor="country-uncontrolled"
        error={errors.country?.[0]}
      >
        <CountryAutocomplete
          value={country}
          onChange={setCountry}
          inputId="country-uncontrolled"
        />
      </Field>

      <Field
        label="Изображение профиля (до 3MB)"
        htmlFor="imageFile-uncontrolled"
        error={errors.imageFile?.[0]}
      >
        <input
          id="imageFile-uncontrolled"
          type="file"
          accept="image/png, image/jpeg"
          ref={imageFileRef}
          className={fileClass}
        />
      </Field>

      <div>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-200">
          <input
            id="tnc-uncontrolled"
            type="checkbox"
            ref={acceptedTnCRef}
            className={checkboxClass}
          />
          Я принимаю Условия и Положения
        </label>
        <FieldError msg={errors.acceptedTnC?.[0]} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
