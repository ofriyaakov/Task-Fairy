import { Box, Stack, Typography } from "@mui/material";
import SwapRequestCard from "../../components/SwapRequestCard";
import { SwapRequest } from './../../types/Swap';
import { getAllPendingSwapRequests } from './../../queries/swapRequests'
import { useEffect, useState } from "react";

const ManagerSwapsPage: React.FC = () => {

  const [pendingSwapRequests, setPendingSwapRequest] = useState<SwapRequest[]>([])

  const fetchPendingSwapRequests = async () => {
    try {
      const fetchedPendingSwapRequests: SwapRequest[] = await getAllPendingSwapRequests();
      setPendingSwapRequest(fetchedPendingSwapRequests)
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPendingSwapRequests();
  }, []);

  return (
    <div className='App' style={{ height: "95%" }}>
      <Typography sx={{ fontWeight: 650, fontSize: "1.5rem", display: "flex" }}>
        Pending Swaps
      </Typography>
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 2,
          bgcolor: "rgb(250 250 250)",
          height: "100%",
          borderRadius: "24px"
        }}>
        <Stack
          spacing={2}
          sx={{ overflowY: "auto", overflowX: "hidden", height: "80vh", }}>
          {pendingSwapRequests.map((swapRequest) => (
            <SwapRequestCard leftDetails={swapRequest.leftDetails} rightDetails={swapRequest.rightDetails} />
          ))}
        </Stack>
      </Box>
    </div>)
};

export default ManagerSwapsPage;
