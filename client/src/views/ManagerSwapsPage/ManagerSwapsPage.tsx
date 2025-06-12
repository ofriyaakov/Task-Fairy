import { Box, Grid, Stack, Typography } from "@mui/material";
import SwapRequestCard from "../../components/SwapRequestCard";
import { SwapRequest, SwapRequestStatus } from "./../../types/Swap";
import {
  getAllPendingSwapRequests,
  updateSwapRequestStatus,
} from "./../../queries/swapRequests";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";
import Search from "../../components/Search";

const ManagerSwapsPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();
  const [pendingSwapRequests, setPendingSwapRequest] = useState<SwapRequest[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredPendingSwapRequests = pendingSwapRequests.filter(
    (pendingSwapRequest) =>
      pendingSwapRequest.leftDetails.taskName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      pendingSwapRequest.rightDetails.taskName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const updateSwapStatus = async (
    swapRequestId: string,
    status: SwapRequestStatus
  ) => {
    try {
      await updateSwapRequestStatus(swapRequestId, status);
      await fetchPendingSwapRequests();
      toast.success("Swap updated successfully!");
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to update swap");
    }
  };

  const fetchPendingSwapRequests = async () => {
    try {
      const companyId = connectedUser?.companyId || 0;
      const fetchedPendingSwapRequests: SwapRequest[] =
        await getAllPendingSwapRequests(+companyId);
      setPendingSwapRequest(fetchedPendingSwapRequests);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPendingSwapRequests();
  }, []);

  return (
    <div
      className='App'
      style={{ height: "89vh", display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          fontWeight: 650,
          fontSize: "1.5rem",
          display: "flex",
        }}>
        Pending Swaps
      </Typography>
      <Box
        className='App'
        style={{ display: "flex", justifyContent: "center" }}>
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          width='40%'
        />
      </Box>
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 2,
          bgcolor: "rgb(250 250 250)",
          height: "80%",
          borderRadius: "24px",
          overflowY: "auto",
        }}>
        <Grid container spacing={2}>
          {filteredPendingSwapRequests.map((swapRequest, index) => (
            <Grid item xs={12} md={6} key={index}>
              <SwapRequestCard
                leftDetails={swapRequest.leftDetails}
                rightDetails={swapRequest.rightDetails}
                swapRequestId={swapRequest.swapRequestId}
                onApprove={() =>
                  updateSwapStatus(
                    swapRequest.swapRequestId,
                    SwapRequestStatus.Approved
                  )
                }
                onReject={() =>
                  updateSwapStatus(
                    swapRequest.swapRequestId,
                    SwapRequestStatus.Denied
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default ManagerSwapsPage;
