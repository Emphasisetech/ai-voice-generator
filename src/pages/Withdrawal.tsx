import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Wallet, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getTransactions, submitWithdrawal } from '../utils/api/transactions';
import { Transaction, User } from '../types';
import { getuserDetails } from '../utils/api/user';

interface WithdrawalForm {
  amount: number;
  walletAddress: string;
}

const Withdrawal: React.FC = () => {
  const { user } = useAuth();
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userDetails, setUserDetails] = useState({
    totalWithdrawal: 0,
    teamEarnings: 0,
    walletAddress: '',
    availableForWithdrawal: 0,
    ableToEarn: 0
  });

  const availableBalance = userDetails?.availableForWithdrawal || 0;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WithdrawalForm>({
    defaultValues: {
      walletAddress: user?.walletAddress || '',
    }
  });

  const fetchTransactions = async () => {
    try {
      const { transactions } = await getTransactions({ type: 'withdrawal', page: 1, limit: 10 });
      setTransactions(transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userdata: any = await getuserDetails();
      setUserDetails(userdata)
      // setPagination(pagination);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUserDetails();
  }, []);

  const onSubmit = async (data: WithdrawalForm) => {
    try {
      const transaction = await submitWithdrawal(data); // call your API function
      reset();
      setWithdrawalSubmitted(true);
      // optionally reset form or show success message
    } catch (error: any) {
      console.error('Withdrawal failed:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (withdrawalSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Your withdrawal request has been submitted and is pending approval.
              You will receive your funds within 24-48 hours after approval.
            </p>
            <Button onClick={() => {
              setWithdrawalSubmitted(false);
              fetchTransactions();
            }}>
              Make Another Withdrawal
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Withdraw USDT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Form */}
          <div className="space-y-6">
            {/* Available Balance */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Available Balance</h3>
              <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Total Available for Withdrawal</p>
                <p className="text-3xl font-bold text-white">${userDetails?.availableForWithdrawal}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Total Withdrawal Amount</p>
                    <p className="text-green-400 font-semibold">${(userDetails?.totalWithdrawal || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Able to Withdraw</p>
                    <p className="text-blue-400 font-semibold">${(userDetails?.ableToEarn || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Withdrawal Request</h3>

              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold">Withdrawal Terms:</h4>
                    <ul className="text-yellow-200 text-sm mt-1 space-y-1">
                      <li>• Minimum withdrawal amount: $10 USDT</li>
                      <li>• 5% TDS fee automatically deducted</li>
                      <li>• Withdrawals require approval</li>
                      <li>• Processing time: 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Withdrawal Amount (USDT)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="10"
                      max="100000"
                      step="0.01"
                      {...register('amount', {
                        required: 'Amount is required',
                        min: { value: 1, message: 'Minimum withdrawal is $300' },
                        max: { value: availableBalance, message: 'Amount exceeds available balance' }
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter withdrawal amount"
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    BEP-20 USDT Wallet Address
                  </label>
                  <input
                    type="text"
                    {...register('walletAddress', {
                      required: 'Wallet address is required',
                      pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: 'Please enter a valid BEP-20 wallet address'
                      }
                    })}
                    className="w-full px-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="0x..."
                  />
                  {errors.walletAddress && (
                    <p className="mt-1 text-sm text-red-400">{errors.walletAddress.message}</p>
                  )}
                </div>

                {/* Fee Calculation */}
                {/* {amount > 0 && (
                  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Fee Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Withdrawal Amount:</span>
                        <span className="text-white">${amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TDS Fee (5%):</span>
                        <span className="text-red-400">-${tdsDeduction.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                        <span className="text-gray-300">Net Amount:</span>
                        <span className="text-green-400">${netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )} */}

                <Button type="submit" size="lg" className="w-full">
                  Submit Withdrawal Request
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Withdrawals */}
          <div>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Withdrawals</h3>
              <div className="space-y-4">
                {transactions.map((withdrawal: any) => (
                  <div
                    key={withdrawal.id}
                    className="bg-gray-700 border border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white font-semibold">
                          ${withdrawal.amount.toLocaleString()} USDT
                        </span>
                        <p className="text-gray-400 text-sm">
                          Net: ${withdrawal?.netAmount?.toLocaleString()} (Fee: ${withdrawal.fee})
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(withdrawal.status)}
                        <span className={`text-sm capitalize ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      To: {withdrawal?.walletAddress}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Date: {new Date(withdrawal.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No withdrawals yet</p>
                </div>
              )}
            </Card>

            {/* Withdrawal Guidelines */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Withdrawal Guidelines</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    Only earnings (ROI + team commissions) can be withdrawn. Initial investment remains locked.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    All withdrawals are subject to approval for security reasons.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    5% TDS (Tax Deducted at Source) is automatically deducted from all withdrawals.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    Ensure your wallet address is correct before submitting. Incorrect addresses may result in loss of funds.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;