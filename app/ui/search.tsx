'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'

// Takes 'placeholder' prop used as placeholder text on input field
export default function Search({ placeholder }: { placeholder: string }) {

  const searchParams = useSearchParams(); // Client hook that accesses URL search params from the client
  const pathname = usePathname(); // Current path, EX: "/dashboard/invoices"
  const { replace } = useRouter(); // Extract replace method, used to replace current URL with new one

  // Takes the user's input and uses it to manipulate URL parameters only after the user has stopped typing for 300ms.
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams); // Provides utility methods for manipulating URL query parameters

    params.set('page', '1'); // reset page number to 1 everytime user types new search query

    (term) ? params.set('query', term) : params.delete('query'); // Set params string based on user search. Delete if input is empty.

    replace(`${pathname}?${params.toString()}`); // updates URL with user's search data. EX: User searches for lee -> "/dashboard/invoices?query=lee"
  }, 300);
    

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
