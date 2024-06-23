import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface propsArray {
  problemArray: Props[][];
}

//非同期通信で得るデータの型を定義
interface Props {
  id: number;
  problem: string;
  answer: string;
  p_number: number;
  a_number: string;
}

//正しい解答を記録しておくための型定義
interface Correct {
  idNum: number;
  correctProblem: string;
  correctAnswer: string;
}

interface buttonType {
  x: Props;
  correctProblem: string;
  nextProblemsArray: Props[][];
  judg: boolean;
}

function Buttons({
  x,
  correctProblem,
  nextProblemsArray,
  judg,
}: buttonType): JSX.Element {
  return (
    <Button
      data-button-key={x.id}
      variant="contained"
      sx={{ backgroundColor: "blue", ml: "40px" }}
      component={Link}
      to="/LookingBackResult"
      state={{
        result: judg ? "correct" : "incorrect",
        answer: correctProblem,
        nextProblemsArray: nextProblemsArray,
      }}
      onClick={() => (nextProblemsArray = removeData(nextProblemsArray, x.id))}
    >
      {x.answer}
    </Button>
  );
}

function removeData(array: Props[][], problemId: number) {
  const removedArray: Props[][] = array.filter((propsArray) =>
    propsArray.filter((props) => props.id != problemId)
  );
  return removedArray;
}

export const LookingBack: FC = () => {
  //Stateを得るためのuseLocation
  const location = useLocation();
  const { problemArray } = location.state as propsArray;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let corrects: Correct = {
    idNum: 0,
    correctProblem: "",
    correctAnswer: "",
  };
  let problems: Props[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let nextProblemsArray: Props[][] = [];
  const controlArray = (): void => {
    //乱数をそれぞれ定義
    const ran = Math.floor(Math.random() * problemArray[0].length);
    const ran2 = Math.floor(Math.random() * problemArray[1].length);
    const ran3 = Math.floor(Math.random() * problemArray[1].length);

    //数字配列を初期化
    const numArray: number[] = [];

    //結果の配列をforEachを回す
    problemArray[1].forEach((x) => numArray.push(x.id));
    const rejectArray = numArray.filter((x) => x != numArray[ran2]);

    corrects = {
      idNum: problemArray[0][ran].id,
      correctProblem: problemArray[0][ran].problem,
      correctAnswer: problemArray[0][ran].answer,
    };

    const correctData = problemArray[0][ran];
    const incorrectData1 = problemArray[1][numArray[ran2]];
    const incorrectData2 = problemArray[1][rejectArray[ran3]];
    problems = [correctData, incorrectData1, incorrectData2];

    shuffle(problems);

    const nextCorrects = problemArray[0].filter((x) => x != correctData);
    const nextIncorrects = problemArray[1].filter(
      (x) => x != incorrectData1 && x != incorrectData2
    );
    nextProblemsArray = [nextCorrects, nextIncorrects];
  };

  //配列をランダムに並べ替える関数
  function shuffle(array: Props[]) {
    //配列の長さに応じて繰り返し処理
    for (let i = array.length - 1; 0 < i; i--) {
      //乱数を生成
      const ranNum: number = Math.floor(Math.random() * (i + 1));
      //乱数を用いて、各変数を入れ替える(この場合はオブジェクト同士を入れ替える)
      const sortProp: Props = array[i];
      array[i] = array[ranNum];
      array[ranNum] = sortProp;
    }
    return array;
  }

  controlArray();

  return (
    <Box>
      <Box sx={{ fontSize: "35px", ml: "40px" }}>{corrects.correctProblem}</Box>
      <Stack direction="row">
        {problems.map((x) => {
          return (
            <Buttons
              x={x}
              correctProblem={corrects.correctAnswer}
              nextProblemsArray={nextProblemsArray}
              judg={x.problem == corrects.correctProblem}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
