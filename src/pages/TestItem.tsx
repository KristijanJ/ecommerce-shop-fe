import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import type { TestItem as TestItemType } from "../types/TestItem";

// Temporary components, just for testing
const TestItem = () => {
  const [items, setItems] = useState<TestItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendPort = import.meta.env.VITE_BACKEND_PORT;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://${backendUrl}:${backendPort}/test-items`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setItems(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [backendUrl, backendPort]);

  return (
    <div>
      <Hero />
      <section className="py-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Test Items
          </h1>

          {loading && <p className="text-center">Loading items...</p>}

          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {!loading && !error && items.length === 0 && (
            <p className="text-center">No items found.</p>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-7.5 max-w-sm mx-auto md:max-w-none md:mx-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold">Item #{item.id}</h3>
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestItem;
