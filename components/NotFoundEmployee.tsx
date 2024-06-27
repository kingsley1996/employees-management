import Image from 'next/image';
import emptySvg from '@/public/empty.svg';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md text-center">
        <Image src={emptySvg} alt="Not Found" className="mx-auto w-64 h-64 mb-8" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Found</h2>
        <p className="text-gray-600 mb-4">Employee not found</p>
      </div>
    </div>
  );
}
