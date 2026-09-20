import { useEffect, useState } from 'react';

// Keep load stable (module function or useCallback). Ignore superseded requests.
export function useAsyncResource(load, initialData, errorMessage) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const result = await load();
        if (active) setData(result);
      } catch {
        if (active) setError(errorMessage);
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [load, errorMessage, attempt]);

  return { data, setData, loading, error, reload: () => setAttempt((value) => value + 1) };
}
