import { LoaderCircle } from 'lucide-react';
import React from 'react';

function CustomLoader({styles}:{styles: string}) {
  return (
    <div className={`flex items-center justify-center bg-slate-800 ${styles}`}>
      <div className="rounded-full p-3 bg-gray-700">
        <LoaderCircle 
          style={{ animation: 'spin 0.7s linear infinite' }} 
          className="h-5 w-5 text-red-500"
        />
      </div>  
    </div>
  );
}

export default CustomLoader;
