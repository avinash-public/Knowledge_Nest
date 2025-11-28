import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Book } from '../types';
import { CreditCard, MapPin, Truck, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RentBook = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('');
  const [cardNumber, setCardNumber] = useState('');

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

    // 1. Create Rental Record
    const { error: rentalError } = await supabase
      .from('rentals')
      .insert([
        {
          user_id: session.user.id,
          book_id: book.id,
          address: `${address}, ${city} - ${pincode}`,
          payment_method: 'Credit Card (Demo)',
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
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT SIDE: Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <MapPin className="text-brand-500" />
              Delivery Address
            </h3>
            <div className="space-y-4">
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
              Payment Details
            </h3>
            <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg mb-4 flex items-center gap-2">
              <Lock size={16} />
              This is a secure demo. No real money will be deducted.
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input 
                  required
                  type="text"
                  maxLength={16}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-lg tracking-widest"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry</label>
                  <input placeholder="MM/YY" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input type="password" maxLength={3} placeholder="123" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" />
                </div>
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

            <div className="border-t border-gray-100 py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental Fee (14 Days)</span>
                <span className="font-medium">₹40.00</span>
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
                <span>₹50.00</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-500/30"
            >
              {loading ? 'Processing...' : 'Pay & Confirm Rental'}
            </button>

            <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
               <Calendar size={12} />
               Due Date: 14 Days from today
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RentBook;