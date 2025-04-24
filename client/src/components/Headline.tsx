import { Box, Typography } from "@mui/material";

interface HeadlineProps {
  color: string;
  title: string;
}

const Headline: React.FC<HeadlineProps> = ({ color, title }) => (
  <Box
    sx={{
      backgroundColor: `${color}`,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      px: 2,
      py: 1,
      textAlign: "center",
    }}>
    <Typography
      variant='h6'
      sx={{
        fontWeight: "700",
        textTransform: "lowercase", // optional, if you want "create new task" like in your image
      }}>
      {title}
    </Typography>
  </Box>
);

export default Headline;
