import { useState } from 'react';

const PaymentSystem = ({ balance, onBalanceUpdate, onBack }) => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeposit = async () => {
    if (!amount || !phoneNumber) {
      setMessage('Please fill all fields');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing M-Pesa payment...');

    // Simulate M-Pesa API call
    setTimeout(() => {
      const depositAmount = parseFloat(amount);
      onBalanceUpdate(balance + depositAmount);
      setMessage(`Successfully deposited KSh${depositAmount.toLocaleString()} via M-Pesa`);
      setAmount('');
      setPhoneNumber('');
      setIsProcessing(false);
    }, 3000);
  };

  const handleWithdraw = async () => {
    if (!amount || !bankAccount) {
      setMessage('Please fill all fields');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > balance) {
      setMessage('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing withdrawal to bank...');

    // Simulate bank transfer
    setTimeout(() => {
      onBalanceUpdate(balance - withdrawAmount);
      setMessage(`Successfully withdrew KSh${withdrawAmount.toLocaleString()} to your bank account`);
      setAmount('');
      setBankAccount('');
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="text-white mb-4 hover:text-green-300">
          ← Back to Dashboard
        </button>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">💳 Payment Center</h2>
          
          <div className="mb-6">
            <div className="bg-green-600 px-4 py-3 rounded-lg text-center">
              <p className="text-white font-semibold">Current Balance: KSh{balance.toLocaleString()}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-3 px-4 rounded-l-lg font-semibold ${
                activeTab === 'deposit' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white/20 text-gray-300'
              }`}
            >
              📱 Deposit (M-Pesa)
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 px-4 rounded-r-lg font-semibold ${
                activeTab === 'withdraw' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/20 text-gray-300'
              }`}
            >
              🏦 Withdraw (Bank)
            </button>
          </div>

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Amount (KSh)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in KSh"
                  className="w-full px-4 py-3 bg-black/30 text-white rounded-lg border border-white/20 focus:border-green-400"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="w-full px-4 py-3 bg-black/30 text-white rounded-lg border border-white/20 focus:border-green-400"
                />
              </div>

              <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">How it works:</h4>
                <ol className="text-green-200 text-sm space-y-1">
                  <li>1. Enter amount and phone number</li>
                  <li>2. Click "Deposit via M-Pesa"</li>
                  <li>3. Check your phone for M-Pesa prompt</li>
                  <li>4. Enter your M-Pesa PIN</li>
                  <li>5. Funds added instantly!</li>
                </ol>
              </div>

              <button
                onClick={handleDeposit}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Deposit via M-Pesa'}
              </button>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Amount (KSh)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in KSh"
                  max={balance}
                  className="w-full px-4 py-3 bg-black/30 text-white rounded-lg border border-white/20 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter bank account"
                  className="w-full px-4 py-3 bg-black/30 text-white rounded-lg border border-white/20 focus:border-blue-400"
                />
              </div>

              <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">Withdrawal Info:</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Minimum withdrawal: KSh1,300</li>
                  <li>• Maximum per day: KSh130,000</li>
                  <li>• No withdrawal fees</li>
                </ul>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Withdraw to Bank'}
              </button>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Successfully') 
                ? 'bg-green-600/20 border border-green-400/30 text-green-200'
                : message.includes('Processing')
                ? 'bg-yellow-600/20 border border-yellow-400/30 text-yellow-200'
                : 'bg-red-600/20 border border-red-400/30 text-red-200'
            }`}>
              <p className="font-semibold">{message}</p>
            </div>
          )}

          {/* Quick Deposit Amounts */}
          {activeTab === 'deposit' && (
            <div className="mt-6">
              <p className="text-white font-semibold mb-3">Quick Deposit:</p>
              <div className="grid grid-cols-3 gap-2">
                {[1300, 3250, 6500, 13000, 32500, 65000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="bg-white/20 text-white py-2 px-3 rounded-lg hover:bg-white/30 text-sm"
                  >
                    KSh{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;