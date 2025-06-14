"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car } from '@/models/car';

export default function Account() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/auth/login';
      return;
    }
    const userObj = JSON.parse(userData);
    setUser(userObj);

    // جلب جميع الحجوزات من API ثم تصفية حجوزات المستخدم الحالي
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (res.ok) {
          // تصفية الحجوزات الخاصة بالمستخدم الحالي
          const userBookings = data.bookings.filter((b: any) => b.userId === userObj.id);
          setBookings(userBookings);
        }
      } catch (error) {
        // يمكن إضافة رسالة خطأ هنا عند الحاجة
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-6 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow-sm hover:bg-blue-200 transition-colors flex items-center"
        >
          ← العودة للصفحة الرئيسية
        </Link>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">حسابي</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">معلوماتي</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={user ? user.name : ""}
                    onChange={e => setUser((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={user ? user.email : ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={user ? user.phone : ""}
                    onChange={e => setUser((prev: any) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              onClick={async () => {
                if (!user) return;
                setLoading(true);
                const res = await fetch('/api/account', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    licenseNumber: user.licenseNumber || ''
                  })
                });
                const data = await res.json();
                setLoading(false);
                if (res.ok) {
                  localStorage.setItem('user', JSON.stringify(data.user));
                  alert('تم تحديث البيانات بنجاح');
                } else {
                  alert(data.message || 'حدث خطأ أثناء التحديث');
                }
              }}
            >
              حفظ التعديلات
            </button>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">حجوزاتي</h2>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center text-gray-500">لا توجد حجوزات بعد</div>
                ) : (
                  bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="bg-white p-6 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.car.make} {booking.car.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {booking.car.year} موديل
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            مؤكد
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">تاريخ البدء:</p>
                          <p className="text-gray-900">
                            {new Date(booking.pickupDate).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">تاريخ الانتهاء:</p>
                          <p className="text-gray-900">
                            {new Date(booking.returnDate).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">مكان الاستلام:</p>
                          <p className="text-gray-900">{booking.pickupLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">السعر الإجمالي:</p>
                          <p className="text-gray-900">{booking.totalPrice} ريال</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">التعديلات</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  onClick={async () => {
                    if (!user) return;
                    if (newPassword !== confirmPassword) {
                      alert('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
                      return;
                    }
                    setLoading(true);
                    const res = await fetch('/api/account/password', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: user.id,
                        currentPassword,
                        newPassword
                      })
                    });
                    const data = await res.json();
                    setLoading(false);
                    if (res.ok) {
                      alert('تم تحديث كلمة المرور بنجاح');
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    } else {
                      alert(data.message || 'حدث خطأ أثناء تحديث كلمة المرور');
                    }
                  }}
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
