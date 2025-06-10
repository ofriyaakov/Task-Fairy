interface RectangleDataProps {
  title: string;
  subtitle?: string;
  value: number;
  color?: string;
  width?: string;
}

const RectangleData: React.FC<RectangleDataProps> = ({
  title,
  value,
  color,
  subtitle,
  width,
}) => {
  let calculatedColor = color || "#ffffff";

  return (
    <div
      style={{
        backgroundColor: calculatedColor,
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0px 2px 20px 0px rgba(0, 0, 0, 0.1)",
        border: "1px solid #E5E5E5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "7vh",
        minWidth: width || "15vw",
      }}
    >
      <div style={{ fontSize: "28px", fontWeight: "bold" }}>{value}</div>
      <div style={{ marginTop: "10px", color: "#1E1E1E", fontSize: "18px" }}>
        {title}
      </div>
      <div style={{ color: "#999", fontSize: "14px" }}>
        {subtitle && subtitle}
      </div>
    </div>
  );
};

export default RectangleData;
