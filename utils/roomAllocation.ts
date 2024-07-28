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
    return allocations;
};