import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.car.deleteMany();
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='Car'`;
  await prisma.car.createMany({
    data: [
      {
        make: 'تويوتا',
        model: 'كامري',
        year: 2023,
        pricePerDay: 100,
        imageUrl: '/cars/toyota-camry.jpg',
        features: JSON.stringify(['أوتوماتيك', 'مكيف', 'نظام توجيه']),
        
        
      },
      {
        make: 'هوندا',
        model: 'سيفيك',
        year: 2022,
        pricePerDay: 90,
        imageUrl: '/cars/honda-civic.jpg',
        features: JSON.stringify(['يدوي', 'مكيف', 'بلوتوث']),
        
        
      },
      {
        make: 'هيونداي',
        model: 'سوناتا',
        year: 2021,
        pricePerDay: 85,
        imageUrl: '/cars/hyundai-sonata.jpg',
        features: JSON.stringify(['أوتوماتيك', 'شاشة', 'مكيف']),
        
        
      },
      {
        make: 'كيا',
        model: 'سبورتاج',
        year: 2024,
        pricePerDay: 120,
        imageUrl: '/cars/kia-sportage.jpg',
        features: JSON.stringify(['دفع رباعي', 'شاشة', 'مكيف']),
        
        
      },
      {
        make: 'نيسان',
        model: 'التيما',
        year: 2020,
        pricePerDay: 80,
        imageUrl: '/cars/nissan-altima.jpg',
        features: JSON.stringify(['أوتوماتيك', 'بلوتوث', 'مكيف']),
        
        
      },
      {
        make: 'شيفروليه',
        model: 'ماليبو',
        year: 2019,
        pricePerDay: 70,
        imageUrl: '/cars/chevrolet-malibu.jpg',
        features: JSON.stringify(['أوتوماتيك', 'شاشة', 'مكيف']),
        
        
      },
      {
        make: 'فورد',
        model: 'توروس',
        year: 2023,
        pricePerDay: 110,
        imageUrl: '/cars/ford-taurus.jpg',
        features: JSON.stringify(['أوتوماتيك', 'تحكم ذكي', 'مكيف']),
        
        
      },
      {
        make: 'مرسيدس',
        model: 'E200',
        year: 2022,
        pricePerDay: 250,
        imageUrl: '/cars/mercedes-e200.jpg',
        features: JSON.stringify(['فخامة', 'شاشة', 'مكيف']),
        
        
      },
      {
        make: 'بي ام دبليو',
        model: '520i',
        year: 2021,
        pricePerDay: 230,
        imageUrl: '/cars/bmw-520i.jpg',
        features: JSON.stringify(['فخامة', 'شاشة', 'مكيف']),
        
        
      },
      {
        make: 'جيلي',
        model: 'امجراند',
        year: 2023,
        pricePerDay: 75,
        imageUrl: '/cars/geely-emgrand.jpg',
        features: JSON.stringify(['أوتوماتيك', 'مكيف', 'بلوتوث']),
        
        
      }
    ]
  });
  console.log('تمت إضافة السيارات بنجاح!');
}

main().finally(() => prisma.$disconnect());
