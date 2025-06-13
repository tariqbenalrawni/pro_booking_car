"use client";

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/models/car';
import { useSearchParams } from 'next/navigation';

export default function BookingPage() {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const searchParams = useSearchParams();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  // جلب السيارات من API
  useEffect(() => {
    if (!loading) {
      fetch('/api/cars')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCars(data);
            // إذا كان هناك carId في الرابط، اختر السيارة مباشرة
            const carId = searchParams.get('carId');
            if (carId) {
              const foundCar = data.find((c: Car) => String(c.id) === String(carId));
              if (foundCar) setSelectedCar(foundCar);
            }
          } else {
            setCars([]);
          }
        })
        .catch(() => setCars([]));
    }
  }, [loading, searchParams]);

  useEffect(() => {
    if (pickupDate && returnDate && selectedCar) {
      const pickup = new Date(pickupDate);
      const returnDateObj = new Date(returnDate);
      const diffTime = Math.abs(returnDateObj.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
      setTotalPrice(diffDays * selectedCar.pricePerDay);
    }
  }, [pickupDate, returnDate, selectedCar]);

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
  };

  const handleBookCar = async () => {
    if (!pickupDate || !returnDate || !pickupLocation || !selectedCar) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    try {
      // جلب بيانات المستخدم
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login');
        return;
      }
      const user = JSON.parse(userData);
      // إرسال بيانات الحجز إلى API
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          carId: selectedCar.id,
          pickupDate,
          returnDate,
          pickupLocation,
          totalPrice
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('تم الحجز بنجاح! سيتم تحويلك إلى حسابك الآن');
        setTimeout(() => {
          router.push('/account');
        }, 2000);
      } else {
        alert(data.message || 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      alert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* رسالة نجاح أعلى الصفحة إذا تم الحجز */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center text-lg font-bold">
            {successMessage}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              حجز سيارة
            </h1>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              العوده 
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">اختيار السيارة</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  {!selectedCar ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cars.map((car) => (
                        <div
                          key={car.id}
                          onClick={() => handleSelectCar(car)}
                          className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="relative h-48">
                            <Image
                              src={car.imageUrl}
                              alt={`${car.make} ${car.model}`}
                              fill
                              className="object-cover rounded-xl"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="mt-6">
                            <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
                            <p className="text-gray-600">{car.year} موديل</p>
                            <p className="text-blue-600 font-bold mt-2">{car.pricePerDay} ريال/يوم</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {car.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-8">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative h-48 w-64">
                          <Image
                            src={selectedCar.imageUrl}
                            alt={`${selectedCar.make} ${selectedCar.model}`}
                            fill
                            className="object-cover rounded-xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedCar.make} {selectedCar.model}</h3>
                          <p className="text-gray-600">{selectedCar.year} موديل</p>
                          <p className="text-blue-600 font-bold mt-2">{selectedCar.pricePerDay} ريال/يوم</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-gray-900">تفاصيل الحجز</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ استلام السيارة</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ إعادة السيارة</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مكان استلام السيارة</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الموقع...</option>
                    <option value="riyadh">الرياض</option>
                    <option value="jeddah">جدة</option>
                    <option value="dammam">الدمام</option>
                  </select>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">السعر المجموع</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">عدد الأيام</p>
                    <p className="font-semibold">{days} أيام</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">سعر اليوم الواحد</p>
                    <p className="font-semibold">{selectedCar?.pricePerDay || 0} ريال</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">المجموع</p>
                      <p className="text-xl font-bold text-blue-600">{totalPrice} ريال</p>
                    </div>
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                )}

                <button
                  onClick={handleBookCar}
                  disabled={!pickupDate || !returnDate || !pickupLocation || !selectedCar}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

