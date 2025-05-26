import { useState, useEffect } from 'react';
import { Button } from "./Button";
import { LogOut } from "lucide-react";

export default function EthereumProvider() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);

  // 连接钱包的函数（由按钮触发）
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请安装 MetaMask！');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);

      // 查询余额
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });
      const balanceWei = parseInt(balanceHex, 16)
      setBalance(balanceWei / 1e18)
    } catch (error) {
      console.error('用户拒绝授权:', error);
    }
  };

  // 断开连接函数
  const disconnectWallet = async () => {
    setAccount("");
    setBalance(0);
  };

  // 监听账户变化
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(''); // 用户断开连接
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-104px)] flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 drop-shadow-lg">
        MetaMask 原生查询
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg min-w-[340px] text-center flex flex-col gap-6 items-center">
        <div className="flex gap-2 w-full">
          <Button
            onClick={connectWallet}
            className="flex-1"
            variant={account ? "secondary" : "default"}
          >
            {account ? `已连接: ${account.slice(0, 6)}...${account.slice(-4)}` : '连接钱包'}
          </Button>
          {account && (
            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="px-3"
              title="断开连接"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="sr-only">断开连接</span>
            </Button>
          )}
        </div>
        <p className="text-lg text-slate-700 m-0">
          余额: <span className="font-bold text-blue-600">{balance.toFixed(4)} ETH</span>
        </p>
      </div>
    </div>
  );
}