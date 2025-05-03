import BalancePoints from "../BalancePoints";
import { getBalancePointsByGroup } from "../../queries/task";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";

const BalancePointsDashboard: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);

  const fetchGroupBalancePointsData = async () => {
    try {
      const groupId = connectedUser?.groupId || "0";
      const data = await getBalancePointsByGroup(groupId);
      setMax(data.max);
      setMin(data.min);
      setAvg(data.avg);
    } catch (error) {
      console.error("Error fetching balance points:", error);
    }
  };

  useEffect(() => {
    fetchGroupBalancePointsData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <BalancePoints
        title="Avarage Balance Points"
        subtitle="From all employees"
        value={avg}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <BalancePoints
          title="Max Balance Points"
          subtitle="For employee"
          value={max}
        />
        <BalancePoints
          title="Min Balance Points"
          subtitle="For employee"
          value={min}
        />
      </div>
    </div>
  );
};

export default BalancePointsDashboard;
