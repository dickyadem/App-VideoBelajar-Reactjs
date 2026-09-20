import { useAuth } from '../context/AuthContext';

export default function ProfileSyncStatus() {
  const { syncStatus, syncError, storageError, retrySync } = useAuth();
  return <>
    {storageError && <p role="alert">{storageError}</p>}
    {syncStatus === 'pending' && <p role="status">Menyinkronkan data profil...</p>}
    {syncError && <><p role="alert">{syncError}</p><button type="button" onClick={retrySync}>Coba sinkronkan lagi</button></>}
  </>;
}
