import { Outlet } from 'react-router-dom';
import { OrdersProvider, useOrders } from '../context/OrdersContext';
import Header from './Header';
import Footer from './Footer';
import AsyncContent from './AsyncContent';

function OrdersContent() {
  const { loading, loadError: error, reload } = useOrders();
  if (!loading && !error) return <Outlet />;
  return <><Header /><main className="container section">
    <AsyncContent loading={loading} error={error} loadingMessage="Memuat pesanan..." onRetry={reload} />
  </main><Footer /></>;
}

export default function OrdersLayout() {
  return <OrdersProvider><OrdersContent /></OrdersProvider>;
}
