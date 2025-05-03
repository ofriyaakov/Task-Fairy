import BalancePoints from "../BalancePoints";
import { getBalancePointsByGroup } from "../../queries/task";
import React, { useEffect } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";

const BalancePointsDashboard: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const [max, setMax] = React.useState(0);
  const [min, setMin] = React.useState(0);
  const [avg, setAvg] = React.useState(0);

  const fetchData = async () => {
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
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <BalancePoints title="Avarage Balance" value={avg} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <BalancePoints title="Max Balance" value={max} />
        <BalancePoints title="Min Balance" value={min} />
      </div>
    </div>
  );
};

export default BalancePointsDashboard;
