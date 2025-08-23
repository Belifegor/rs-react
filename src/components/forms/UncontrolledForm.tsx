import { useRef, useState, useMemo, type FormEvent } from 'react';
import { schema } from '../../utils/validation';
import { calculatePasswordStrength } from '../../utils/PasswordStrength';
import { fileToBase64 } from '../../utils/fileToBase64';
import { PasswordStrengthMeter } from '../PasswordStrengthMeter';

export default function UncontrolledForm() {
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

  const strengthScore = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

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
      country: countryRef.current?.value ?? '',
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

      const finalData = {
        ...validatedData,
        imageFile: imageBase64,
      };

      console.log('ДАННЫЕ ГОТОВЫ К ОТПРАВКЕ:', finalData);
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
      className="space-y-6 p-6 bg-neutral-900 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-neutral-100">
        Uncontrolled Form
      </h2>

      <div>
        <label
          htmlFor="name-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Имя
        </label>
        <input
          id="name-uncontrolled"
          type="text"
          ref={nameRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-400">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="age-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Возраст
        </label>
        <input
          id="age-uncontrolled"
          type="number"
          ref={ageRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.age && (
          <p className="mt-1 text-xs text-rose-400">{errors.age[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Email
        </label>
        <input
          id="email-uncontrolled"
          type="email"
          ref={emailRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-400">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Пароль
        </label>
        <input
          id="password-uncontrolled"
          type="password"
          ref={passwordRef}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        <PasswordStrengthMeter score={strengthScore} />
        {errors.password && (
          <p className="mt-1 text-xs text-rose-400">{errors.password[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword-uncontrolled"
          type="password"
          ref={confirmPasswordRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="gender-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Пол
        </label>
        <select
          id="gender-uncontrolled"
          ref={genderRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        >
          <option value="">Выберите...</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-xs text-rose-400">{errors.gender[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="country-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Страна
        </label>
        <input
          id="country-uncontrolled"
          type="text"
          ref={countryRef}
          className="mt-1 w-full rounded-md bg-neutral-800 px-3 py-2 text-neutral-100 outline-none ring-1 ring-neutral-700 focus:ring-emerald-500"
        />
        {errors.country && (
          <p className="mt-1 text-xs text-rose-400">{errors.country[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageFile-uncontrolled"
          className="block text-sm font-medium text-neutral-200"
        >
          Изображение профиля (до 3MB)
        </label>
        <input
          id="imageFile-uncontrolled"
          type="file"
          accept="image/png, image/jpeg"
          ref={imageFileRef}
          className="mt-1 block w-full text-sm text-neutral-100 file:mr-3 file:rounded-md file:bg-neutral-700 file:px-3 file:py-1 file:text-neutral-100"
        />
        {errors.imageFile && (
          <p className="mt-1 text-xs text-rose-400">{errors.imageFile[0]}</p>
        )}
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-200">
          <input
            id="tnc-uncontrolled"
            type="checkbox"
            ref={acceptedTnCRef}
            className="rounded bg-neutral-800"
          />
          Я принимаю Условия и Положения
        </label>
        {errors.acceptedTnC && (
          <p className="mt-1 text-xs text-rose-400">{errors.acceptedTnC[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
}
