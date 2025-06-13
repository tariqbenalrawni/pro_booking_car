import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// جلب جميع السيارات
export async function GET() {
  try {
    const cars = await prisma.car.findMany();
    // تحويل features من نص JSON إلى مصفوفة
    const carsWithFeatures = cars.map(car => ({
      ...car,
      features: JSON.parse(car.features || '[]'),
    }));
    return NextResponse.json(carsWithFeatures);
  } catch (error) {
    return NextResponse.json({ message: 'خطأ أثناء جلب السيارات', error: error?.message }, { status: 500 });
  }
}

// إضافة سيارة جديدة
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { make, model, year, pricePerDay, imageUrl, features } = data;
    if (!make || !model || !year || !pricePerDay || !imageUrl) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 });
    }
    const newCar = await prisma.car.create({
      data: {
        make,
        model,
        year: Number(year),
        pricePerDay: Number(pricePerDay),
        imageUrl,
        features: JSON.stringify(features || []),
      },
    });
    return NextResponse.json(newCar);
  } catch (error) {
    return NextResponse.json({ message: 'خطأ أثناء إضافة السيارة', error: error?.message }, { status: 500 });
  }
}
