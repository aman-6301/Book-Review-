import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";
import api from "../utils/api";

export default function RatingChart({ bookId, key }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reviews/book/${bookId}/distribution`);
        // server returns { distribution: [c1,c2,c3,c4,c5] }
        const dist = res.data.distribution || [0,0,0,0,0];
        const chartData = dist.map((count, i) => ({ rating: `${i+1}★`, value: count }));
        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch rating distribution:", err.response?.data || err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [bookId, key]);

  if (loading) return <p>Loading rating chart…</p>;
  if (!data.length) return <p>No ratings yet.</p>;

  return (
    <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-2">Rating distribution</h3>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="rating" type="category" />
            <Tooltip />
            <Bar dataKey="value">
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
