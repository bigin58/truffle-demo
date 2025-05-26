import { useRoutes, Navigate } from 'react-router-dom';
import EthereumProvider from '../components/EthereumProvider';
import EthersProvider from '../components/EthersProvider';

function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/ethereum" replace />,
    },
    {
      path: '/ethereum',
      element: <EthereumProvider />,
    },
    {
      path: '/ethers',
      element: <EthersProvider />,
    },
  ]);
}

export default Router;