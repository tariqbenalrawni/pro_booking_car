import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

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
