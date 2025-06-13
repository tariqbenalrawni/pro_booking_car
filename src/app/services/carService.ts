import { Car } from '../models/car';

export class CarService {
  private static instance: CarService;
  private cars: Car[];

  private constructor() {
    this.cars = [
      {
        id: '1',
        make: 'تويوتا',
        model: 'كامري',
        year: 2023,
        pricePerDay: 100,
        imageUrl: '/cars/toyota-camry.jpg',
        features: ['أوتوماتيك', 'مكيف', 'نظام توجيه'],
        description: 'سيارة مودرن ذات كفاءة عالية في استهلاك الوقود',
        available: true
      },
      {
        id: '2',
        make: 'هوندا',
        model: 'سيفيك',
        year: 2022,
        pricePerDay: 90,
        imageUrl: '/cars/honda-civic.jpg',
        features: ['يدوي', 'مكيف', 'بلوتوث'],
        description: 'سيارة رياضية واقتصادية في استهلاك الوقود',
        available: true
      }
    ];
  }

  public static getInstance(): CarService {
    if (!CarService.instance) {
      CarService.instance = new CarService();
    }
    return CarService.instance;
  }

  getAllCars(): Car[] {
    return this.cars;
  }

  getCarById(id: string): Car | undefined {
    return this.cars.find(car => car.id === id);
  }

  updateCarAvailability(id: string, available: boolean): void {
    const car = this.cars.find(car => car.id === id);
    if (car) {
      car.available = available;
    }
  }
}
