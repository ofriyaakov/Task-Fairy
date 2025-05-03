interface BalancePointsProps {
  title: string;
  subtitle?: string;
  value: number;
  color?: string;
}

const BalancePoints: React.FC<BalancePointsProps> = ({
  title,
  value,
  color,
  subtitle,
}) => {
  let calculatedColor = "#FFFFFF";

  if (color) {
    calculatedColor = color;
  } else {
    if (title.toUpperCase().includes("MAX")) {
      calculatedColor = "#E1F7EF";
    } else if (title.toUpperCase().includes("MIN")) {
      calculatedColor = "#FFDFDF";
    } else if (title.toUpperCase().includes("AVARAGE")) {
      calculatedColor = "#DDEEFB";
    }
  }

  return (
    <div
      style={{
        backgroundColor: calculatedColor,
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "10vh",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</div>
      <div style={{ marginTop: "10px", color: "#666", fontSize: "18px" }}>
        {title}
      </div>
      <div style={{ color: "#999", fontSize: "14px" }}>
        {subtitle && subtitle}
      </div>
    </div>
  );
};

export default BalancePoints;
