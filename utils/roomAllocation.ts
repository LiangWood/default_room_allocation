export const getDefaultRoomAllocation = (guest, rooms) => {
    const { adult, child } = guest;
    const allocations = rooms.map(room => ({
        ...room,
        adults: 0,
        children: 0,
        price: room.roomPrice,
        capacity: room.capacity
    }));

    let remainingAdults = adult;
    let remainingChildren = child;

    // 先分配每間房至少一位大人
    for (let allocation of allocations) {
        if (remainingAdults > 0) {
            allocation.adults++;
            remainingAdults--;
            allocation.price += allocation.adultPrice;
        }
    }

    // 分配小孩
    // for (let allocation of allocations) {
    //     while (remainingChildren > 0 && allocation.children < allocation.capacity) {
    //         allocation.children++;
    //         remainingChildren--;
    //         allocation.price += allocation.childPrice;
    //     }
    // }

    // 分配剩餘的大人
    // for (let allocation of allocations) {
    //     while (remainingAdults > 0 && (allocation.adults + allocation.children) < allocation.capacity) {
    //         allocation.adults++;
    //         remainingAdults--;
    //         allocation.price += allocation.adultPrice;
    //     }
    // }

    // 檢查是否所有人都分配
    // if (remainingAdults > 0 || remainingChildren > 0) {
    //     return []; // 如果無法都分配到，則返回空陣列
    // }
    return allocations;
};