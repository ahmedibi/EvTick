import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventTypes } from "../../redux/slices/eventSlice";

export default function Home() {
  const dispatch = useDispatch();


  const { types: eventTypes, loading } = useSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEventTypes());
  }, [dispatch]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {eventTypes.map(type => (
        <div key={type.id} className="border rounded shadow">
          <img
            src={type.photo}
            alt={type.type}
            className="w-full h-96 object-cover mb-2"
          />

          <div className="px-6">
            <h2 className="text-xl font-bold text-green-500">{type.type}</h2>
            <p className="text-gray-600">{type.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
