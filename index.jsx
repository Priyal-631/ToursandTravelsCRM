import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";

export default function Dashboard() {

  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function load() {
      try {
        const data = await getCustomers({});
        setCustomers(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }

    load();

  }, []);

  return (
    <div style={{ padding: 30 }}>

      <h2>Customers (test)</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {customers.length === 0 && !error && <p>No data</p>}

      {customers.map(c => (
        <div key={c.id}>
          {c.full_name || c.name || c.id}
        </div>
      ))}

    </div>
  );
}