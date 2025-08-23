import { useState, useEffect } from 'react';
import Modal from '../components/modal/Modal';
import UncontrolledForm from '../components/forms/UncontrolledForm';
import { HookForm } from '../components/forms/HookForm';
import { useFormsStore } from '../store/useFormsStore';
import { selectEntries, selectLastCreatedId } from '../store/selectors';

export default function Home() {
  const [open, setOpen] = useState<null | 'uncontrolled' | 'rhf'>(null);
  const entries = useFormsStore(selectEntries);
  const lastId = useFormsStore(selectLastCreatedId);

  useEffect(() => {
    const t = setTimeout(() => useFormsStore.getState().clearHighlight(), 3500);
    return () => clearTimeout(t);
  }, [lastId]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Forms Playground</h1>
      <div className="mb-6 flex gap-3">
        <button
          className="rounded-xl px-4 py-2"
          onClick={() => setOpen('uncontrolled')}
        >
          Open Uncontrolled
        </button>
        <button className="rounded-xl px-4 py-2" onClick={() => setOpen('rhf')}>
          Open React Hook Form
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <div
            key={e.id}
            className={`rounded-2xl border border-neutral-800 p-4 ${lastId === e.id ? 'ring-2 ring-emerald-500' : ''}`}
          >
            {e.imageBase64 && (
              <img
                src={e.imageBase64}
                alt={e.name}
                className="mb-3 h-32 w-full rounded-xl object-cover"
              />
            )}
            <div className="space-y-1 text-sm">
              <div className="font-semibold">{e.name}</div>
              <div>{e.email}</div>
              <div>{e.country}</div>
              <div className="text-xs text-neutral-400">{e.source}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={open === 'uncontrolled'}
        onClose={() => setOpen(null)}
        title="Uncontrolled Form"
      >
        <UncontrolledForm />
      </Modal>
      <Modal
        isOpen={open === 'rhf'}
        onClose={() => setOpen(null)}
        title="React Hook Form"
      >
        <HookForm />
      </Modal>
    </div>
  );
}
