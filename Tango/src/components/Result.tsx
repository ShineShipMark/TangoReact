import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCounter, useCorrrectCount } from "../App";
import { Box } from "@mui/material";

interface State {
  correctAnswer: string;
  judg: boolean;
  counter: number;
  correctCount: number;
  clickFunc: () => void;
}

function Show({
  correctAnswer,
  judg,
  counter,
  correctCount,
  clickFunc,
}: State) {
  return (
    <Box>
      <Box sx={{ fontSize: "40px" }}>{judg ? "正解" : "不正解"}</Box>
      {!judg && (
        <Box sx={{ fontSize: "40px", font: "red" }}>
          正しい答えは「{correctAnswer}」です
        </Box>
      )}
      {counter == 0 ? (
        <Box sx={{ fontSize: "40px" }}>{correctCount}問正解</Box>
      ) : (
        <Link style={{ marginLeft: "25px", fontSize: "30px" }} to="/Tests">
          次の問題へ
        </Link>
      )}

      <Link
        onClick={() => clickFunc}
        style={{ marginLeft: "25px", fontSize: "30px" }}
        to="/Home"
      >
        ホーム画面へ
      </Link>
    </Box>
  );
}

export const Result: FC = () => {
  const location = useLocation();
  const { counter, setCounter } = useCounter();
  const { correctCount, setCorrectCount } = useCorrrectCount();
  const { correctAnswer, judg } = location.state as State;

  const Set = () => {
    setCorrectCount(0);
    setCounter(0);
  };

  return (
    <Box>
      <Show
        correctAnswer={correctAnswer}
        judg={judg}
        counter={counter}
        correctCount={correctCount}
        clickFunc={Set}
      />
    </Box>
  );
};
