import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer: '',
    rooms: [],
    services: {},
    price: '',
    description: ''
  });

  const rooms = ['Kitchen', 'Bathroom', 'Laundry', 'Basement'];
  const availableServices = [
    'Tile Installation',
    'Grouting',
    'Demolition',
    'Drywall',
    'Paint'
  ];

  const handleRoomToggle = (room) => {
    const updated = formData.rooms.includes(room)
      ? formData.rooms.filter((r) => r !== room)
      : [...formData.rooms, room];
    setFormData({ ...formData, rooms: updated });
  };

  const handleServiceChange = (room, selected) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [room]: selected
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({
      pathname: '/preview',
      query: {
        data: JSON.stringify(formData)
      }
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Work Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Customer / Project Name"
          className="w-full border p-2 rounded"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          required
        />

        <div>
          <p className="font-medium">Select Rooms:</p>
          {rooms.map((room) => (
            <label key={room} className="block">
              <input
                type="checkbox"
                checked={formData.rooms.includes(room)}
                onChange={() => handleRoomToggle(room)}
              /> {room}
            </label>
          ))}
        </div>

        {formData.rooms.map((room) => (
          <div key={room}>
            <p className="font-semibold">Services for {room}:</p>
            {availableServices.map((service) => (
              <label key={service} className="block ml-4">
                <input
                  type="checkbox"
                  checked={formData.services[room]?.includes(service) || false}
                  onChange={(e) => {
                    const current = formData.services[room] || [];
                    const updated = e.target.checked
                      ? [...current, service]
                      : current.filter((s) => s !== service);
                    handleServiceChange(room, updated);
                  }}
                /> {service}
              </label>
            ))}
          </div>
        ))}

        <input
          type="text"
          placeholder="Total Price (USD)"
          className="w-full border p-2 rounded"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <textarea
          placeholder="Additional Description"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Preview
        </button>
      </form>
    </div>
  );
}
