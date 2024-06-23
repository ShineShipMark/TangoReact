import { FC } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useProblem, useCounter, useCorrrectCount } from "../App";
import { Props, Correct } from "./Type";
import { Link } from "react-router-dom";

//ボタンコンポーネントの引数に型定義
interface ButtonType {
  x: Props;
  correctAnswer: string;
  judg: boolean;
  onClick: () => void;
}

//ボタンのコンポーネント
function Buttons({ x, correctAnswer, judg, onClick }: ButtonType): JSX.Element {
  return (
    //条件付きレンダリングで通常と復習を分ける
    <Button
      data-button-key={x.id}
      variant="contained"
      state={{
        correctAnswer: correctAnswer,
        judg: judg,
      }}
      sx={{ backgroundColor: "blue", ml: "40px" }}
      component={Link}
      to="/Result"
      onClick={() => judg && onClick}
    >
      {x.answer}
    </Button>
  );
}

export const Tests: FC = () => {
  const { problem, setProblem } = useProblem();
  const { counter, setCounter } = useCounter();
  const { correctCount, setCorrectCount } = useCorrrectCount();

  const sets = () => {
    setCorrectCount(correctCount + 1);
    setProblem([problem![0], problem![1]]);
    setCounter(counter - 1);
  };

  //正解の各変数を格納するため変数を初期化
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let corrects: Correct = {
    idNum: 0,
    correctProblem: "",
    correctAnswer: "",
  };

  //問題を格納する配列
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let problems: Props[] = [];

  const controllProblem = (): void => {
    const ran = Math.floor(Math.random() * problem![0].length);
    const ran2 = Math.floor(Math.random() * problem![1].length);
    const ran3 = Math.floor(Math.random() * problem![1].length);

    //数字配列を初期化
    const numArray: number[] = [];

    //結果の配列をforEachを回す
    problem![1].forEach((x) => {
      numArray.push(x.id);
    });

    //数字配列から乱数で選んだ要素を削除して新しい配列を定義
    const rejectArray = numArray.filter((x) => x != numArray[ran2]);

    //オブジェクトの中に正解の各要素を格納する
    corrects = {
      idNum: problem![0][ran].id,
      correctProblem: problem![0][ran].problem,
      correctAnswer: problem![0][ran].answer,
    };

    //正解のオブジェクトの中からランダムに1つを取り出して変数に格納し、残りは誤解答の配列からランダムに取り出す
    const correctData = problem![0][ran];
    const incorrectData1 = problem![1][numArray[ran2]];
    const incorrectData2 = problem![1][rejectArray[ran3]];

    //問題の配列に各オブジェクトを格納する
    problems = [correctData, incorrectData1, incorrectData2];

    //問題をシャッフルする関数を実行
    shuffle(problems);

    //使ったデータを削除した、正解の配列を定義
    problem![0] = problem![0].filter((x) => x != correctData);
    //使ったデータを削除した、誤解答の配列を定義
    problem![1] = problem![1].filter(
      (x) => x != incorrectData1 && x != incorrectData2
    );
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
  controllProblem();
  return (
    <Box>
      <Box sx={{ fontSize: "35px", ml: "40px" }}>
        {corrects?.correctProblem}
      </Box>
      <Stack direction="row">
        {problems.map((x) => {
          return (
            <Buttons
              x={x}
              correctAnswer={corrects?.correctAnswer}
              judg={x.problem == corrects?.correctProblem}
              onClick={sets}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
