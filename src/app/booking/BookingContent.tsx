'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/models/car';
import { useSearchParams } from 'next/navigation';

export default function BookingContent() {
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
      router.push('/login');
    }
  }, [router]);

  // Get cars from localStorage
  useEffect(() => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
      setCars(JSON.parse(storedCars));
      setLoading(false);
    }
  }, []);

  // Handle date selection
  const handleDateSelect = (type: 'pickup' | 'return', date: string) => {
    if (type === 'pickup') {
      setPickupDate(date);
    } else {
      setReturnDate(date);
    }
    calculateTotalPrice();
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (selectedCar && pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnDateObj = new Date(returnDate);
      const diffTime = Math.abs(returnDateObj.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
      setTotalPrice(diffDays * selectedCar.pricePerDay);
    }
  };

  // Handle car selection
  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    calculateTotalPrice();
  };

  // Handle booking
  const handleBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: selectedCar?.id,
          pickupDate,
          returnDate,
          pickupLocation,
          totalPrice,
          userId: JSON.parse(localStorage.getItem('user') || '{}').id,
        }),
      });

      if (response.ok) {
        setSuccessMessage('تم حجز السيارة بنجاح!');
        // Clear form
        setSelectedCar(null);
        setPickupDate('');
        setReturnDate('');
        setPickupLocation('');
        setTotalPrice(0);
        setDays(0);
      }
    } catch (error) {
      console.error('Error booking car:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">حجز سيارة</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">تفاصيل الحجز</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الاستلام
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => handleDateSelect('pickup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الإرجاع
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => handleDateSelect('return', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موقع الاستلام
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السيارة
              </label>
              <select
                value={selectedCar?.id || ''}
                onChange={(e) => {
                  const car = cars.find((c) => c.id === e.target.value);
                  if (car) {
                    handleCarSelect(car);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر سيارة</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model}
                  </option>
                ))}
              </select>
            </div>
            {selectedCar && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر الإجمالي
                </label>
                <div className="bg-blue-50 px-3 py-2 rounded-md">
                  ${totalPrice.toFixed(2)} لمدة {days} يوم
                </div>
              </div>
            )}
            <button
              onClick={handleBooking}
              disabled={!selectedCar || !pickupDate || !returnDate || !pickupLocation}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              احجز الآن
            </button>
          </div>
        </div>

        {/* Car List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">السيارات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2">جاري التحميل...</p>
              </div>
            ) : (
              cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCarSelect(car)}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <Image
                      src={car.imageUrl}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
                  <p className="text-gray-600">${car.pricePerDay}/يوم</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
