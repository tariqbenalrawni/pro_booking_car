"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [region, setRegion] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const regions = [
    { value: 'riyadh', label: 'الرياض' },
    { value: 'jeddah', label: 'جدة' },
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
    { value: 'alul', label: 'أبها' },
    { value: 'jizan', label: 'جيزان' },
    { value: 'tabuk', label: 'تبوك' },
    { value: 'hail', label: 'حائل' },
    { value: 'qassim', label: 'القصيم' },
    { value: 'najran', label: 'نجران' }
  ];

  useEffect(() => {
    const carId = searchParams.get('carId');
    if (carId) {
      setSelectedCar({
        id: carId,
        name: 'سيارة فاخرة',
        pricePerDay: 500,
        image: '/car-placeholder.jpg'
      });
      setLoading(false);
    }
  }, [searchParams]);

  const days = pickupDate && returnDate 
    ? Math.ceil(
        (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    : 0;

  const totalPrice = selectedCar ? selectedCar.pricePerDay * days : 0;

  const handleBookCar = async () => {
    try {
      if (!pickupDate || !returnDate || !region || !selectedCar) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('الرجاء تسجيل الدخول أولاً');
        return;
      }

      const user = JSON.parse(userData);

      const bookingData = {
        userId: Number(user.id),
        carId: Number(selectedCar.id),
        pickupDate,
        returnDate,
        pickupLocation: region,
        totalPrice,
        status: 'confirmed'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة الحجز');
      }

      setSuccessMessage('تم تأكيد الحجز بنجاح!');
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (error) {
      console.error('Error booking car:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء عملية الحجز');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">تفاصيل الحجز</h1>
      
      {/* بيانات السيارة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={selectedCar?.image || '/car-placeholder.jpg'} 
              alt={selectedCar?.name || 'السيارة'}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedCar?.name}</h2>
            <p className="text-gray-600 mb-4">السعر اليومي: {selectedCar?.pricePerDay} ريال</p>
          </div>
        </div>
      </div>

      {/* نموذج الحجز */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* المنطقة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">اختر المنطقة...</option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* تاريخ الاستلام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ استلام السيارة</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* تاريخ الإرجاع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ إرجاع السيارة</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* تفاصيل السعر */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">تفاصيل السعر</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">عدد الأيام</p>
                <p className="font-semibold">{days} يوم</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">السعر اليومي</p>
                <p className="font-semibold">{selectedCar?.pricePerDay} ريال</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">المجموع</p>
                  <p className="text-xl font-bold text-blue-600">{totalPrice} ريال</p>
                </div>
              </div>
            </div>
          </div>

          {/* رسالة النجاح */}
          {successMessage && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* زر الحجز */}
          <button
            onClick={handleBookCar}
            disabled={!pickupDate || !returnDate || !region || !selectedCar}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            تأكيد الحجز
          </button>
        </div>
      </div>
    </div>
  );
}
