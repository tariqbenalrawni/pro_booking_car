import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// جلب جميع الحجوزات مع بيانات السيارة والمستخدم
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        car: true,
        user: {
          select: { id: true, name: true, email: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ message: 'خطأ أثناء جلب الحجوزات', error: error?.message }, { status: 500 });
  }
}

// إضافة حجز جديد
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, carId, pickupDate, returnDate, pickupLocation, totalPrice } = data;
    if (!userId || !carId || !pickupDate || !returnDate || !pickupLocation || !totalPrice) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    // تحقق من وجود المستخدم
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }
    // تحقق من وجود السيارة
    const car = await prisma.car.findUnique({ where: { id: Number(carId) } });
    if (!car) {
      return NextResponse.json({ message: 'السيارة غير موجودة' }, { status: 404 });
    }
    // تحقق من أن السيارة متاحة
    if (!car.available) {
      return NextResponse.json({ message: 'السيارة غير متاحة للحجز حالياً' }, { status: 400 });
    }
    // تحقق من عدم وجود حجز متداخل لنفس السيارة
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId: Number(carId),
        OR: [
          {
            pickupDate: { lte: new Date(returnDate) },
            returnDate: { gte: new Date(pickupDate) }
          }
        ]
      }
    });
    if (overlappingBooking) {
      return NextResponse.json({ message: 'السيارة محجوزة بالفعل في الفترة المحددة' }, { status: 400 });
    }
    // إنشاء الحجز
    const booking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        carId: Number(carId),
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupLocation,
        totalPrice: Number(totalPrice),
      },
    });
    return NextResponse.json({ message: 'تم الحجز بنجاح', booking });
  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ message: 'خطأ أثناء إضافة الحجز', error: error?.message, details: error }, { status: 500 });
  }
}

