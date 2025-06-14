import { Suspense } from 'react';
import BookingPage from './BookingPage';

export default function BookingWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">جارٍ التحميل...</div>}>
      <BookingPage />
    </Suspense>
  );
}
