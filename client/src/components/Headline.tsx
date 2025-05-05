import { Box, Typography } from "@mui/material";

interface HeadlineProps {
  color: string;
  title: string;
}

const Headline: React.FC<HeadlineProps> = ({ color, title }) => (
  <Box
    sx={{
      backgroundColor: `${color}`,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      px: 2,
      py: 1,
      textAlign: "center",
    }}>
    <Typography
      variant='h6'
      sx={{
        fontWeight: "700",
      }}>
      {title}
    </Typography>
  </Box>
);

export default Headline;
