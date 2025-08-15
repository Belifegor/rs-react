import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialValue = searchParams?.get('query') || '';

  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (inputValue) {
      params.set('query', inputValue);
    } else {
      params.delete('query');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4"
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a character..."
        className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
