import { Outlet } from 'react-router-dom';
import { OrdersProvider, useOrders } from '../context/OrdersContext';
import Header from './Header';
import Footer from './Footer';

function OrdersContent() {
  const { loading, error, reload } = useOrders();
  if (!loading && !error) return <Outlet />;
  return <><Header /><main className="container section">
    {loading ? <p role="status">Memuat pesanan...</p> : <>
      <p role="alert">{error}</p>
      <button className="btn btn-primary" type="button" onClick={reload}>Coba lagi</button>
    </>}
  </main><Footer /></>;
}

export default function OrdersLayout() {
  return <OrdersProvider><OrdersContent /></OrdersProvider>;
}
