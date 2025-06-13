import Image from 'next/image';
import { Car } from '@/models/car';

interface ModernCarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
}

export default function ModernCarCard({ car, onSelect }: ModernCarCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onClick={() => onSelect(car)}
    >
      <div className="aspect-w-16 aspect-h-9">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          className="object-cover transform transition-transform duration-300 group-hover:scale-110"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">{car.make}</span>
            <span className="text-xl text-gray-600">{car.model}</span>
          </div>
          <div className="text-2xl font-bold text-green-600">${car.pricePerDay}/يوم</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {car.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="text-gray-600 mb-6 line-clamp-2">{car.description}</div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          احجز الآن
        </button>
      </div>
    </div>
  );
}
