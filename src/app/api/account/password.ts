import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// تحديث كلمة مرور المستخدم
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, currentPassword, newPassword } = data;
    if (!id || !currentPassword || !newPassword) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });
    return NextResponse.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    return NextResponse.json({ message: 'حدث خطأ أثناء تحديث كلمة المرور', error: error?.message }, { status: 500 });
  }
}
