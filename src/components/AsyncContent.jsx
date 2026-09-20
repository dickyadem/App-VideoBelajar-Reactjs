export default function AsyncContent({ loading, error, loadingMessage, onRetry, children }) {
  if (loading) return <p role="status">{loadingMessage}</p>;
  if (error) return <>
    <p role="alert">{error}</p>
    <button className="btn btn-primary" type="button" onClick={onRetry}>Coba lagi</button>
  </>;
  return children;
}
