import { useState, useEffect } from "react";
import CustomInputNumber from "./CustomInputNumber";
import { getDefaultRoomAllocation } from "../utils/roomAllocation";

const RoomAllocation = ({ guest, rooms, onChange }) => {
  const totalAdults = Number(guest.adult) || 0;
  const totalChildren = Number(guest.child) || 0;
  const initialAllocations = getDefaultRoomAllocation(guest, rooms);

  const initialAdultsAllocated = initialAllocations.reduce(
    (sum, room) => sum + (Number(room.adults) || 0),
    0
  );
  const initialChildrenAllocated = initialAllocations.reduce(
    (sum, room) => sum + (Number(room.children) || 0),
    0
  );

  const [allocations, setAllocations] = useState(initialAllocations);
  const [remainingAdults, setRemainingAdults] = useState(
    Math.max(totalAdults - initialAdultsAllocated, 0)
  );
  const [remainingChildren, setRemainingChildren] = useState(
    Math.max(totalChildren - initialChildrenAllocated, 0)
  );

  useEffect(() => {
    const newAllocations = getDefaultRoomAllocation(guest, rooms);
    setAllocations(newAllocations);

    const adultsAllocated = newAllocations.reduce(
      (sum, room) => sum + (Number(room.adults) || 0),
      0
    );
    const childrenAllocated = newAllocations.reduce(
      (sum, room) => sum + (Number(room.children) || 0),
      0
    );

    setRemainingAdults(Math.max(totalAdults - adultsAllocated, 0));
    setRemainingChildren(Math.max(totalChildren - childrenAllocated, 0));

    onChange(
      newAllocations.map(
        ({ roomPrice, adultPrice, childPrice, ...rest }) => rest
      )
    );
  }, [guest, rooms, onChange, totalAdults, totalChildren]);

  const handleAllocationChange = (index, type, value) => {
    const newValue = Math.max(0, value); // 確保值不能為負數
    const newAllocations = [...allocations];
    const previousValue = Number(newAllocations[index][type]) || 0;
    const delta = newValue - previousValue;

    if (type === "adults") {
      setRemainingAdults((prev) => Math.max(prev - delta, 0));
    } else {
      setRemainingChildren((prev) => Math.max(prev - delta, 0));
    }

    newAllocations[index][type] = newValue;
    newAllocations[index].price =
      newAllocations[index].roomPrice +
      (Number(newAllocations[index].adults) || 0) *
        newAllocations[index].adultPrice +
      (Number(newAllocations[index].children) || 0) *
        newAllocations[index].childPrice;

    setAllocations(newAllocations);
    onChange(
      newAllocations.map(
        ({ roomPrice, adultPrice, childPrice, capacity, ...rest }) => rest
      )
    );
  };

  const handleBlur = (index, type, event) => {
    const newValue = parseInt(event.target.value, 10) || 0;
    handleAllocationChange(index, type, newValue);
  };

  const getValidMax = (capacity, otherTypeCount) => {
    const max = capacity - otherTypeCount;
    return Number.isNaN(max) || max < 0 ? 0 : max;
  };

  return (
    <div className="container max-w-[400px]">
      <div className="text-lg font-semibold mb-4">
        住客人數：{totalAdults} 位大人，{totalChildren} 位小孩 /{" "}
        {allocations.length} 房
      </div>
      <div className="bg-blue-100 border border-blue-300 text-gray-600 p-2 rounded mb-4">
        尚未分配人數：{remainingAdults} 位大人，{remainingChildren} 位小孩
      </div>
      {allocations.map((allocation, index) => (
        <div key={index}>
          <div className="mb-2 text-lg font-semibold">
            房間：{allocation.adults + allocation.children} 人
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <div className="text-sm font-medium">大人</div>
              <div className="text-xs text-gray-500">年齡 20+</div>
            </div>
            <div className="flex items-center space-x-2">
              <CustomInputNumber
                min={1} // 設置最小值為1
                max={getValidMax(allocation.capacity, allocation.children)}
                step={1}
                name={`adults-${index}`}
                value={Number(allocation.adults) || 1} // 初始化為1
                onChange={(e) =>
                  handleAllocationChange(
                    index,
                    "adults",
                    parseInt(e.target.value, 10) || 1
                  )
                }
                onBlur={() => {}}
                disableMinus={remainingAdults <= 0 && allocation.adults === 1}
                disablePlus={remainingAdults <= 0}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm font-medium">小孩</div>
            </div>
            <div className="flex items-center space-x-2">
              <CustomInputNumber
                min={0}
                max={getValidMax(allocation.capacity, allocation.adults)}
                step={1}
                name={`children-${index}`}
                value={Number(allocation.children) || 0}
                onChange={(e) =>
                  handleAllocationChange(
                    index,
                    "children",
                    parseInt(e.target.value, 10) || 0
                  )
                }
                onBlur={() =>
                  handleBlur(
                    index,
                    "children",
                    parseInt(e.target.value, 10) || 0
                  )
                }
                disableMinus={
                  remainingChildren <= 0 && allocation.children === 0
                }
                disablePlus={remainingChildren <= 0}
              />
            </div>
          </div>
          {index < allocations.length - 1 && (
            <div className="border-b border-gray-300 my-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomAllocation;
