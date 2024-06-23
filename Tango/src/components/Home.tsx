import { Box, Grid } from "@mui/material";
import { FC, useEffect } from "react";
import { Props } from "./Type";
import { useProblem, useCounter } from "../App";
import { Link } from "react-router-dom";

export const Home: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { problem, setProblem } = useProblem();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { counter, setCounter } = useCounter();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      //非同期通信で結果を取得(普通の問題用)
      const result = await fetch("http://192.168.11.3:2022/api");
      const resultJson: Props[][] = await result.json();

      //普通の問題の結果を格納
      setProblem(resultJson);
      setCounter(5);
    };
    //非同期通信の関数を実行
    fetchData();
  }, []);
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Link to="/Tests" style={{ fontSize: "45px" }}>
            問題開始
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};
