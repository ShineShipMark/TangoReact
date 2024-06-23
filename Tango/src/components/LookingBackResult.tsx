import { Box } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

export const LookingBackResult: FC = () => {
  const location = useLocation();
  const { result, nextProblemsArray, answer } = location.state;

  if (nextProblemsArray.length != 0) {
    if (result == "correct") {
      return (
        <Box>
          <Box>正解</Box>
          <Link to="/LookingBack" state={{ problemsArray: nextProblemsArray }}>
            次の問題へ
          </Link>
        </Box>
      );
    } else {
      return (
        <Box>
          <Box>不正解</Box>
          <Box>正解は「{answer}」</Box>
          <Link to="/LookingBack">次の問題へ</Link>
        </Box>
      );
    }
  } else {
    if (result == "correct") {
      return (
        <Box>
          <Box>不正解</Box>
          <Link to="/LookingBack">次の問題へ</Link>
        </Box>
      );
    } else {
      return (
        <Box>
          <Box>不正解</Box>
          <Link to="/Home">本日の復習は終了です</Link>
        </Box>
      );
    }
  }
};
