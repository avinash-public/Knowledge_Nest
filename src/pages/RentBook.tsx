import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';
import { CreditCard, MapPin, Truck, Calendar, User, Phone, Smartphone, Building, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RentBook = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State - Delivery
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('');
  
  // Form State - Payment
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'cod'
  const [cardNumber, setCardNumber] = useState('');
  const [upiId, setUpiId] = useState('');

  // Fetch Book Details
  useEffect(() => {
    const fetchBook = async () => {
      const { data } = await supabase.from('books').select('*').eq('id', id).single();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !book) return;
    setLoading(true);

    // Combine contact info into the address string (or save to separate DB columns if you have them)
    const fullDeliveryAddress = `${fullName} (${contactNumber}) - ${address}, ${city} - ${pincode}`;

    // 1. Create Rental Record
    const { error: rentalError } = await supabase
      .from('rentals')
      .insert([
        {
          user_id: session.user.id,
          book_id: book.id,
          address: fullDeliveryAddress,
          payment_method: paymentMethod, // Now saves the selected method dynamically
          status: 'active'
        }
      ]);

    if (rentalError) {
      alert("Rental failed: " + rentalError.message);
      setLoading(false);
      return;
    }

    // 2. Mark Book as Unavailable
    await supabase
      .from('books')
      .update({ available: false })
      .eq('id', book.id);

    // 3. Success!
    setLoading(false);
    navigate('/rental-success', { 
      state: { bookTitle: book.title }
    });
  };

  if (!book) return <div className="p-10 text-center">Loading Checkout...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <form onSubmit={handlePayment} className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT SIDE: Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <MapPin className="text-brand-500" />
              Delivery Details
            </h3>
            <div className="space-y-4">
              
              {/* NEW: Name and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><User size={14}/> Full Name</label>
                  <input 
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1"><Phone size={14}/> Contact Number</label>
                  <input 
                    required
                    type="tel"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input 
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-500"
                  placeholder="e.g. 12, Gandhi Road, Mylapore"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input 
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input 
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="600004"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="text-brand-500" />
              Payment Method
            </h3>
            
            <div className="space-y-3">
              {/* Option 1: Credit Card */}
              <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'}`}>
                <label className="flex items-center cursor-pointer font-medium text-gray-800">
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3 w-4 h-4 text-brand-600" />
                  <CreditCard size={18} className="mr-2 text-gray-500"/> Credit / Debit Card
                </label>
                
                {paymentMethod === 'card' && (
                  <div className="mt-4 pl-7 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <input required={paymentMethod === 'card'} type="text" maxLength={16} value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="block w-full p-3 border border-gray-300 rounded-lg tracking-widest text-sm" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input required={paymentMethod === 'card'} placeholder="MM/YY" className="block w-full p-3 border border-gray-300 rounded-lg text-sm" />
                      <input required={paymentMethod === 'card'} type="password" maxLength={3} placeholder="CVV" className="block w-full p-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: UPI */}
              <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'upi' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'}`}>
                <label className="flex items-center cursor-pointer font-medium text-gray-800">
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3 w-4 h-4 text-brand-600" />
                  <Smartphone size={18} className="mr-2 text-gray-500"/> UPI (GPay, PhonePe, Paytm)
                </label>
                
                {paymentMethod === 'upi' && (
                  <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2">
                    <input required={paymentMethod === 'upi'} type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="block w-full p-3 border border-gray-300 rounded-lg text-sm" placeholder="e.g. yourname@okhdfcbank" />
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'netbanking' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'}`}>
                <label className="flex items-center cursor-pointer font-medium text-gray-800">
                  <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="mr-3 w-4 h-4 text-brand-600" />
                  <Building size={18} className="mr-2 text-gray-500"/> Internet Banking
                </label>
                
                {paymentMethod === 'netbanking' && (
                  <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2">
                    <select required={paymentMethod === 'netbanking'} className="block w-full p-3 border border-gray-300 rounded-lg text-sm bg-white">
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Option 4: Cash on Delivery */}
              <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'}`}>
                <label className="flex items-center cursor-pointer font-medium text-gray-800">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 w-4 h-4 text-brand-600" />
                  <Banknote size={18} className="mr-2 text-gray-500"/> Cash on Delivery (COD)
                </label>
                
                {paymentMethod === 'cod' && (
                  <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-gray-600">You can pay via Cash or UPI to the delivery executive when the book arrives.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="flex gap-4 mb-4">
              <img src={book.cover_url} className="w-16 h-24 object-cover rounded" />
              <div>
                <h4 className="font-semibold text-gray-800 line-clamp-2">{book.title}</h4>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>

            {/* DYNAMIC PRICE FIX ADDED HERE */}
            <div className="border-t border-gray-100 py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental Fee (14 Days)</span>
                <span className="font-medium">₹{book.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">₹10.00</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span className="flex items-center gap-1"><Truck size={14}/> Delivery</span>
                <span>FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{Number(book.price) + 10}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay ₹${Number(book.price) + 10} & Confirm`}
            </button>

            <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
               <Calendar size={12} />
               Due Date: 14 Days from today
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default RentBook;