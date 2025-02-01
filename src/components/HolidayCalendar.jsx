import React, { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const holidays = {
  "2025-01": [
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-26", name: "Republic Day" },
  ],
  "2025-02": [
    { date: "2025-02-14", name: "Valentine's Day" },
  ],
  "2025-03": [
    { date: "2025-03-08", name: "International Women's Day" },
    { date: "2025-03-17", name: "St. Patrick's Day" },
  ],
};

const HolidayCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const formattedMonth = format(currentMonth, "yyyy-MM");

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {/* Holiday List */}
      <div>
        {holidays[formattedMonth] ? (
          holidays[formattedMonth].map((holiday, index) => (
            <div key={index} className="p-4 mb-2 bg-indigo-100 rounded-lg">
              <p className="text-lg font-medium">{holiday.name}</p>
              <p className="text-gray-600">{format(new Date(holiday.date), "dd MMMM yyyy")}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No holidays this month.</p>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;
