import RoomAllocation from "../components/RoomAllocation";

const Home = () => {
  const guest = { adult: 4, child: 2 };
  const rooms = [
    { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
    { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
    { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
  ];
  // const guest = { adult: 16, child: 0 };
  // const rooms = [
  //   { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  //   { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
  //   { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
  //   { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
  // ];

  const handleRoomChange = (result) => {
    console.log("room allocations: ", result);
  };

  return (
    <div className="p-4">
      <RoomAllocation guest={guest} rooms={rooms} onChange={handleRoomChange} />
    </div>
  );
};

export default Home;
