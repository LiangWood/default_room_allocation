import { useState, useEffect, useMemo } from "react";
import CustomInputNumber from "./CustomInputNumber";
import { getDefaultRoomAllocation } from "../utils/roomAllocation";

const RoomAllocation = ({ guest, rooms, onChange }) => {
  const totalAdults = Number(guest.adult) || 0;
  const totalChildren = Number(guest.child) || 0;
  const initialAllocations = getDefaultRoomAllocation(guest, rooms);

  const initialAdultsAllocated = useMemo(() => {
    return initialAllocations.reduce(
      (sum, room) => sum + (Number(room.adults) || 0),
      0
    );
  }, [initialAllocations]);

  const initialChildrenAllocated = useMemo(() => {
    return initialAllocations.reduce(
      (sum, room) => sum + (Number(room.children) || 0),
      0
    );
  }, [initialAllocations]);

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

    setRemainingAdults(Math.max(totalAdults - initialAdultsAllocated, 0));
    setRemainingChildren(Math.max(totalChildren - initialChildrenAllocated, 0));
  }, [guest, rooms, totalAdults, totalChildren]);

  const getValidatedValue = (index, type, value) => {
    const newValue = Math.max(0, value);
    const allocation = allocations[index];
    const previousValue = Number(allocation[type]) || 0;
    const remainingCount =
      type === "adults" ? remainingAdults : remainingChildren;
    const otherTypeCount =
      type === "adults" ? allocation.children : allocation.adults;
    const maxValidValue = getValidMax(allocation.capacity, otherTypeCount);

    if (newValue > maxValidValue || newValue > remainingCount + previousValue) {
      return 1;
    }

    return newValue;
  };

  const handleAllocationChange = (index, type, value) => {
    let newValue = getValidatedValue(index, type, value);
    const newAllocations = [...allocations];
    const previousValue = Number(newAllocations[index][type]) || 0;
    const delta = newValue - previousValue;

    if (type === "adults") {
      if (newValue > remainingAdults + previousValue) {
        newValue = 1;
      }
      setRemainingAdults((prev) => Math.max(prev - delta, 0));
    } else {
      if (newValue > remainingChildren + previousValue) {
        newValue = 0;
      }
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
        ({ roomPrice, adultPrice, childPrice, ...rest }) => rest
      )
    );
  };

  const handleBlur = (index, type) => {
    const newValue = Number(allocations[index][type]) || 1;
    const validatedValue = getValidatedValue(index, type, newValue);
    handleAllocationChange(index, type, validatedValue);
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
                min={1}
                max={getValidMax(allocation.capacity, allocation.children)}
                step={1}
                name={`adults-${index}`}
                value={Number(allocation.adults) || 1}
                onChange={(e) =>
                  handleAllocationChange(
                    index,
                    "adults",
                    parseInt(e.target.value, 10) || 1
                  )
                }
                onBlur={(e) => handleBlur(index, "adults")}
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
                onBlur={(e) => handleBlur(index, "children")}
                disableMinus={
                  remainingChildren <= 0 && allocation.children === 0
                }
                disablePlus={remainingChildren <= 0}
                disabled={totalChildren === 0}
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
