import RectangleData from "../RectangleData";
import { getBalancePointsByGroup } from "../../queries/task";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";
import { APP_COLOR } from "../../theme";

const BalancePointsDashboard: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [avg, setAvg] = useState(0);

  const fetchGroupBalancePointsData = async () => {
    try {
      const companyId = connectedUser?.companyId || 0;
      const data = await getBalancePointsByGroup(companyId);
      setMax(data.max);
      setMin(data.min);
      setAvg(data.avg);
    } catch (error) {
      console.error("Error fetching balance points:", error);
      toast.error("Oops! Something went wrong");
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
      }}>
      <RectangleData
        title='Avarage Balance Points'
        subtitle='From all employees'
        value={avg}
        color={APP_COLOR.ALICE_BLUE_DARKER}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}>
        <RectangleData
          title='Max Balance Points'
          subtitle='For employee'
          value={max}
          color={APP_COLOR.MINT_GREEN}
        />
        <RectangleData
          title='Min Balance Points'
          subtitle='For employee'
          value={min}
          color={APP_COLOR.LIGHT_RED}
        />
      </div>
    </div>
  );
};

export default BalancePointsDashboard;
