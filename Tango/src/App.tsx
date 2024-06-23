import { Box } from "@mui/material";
import { Props } from "./components/Type";
import { Outlet, useOutletContext } from "react-router-dom";
import { useState } from "react";

type ContextProblemType = {
  problem: Props[][] | null;
  setProblem: React.Dispatch<React.SetStateAction<Props[][]>>;
};

type ContextCounterType = {
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
};

type ContextCorrectType = {
  correctCount: number;
  setCorrectCount: React.Dispatch<React.SetStateAction<number>>;
};

export const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [problem, setProblem] = useState<Props>();
  const [counter, setCounter] = useState<number>(0);
  return (
    <Box>
      <Outlet context={{ problem, setProblem, counter, setCounter }} />
    </Box>
  );
};

export const useProblem = () => {
  return useOutletContext<ContextProblemType>();
};

export const useCounter = () => {
  return useOutletContext<ContextCounterType>();
};

export const useCorrrectCount = () => {
  return useOutletContext<ContextCorrectType>();
};

export default App;
