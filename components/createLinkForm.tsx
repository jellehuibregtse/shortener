import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { debounce } from 'lodash';

type Form = {
  slug: string;
  url: string;
};

const CreateLinkForm: NextPage = () => {
  const [created, setCreated] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({ slug: '', url: '' });
  const url = window.location.origin;

  const slugCheck = trpc.useQuery(['slugCheck', { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createSlug = trpc.useMutation(['createSlug']);

  useEffect(() => {
    setCreated(createSlug.status === 'success');
  }, [createSlug.status]);

  if (created) {
    return (
      <div className="flex flex-col justify-center items-center">
        <span className="font-mono text-5xl">
          <span className="text-green-400">Short</span> URL created!
        </span>
        <a className="mt-5 font-mono text-xl" href={url + '/' + form.slug}>
          {url}/{form.slug}
        </a>
        <button
          onClick={() => setCreated(false)}
          disabled={slugCheck.isFetched && slugCheck.data?.used}
          className="mt-5 w-full bg-green-400 disabled:bg-gray-600 hover:bg-green-500 text-gray-950 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white cursor-pointer mt-1"
        >
          Create another short URL
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createSlug.mutate({ ...form });
      }}
      className="flex flex-col justify-center items-center"
    >
      <span className="font-mono text-5xl">
        Create a <span className="text-green-400">short</span> URL.
      </span>
      <div className="mt-5">
        <span className="font-medium mr-2 text-center text-red-500">
          {slugCheck.data?.used && 'Slug already in use.'}
        </span>

        <div className="flex items-center">
          <span className="font-mono">{url}/</span>
          <input
            type="text"
            onChange={(e) => {
              setForm({
                ...form,
                slug: e.target.value,
              });
              debounce(slugCheck.refetch, 100);
            }}
            minLength={1}
            placeholder="url"
            className="font-mono bg-gray-950 focus:gray-950 focus:outline-none text-pink-400"
            value={form.slug}
            pattern={'^[-a-zA-Z0-9]+$'}
            title="Only alphanumeric characters and hypens are allowed. No spaces."
            required
          />
        </div>
        <div className="flex items-center">
          <span className="font-mono mr-2">Link</span>
          <input
            type="url"
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://google.com"
            className="font-mono bg-gray-950 focus:gray-950 focus:outline-none text-pink-400"
            required
          />
        </div>

        <input
          type="submit"
          value="Create"
          disabled={slugCheck.isFetched && slugCheck.data?.used}
          className="mt-10 w-full bg-green-400 disabled:bg-gray-600 hover:bg-green-500 text-gray-950 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white cursor-pointer mt-1"
        />
      </div>
    </form>
  );
};

export default CreateLinkForm;
