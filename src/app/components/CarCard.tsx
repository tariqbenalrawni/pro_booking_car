import Image from 'next/image';
import { Car } from '@/models/car';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
}

export default function CarCard({ car, onSelect }: CarCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" onClick={() => onSelect(car)}>
      <div className="w-full h-64">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          width={800}
          height={300}
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6">
        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {car.make} {car.model} ({car.year})
        </div>
        <div className="text-xl font-semibold text-green-600 dark:text-green-400">
          ${car.pricePerDay}/يوم
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {car.features.map((feature, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          ))}
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          احجز الآن
        </button>
      </div>
    </div>
  );
}
