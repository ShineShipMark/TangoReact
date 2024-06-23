import { Box, Button, Stack } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

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

//各ページで共通するStateの型定義
interface Common {
  nextProblemArray: Props[][];
  wrongArray: number[];
  kinds: string;
}

//ボタンコンポーネントの引数に型定義
interface ButtonType {
  x: Props;
  correctProblem: string;
  nextProblemsArray: Props[][];
  judg: boolean;
  wrongArray: number[];
  kinds: string;
}

//ボタンのコンポーネント
function Buttons({
  x,
  nextProblemsArray,
  correctProblem,
  wrongArray,
  judg,
  kinds,
}: ButtonType): JSX.Element {
  return (
    //条件付きレンダリングで通常と復習を分ける
    <Button
      data-button-key={x.id}
      variant="contained"
      sx={{ backgroundColor: "blue", ml: "40px" }}
      component={Link}
      to="/Result"
      state={{
        result: judg ? "correct" : "incorrect",
        nextProblemsArray: nextProblemsArray,
        answer: correctProblem,
        wrongArray: wrongArray,
        kinds: kinds,
      }}
      onClick={() => {
        nextProblemsArray = removeData(nextProblemsArray, x.id);
        !judg && wrongArray.push(x.id);
      }}
    >
      {x.answer}
    </Button>
  );
}

//解答済みのデータを問題を格納している配列から除外する関数
function removeData(array: Props[][], problemId: number) {
  const removedArray: Props[][] = array.filter((propsArray) =>
    propsArray.filter((props) => props.id != problemId)
  );
  return removedArray;
}

export const Api: FC = () => {
  //Stateを得るためのuseLocation
  const location = useLocation();

  //各ページで共有する変数をlocationから取得
  const { nextProblemArray, wrongArray, kinds } = location.state as Common;

  //正解の各変数を格納するため変数を初期化
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let corrects: Correct = {
    idNum: 0,
    correctProblem: "",
    correctAnswer: "",
  };

  //問題を格納する配列
  let problems: Props[] = [];

  //次に渡すための問題の配列を初期化
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let nextProblemsArray: Props[][] = [];

  //受け取った、誤解答のidを格納する配列を初期化
  let wrongnum: number[] = [];

  //wrongArrayの型式がundefinedの場合＝誤回答が無い場合を除いて、処理を行う
  if (typeof wrongArray !== "undefined") {
    //配列に受け取った誤解答の配列を格納
    wrongnum = wrongArray;
  }

  //問題に関して操作を行う関数
  const controlArray = (): void => {
    //乱数をそれぞれ定義
    if (typeof nextProblemArray[0].length == "undefined") {
      console.log(5555);
    }
    const ran = Math.floor(Math.random() * nextProblemArray[0].length);
    const ran2 = Math.floor(Math.random() * nextProblemArray[1].length);
    const ran3 = Math.floor(Math.random() * nextProblemArray[1].length);

    //数字配列を初期化
    const numArray: number[] = [];

    //結果の配列をforEachを回す
    nextProblemArray[1].forEach((x) => {
      numArray.push(x.id);
    });

    //数字配列から乱数で選んだ要素を削除して新しい配列を定義
    const rejectArray = numArray.filter((x) => x != numArray[ran2]);

    //オブジェクトの中に正解の各要素を格納する
    corrects = {
      idNum: nextProblemArray[0][ran].id,
      correctProblem: nextProblemArray[0][ran].problem,
      correctAnswer: nextProblemArray[0][ran].answer,
    };

    //正解のオブジェクトの中からランダムに1つを取り出して変数に格納し、残りは誤解答の配列からランダムに取り出す
    const correctData = nextProblemArray[0][ran];
    const incorrectData1 = nextProblemArray[1][numArray[ran2]];
    const incorrectData2 = nextProblemArray[1][rejectArray[ran3]];

    //問題の配列に各オブジェクトを格納する
    problems = [correctData, incorrectData1, incorrectData2];

    //問題をシャッフルする関数を実行
    shuffle(problems);

    //使ったデータを削除した、正解の配列を定義
    const nextCorrects = nextProblemArray[0].filter((x) => x != correctData);
    //使ったデータを削除した、誤解答の配列を定義
    const nextIncorrects = nextProblemArray[1].filter(
      (x) => x != incorrectData1 && x != incorrectData2
    );
    //次に渡すための配列に上記2つを格納する
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

  function ss() {}
  ss();
  //データを操作する関数を実行
  controlArray();

  return (
    <Box>
      <Box sx={{ fontSize: "35px", ml: "40px" }}>
        {corrects?.correctProblem}
      </Box>
      <Stack direction="row">
        {problems.map((x) => {
          return (
            <Buttons
              key={x.id}
              x={x}
              nextProblemsArray={nextProblemsArray}
              correctProblem={corrects.correctAnswer}
              wrongArray={wrongnum}
              judg={x.problem == corrects?.correctProblem}
              kinds={kinds}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
