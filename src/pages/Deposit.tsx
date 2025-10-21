import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Copy, Check, Wallet, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { submitDeposit } from '../utils/api/transactions';
import { Transaction } from '../types';
import { getTransactions } from '../utils/api/transactions';

export interface DepositForm {
  amount: number;
  transactionId: string;
}

const Deposit: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [depositSubmitted, setDepositSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { transactions, pagination } = await getTransactions({ type: 'deposit', page: 1, limit: 10 });
        setTransactions(transactions);
        setPagination(pagination);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Mock platform wallet address
  const platformWalletAddress = "0x0ad3c7103f27919ac04b00d51681097ff528a0fa";

  const { register, handleSubmit, formState: { errors }, watch } = useForm<DepositForm>();
  const amount = watch('amount');


  const onSubmit = async (data: DepositForm) => {
    setLoading(true);
    setError(null);

    try {
      const transaction = await submitDeposit(data);
      setDepositSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(platformWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock recent deposits
  // const transactions = [
  //   { id: '1', amount: 1000, status: 'approved', transactionId: 'TX123...ABC', date: '2024-01-15' },
  //   { id: '2', amount: 500, status: 'pending', transactionId: 'TX456...DEF', date: '2024-01-14' },
  //   { id: '3', amount: 2000, status: 'approved', transactionId: 'TX789...GHI', date: '2024-01-13' },
  // ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  if (depositSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Deposit Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Your deposit request has been submitted successfully. It will be reviewed and approved within 24 hours.
            </p>
            <Button onClick={() => setDepositSubmitted(false)}>
              Make Another Deposit
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Deposit USDT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Platform Wallet Address</h3>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Send USDT (BEP-20) to this address</p>
                <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                  <span className="text-yellow-400 font-mono text-sm break-all">
                    {platformWalletAddress}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="ml-2 p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 font-semibold">Important Notes:</h4>
                    <ul className="text-red-200 text-sm mt-1 space-y-1">
                      <li>• Only send USDT on BEP-20 (Binance Smart Chain) network</li>
                      <li>• Minimum deposit amount is $10 USDT</li>
                      <li>• Deposits will be credited after network confirmations</li>
                      <li>• Do not send other tokens to this address</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Deposit Details</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Amount (USDT)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="10"
                      step="0.01"
                      {...register('amount', {
                        required: 'Amount is required',
                        min: { value: 10, message: 'Minimum deposit is $10' }
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter amount (minimum $10)"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                  )}
                  {amount >= 10 && (
                    <p className="mt-1 text-sm text-gray-400">
                      Expected daily ROI: ${(amount * 0.005).toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    {...register('transactionId', { required: 'Transaction ID is required' })}
                    className="w-full px-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your transaction ID"
                  />
                  {errors.transactionId && (
                    <p className="mt-1 text-sm text-red-400">{errors.transactionId.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-400">
                    Copy the transaction hash from your wallet after sending USDT
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Deposit Request
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Deposits */}
          <div>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Deposits</h3>
              <div className="space-y-4">
                {transactions.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">
                        ${deposit.amount.toLocaleString()} USDT
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(deposit.status)}
                        <span className={`text-sm capitalize ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm break-all">
                      TX: {deposit.transactionId}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Date: {new Date(deposit.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No deposits yet</p>
                </div>
              )}
            </Card>

            {/* Instructions */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">How to Deposit</h3>
              <ol className="text-gray-300 space-y-3">
                <li className="flex">
                  <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  Copy the platform wallet address above
                </li>
                <li className="flex">
                  <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Open your crypto wallet (Trust Wallet, MetaMask, etc.)
                </li>
                <li className="flex">
                  <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Send USDT on BEP-20 network to the copied address
                </li>
                <li className="flex">
                  <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  Copy the transaction ID from your wallet
                </li>
                <li className="flex">
                  <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                  Fill the form and submit your deposit request
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;