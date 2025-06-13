import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // لا ترجع كلمة المرور
    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: error?.message }, { status: 500 });
  }
}
