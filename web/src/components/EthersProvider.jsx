import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { InfoContractABI } from "../assets/abis/InfoContract";

export default function EthersProvider() {
  const contractAddress = "0xCa53B795539f85E5Be504d2b5d2df0A7d5F39AB6"
  const gradientBtn =
    "bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white rounded-md px-4 py-2 font-semibold shadow transition-all duration-200 hover:scale-105 hover:shadow-lg";
  const gradientBtnLight =
    "bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 text-indigo-700 rounded-md px-4 py-2 font-semibold shadow transition-all duration-200 hover:scale-105 hover:shadow-lg";

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("请先连接钱包");
  const [hiMessage, setHiMessage] = useState("");
  const [setInfoMessage, setSetInfoMessage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [getInfoMessage, setGetInfoMessage] = useState("");
  const [listenMessage, setListenMessage] = useState("");
  const [startListenStatus, setStartListenStatus] = useState(false);
  let listener = null;

  function checkWallet() {
    if (typeof window.ethereum === 'undefined') {
      setMessage("请安装MetaMask钱包");
      return false;
    } else {
      return true;
    }
  }

  // 连接钱包
  async function connectWallet() {
    if (!checkWallet()) {
      return;
    }

    try {
      // 获取用户账户
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        setMessage("请在MetaMask中授权");
        return;
      }
      setAccount(accounts[0]);
      setMessage("钱包连接成功");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // 获取合约实例
      const contract = new ethers.Contract(contractAddress, InfoContractABI, signer);
      setContract(contract);
    } catch (error) {
      console.error('连接钱包失败:', error);
      setMessage("连接钱包失败");
    }
  }

  // 断开钱包
  function disconnectWallet() {
    setContract(null)

    if (listener) {
      contract.removeListener("Instructor", listener)
      listener = null
    }

    setAccount("")
    setMessage("钱包断开连接")
  }

  // 检查钱包
  useEffect(() => {
    checkWallet();
  }, [])

  // 调用 sayHi()
  async function sayHi() {
    if (!contract) {
      setHiMessage("请先连接钱包");
      return;
    }

    try {
      const result = await contract.sayHi();
      setHiMessage(`调用成功: ${result}`);
    } catch (error) {
      console.error('调用失败:', error);
      setHiMessage(`调用失败: ${error.message}`);
    }
  }

  // 设置信息
  async function setInfo() {
    if (!contract) {
      setSetInfoMessage("请先连接钱包");
      return;
    }

    try {
      setSetInfoMessage("设置信息中...");
      const tx = await contract.setInfo(name, age);
      const result = await tx.wait();
      setSetInfoMessage(`设置信息成功，区块号: ${result.blockNumber}`);
    } catch (error) {
      console.error('设置信息失败:', error);
      setMessage(`设置信息失败: ${error.message}`);
    }
  }

  async function getCurInfo() {
    if (!contract) {
      setGetInfoMessage("请先连接钱包");
      return;
    }

    try {
      const result = await contract.getInfo();
      setGetInfoMessage(`获取信息成功: ${result}`);
    } catch (error) {
      console.error('获取信息失败:', error);
      setGetInfoMessage(`获取信息失败: ${error.message}`);
    }
  }

  function startListen() {
    if (!contract) {
      setMessage("请先连接钱包");
      return;
    }

    if (listener) {
      return
    }

    listener = (...args) => {
      const [name, age] = args.slice(0, -1); // 其他参数是事件数据
      const timestamp = new Date().toLocaleString()
      const message = `[${timestamp}] ${name} 设置了年龄为 ${age}`
      setListenMessage(message);
    }

    contract.on("Instructor", listener);
    setStartListenStatus(true);
  }

  function stopListen() {
    if (!contract) {
      setMessage("请先连接钱包");
      return;
    }

    contract.removeListener("Instructor", listener)
    setStartListenStatus(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-2">
      {/* 钱包连接卡片 */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-700">
          <span className="text-xl">🔗</span> 钱包连接
        </div>
        {
          !account ?
            <button className={gradientBtn + " mb-3"} onClick={connectWallet}>连接钱包</button>
            :
            <button className={gradientBtn + " mb-3"} onClick={disconnectWallet}>断开连接</button>
        }
        <div className="mb-2 text-sm text-gray-800 font-semibold">已连接账户：<span className="font-mono">{account}</span></div>
        <div className="bg-blue-200 text-black-800 rounded-md px-4 py-2 text-sm font-medium">{message}</div>
      </div>

      {/* Say Hi 测试卡片 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-700">
          <span className="text-xl">👋</span> Say Hi 测试
        </div>
        <button className={gradientBtn} onClick={sayHi}>调用 sayHi()</button>
        {
          hiMessage && <div className="bg-green-200 text-green-800 rounded-md px-4 py-2 text-sm font-medium mt-2">{hiMessage}</div>
        }
      </div>

      {/* 设置信息卡片 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-700">
          <span className="text-xl">📝</span> 设置信息
        </div>
        <div className="flex gap-2 mb-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="输入姓名" />
          <input value={age} onChange={(e) => setAge(Number(e.target.value))} className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="输入年龄" />
          <button className={gradientBtn} onClick={setInfo}>设置信息</button>
        </div>
        {
          setInfoMessage && <div className="bg-green-200 text-green-800 rounded-md px-4 py-2 text-sm font-medium mt-2">{setInfoMessage}</div>
        }
      </div>

      {/* 获取信息卡片 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-700">
          <span className="text-xl">📋</span> 获取信息
        </div>
        <button className={gradientBtn} onClick={getCurInfo}>获取当前信息</button>
        {
          getInfoMessage && <div className="bg-green-200 text-green-800 rounded-md px-4 py-2 text-sm font-medium mt-2">{getInfoMessage}</div>
        }
      </div>

      {/* 事件监听卡片 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-700">
          <span className="text-xl">🦻</span> 事件监听
        </div>
        <div className="flex gap-2">
          <button className={gradientBtn} onClick={startListen}>开始监听事件</button>
          <button className={gradientBtnLight} onClick={stopListen}>停止监听</button>
        </div>
        <div className="bg-green-200 text-green-800 rounded-md px-4 py-2 text-sm font-medium mt-2">{startListenStatus ? "已开始监听事件" : "未开始监听事件"}</div>
        {
          listenMessage && <div className="bg-blue-200 text-blue-800 rounded-md px-4 py-2 text-sm font-medium mt-2">{listenMessage}</div>
        }
      </div>
    </div>
  );
}