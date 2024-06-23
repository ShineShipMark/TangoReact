import { Box, Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//復習問題に関する型定義
interface LookingProps {
  problemArray: Props[][];
  isPacked: boolean;
}

//非同期通信で得るデータの型を定義
interface Props {
  id: number;
  problem: string;
  answer: string;
  p_number: number;
  a_number: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Looking({ problemArray, isPacked }: LookingProps): JSX.Element {
  return (
    <Box>
      {isPacked ? (
        <Link
          to="/Api"
          state={{ problemArray: problemArray, kinds: "lookingBack" }}
        >
          今日の復習
        </Link>
      ) : (
        <Box>今日の復習項目はありません</Box>
      )}
    </Box>
  );
}

export const Home: FC = () => {
  const [judg, setJudg] = useState<boolean>();
  const [resJson, setResJson] = useState<Props[][]>();
  const [resJsonLooking, setResJsonLooking] = useState<Props[][]>();

  useEffect(() => {
    const fetchData = async (): Promise<Props[]> => {
      //非同期通信で結果を取得(普通の問題用)
      const result = await fetch("http://192.168.11.8:2022/api");
      const resultJson: Props[][] = await result.json();

      //非同期通信で結果を取得(復習の問題用)
      const resultLooking = await fetch("http://192.168.11.8:2022/looking");
      const resultJsonLooking: Props[][] = await resultLooking.json();

      //普通の問題の結果を格納
      setResJson(resultJson);

      //復習用の問題が存在するかどうかで、レンダリングのための判定変数とusestate変数を操作
      if (resultJsonLooking[0].length == 0) {
        setJudg(false);
        return [];
      } else {
        setJudg(true);
        setResJsonLooking(resultJsonLooking);
        return resultJsonLooking[0];
      }
    };
    //非同期通信の関数を実行
    fetchData();
  }, []);
  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Link
            to="/Api"
            style={{ fontSize: "45px" }}
            state={{ nextProblemArray: resJson, kinds: "normal" }}
          >
            問題開始
          </Link>
          <Looking
            isPacked={judg as boolean}
            problemArray={resJsonLooking as Props[][]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
