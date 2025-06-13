import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, password, phone, licenseNumber } = data;

    // تحقق من وجود جميع البيانات المطلوبة
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    // تحقق من عدم وجود بريد إلكتروني مكرر
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || '',
        licenseNumber: licenseNumber || '',
      },
    });

    return NextResponse.json({ message: 'تم إنشاء الحساب بنجاح', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ message: 'حدث خطأ أثناء إنشاء الحساب', error: error?.message }, { status: 500 });
  }
}
