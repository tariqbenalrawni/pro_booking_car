'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/models/car';
import ModernCarCard from '@/components/ModernCarCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // تحقق من تسجيل الدخول
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        window.location.href = '/auth/login';
        return;
      }
      try {
        const userObj = JSON.parse(userData);
        setUserName(userObj?.name || userObj?.username || null);
      } catch (e) {
        setUserName(null);
      }
    }

    // جلب السيارات من API
    fetch('/api/cars')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          setCars([]);
        }
      })
      .catch(() => setCars([]));
  }, []);

  const filteredCars = cars.filter((car) =>
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* زر حجز سيارة جديدة */}
          <div className="flex justify-end mb-8">
            
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {/* صفحة ترحيب */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl font-extrabold text-blue-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 drop-shadow-lg">
              مرحباً {userName ? userName : 'بك'} في منصة تأجير السيارات
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              استمتع بتجربة حجز سلسة واكتشف أفضل السيارات بأسعار تنافسية.
            </p>
          </div>

          {/* مربع البحث */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سيارة..."
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900"
              >
                بحث
              </button>
            </div>
          </div>

          {/* عرض السيارات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <ModernCarCard
                key={car.id}
                car={car}
                onSelect={() => window.location.href = `/booking?carId=${car.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
