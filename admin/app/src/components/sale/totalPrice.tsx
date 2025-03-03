"use client";


export default function TotalPrice() {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-4 space-y-3">
      <div className="bg-black text-white font-semibold text-right p-3 rounded-md text-lg">
        ฿0.00
      </div>

      <div className="flex flex-col items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm space-y-2">
        <div>
          <h5 className="text-lg font-semibold text-gray-800">Food name</h5>
          <p className="text-gray-600 text-sm">100 x 2 = ฿200</p>
        </div>

        <div className="flex space-x-2 mt-3 sm:mt-0">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
