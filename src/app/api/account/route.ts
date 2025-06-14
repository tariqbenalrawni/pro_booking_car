import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth/options';

interface UserWithBookings {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bookings: {
    id: number;
    createdAt: Date;
    car: {
      name: string;
      model: string;
    };
  }[];
}

// الحصول على بيانات الحساب
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مسموح' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        licenseNumber: true,
        bookings: {
          select: {
            id: true,
            createdAt: true,
            car: {
              select: {
                make: true,
                model: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'لم يتم العثور على المستخدم' }, { status: 404 });
    }

    const accountData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      licenseNumber: user.licenseNumber,
      bookingCount: user.bookings.length,
      lastBookingDate: user.bookings.length > 0 ? user.bookings[0].createdAt : null
    };

    return NextResponse.json(accountData);
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب بيانات الحساب' }, { status: 500 });
  }
}

// تحديث بيانات المستخدم
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name, email, phone, licenseNumber } = data;

    if (!id || !name || !email) {
      return NextResponse.json({ message: 'جميع الحقول المطلوبة' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone: phone || '',
        licenseNumber: licenseNumber || '',
      },
    });

    return NextResponse.json({ message: 'تم تحديث البيانات بنجاح', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: 'حدث خطأ أثناء تحديث البيانات', error: error?.message }, { status: 500 });
  }
}
