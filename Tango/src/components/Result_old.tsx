import { Box } from "@mui/material";
import { FC, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

//非同期通信で得るデータの型を定義
interface Props {
  id: number;
  problem: string;
  answer: string;
  p_number: number;
  a_number: string;
}

//uselocationで受け取る変数の型定義
interface State {
  nextProblemsArray: Props[][];
  result: string;
  answer: string;
  wrongArray: number[];
  kinds: string;
}

//コンポーネントに渡す変数の型定義
interface ShowType {
  nextProblemArray: Props[][];
  wrongArray: number[];
  answer: string;
  judg: boolean;
  witch: boolean;
  kinds: string;
}

function Show({
  nextProblemArray,
  wrongArray,
  answer,
  judg,
  witch,
  kinds,
}: ShowType) {
  return (
    <Box>
      <Box sx={{ fontSize: "40px" }}>{judg ? "正解" : "不正解"}</Box>
      {!judg && (
        <Box sx={{ fontSize: "40px", font: "red" }}>
          正しい答えは「{answer}」です
        </Box>
      )}
      {nextProblemArray[0].length == 0 ? (
        <Box sx={{ fontSize: "40px" }}>
          {kinds == "normal"
            ? 5 -
              (typeof wrongArray === "object" ? wrongArray.length : 0) +
              "問正解"
            : "復習完了"}
        </Box>
      ) : (
        <Link
          style={{ fontSize: "30px" }}
          state={{
            nextProblemArray: nextProblemArray,
            wrongArray: witch && wrongArray,
            kinds: kinds,
          }}
          to="/Api"
        >
          次の問題へ
        </Link>
      )}
      <Link
        style={{ marginLeft: "25px", fontSize: "30px" }}
        to="/Home"
        onClick={() => deleteProblemsData(nextProblemArray, wrongArray, answer)}
      >
        ホーム画面へ
      </Link>
    </Box>
  );
}

//それまでのデータを全てリセットする関数
function deleteProblemsData(
  nextProblemsArray: Props[][],
  wrongArray: number[],
  answer: string
) {
  nextProblemsArray[0].splice(0);
  nextProblemsArray[1].splice(0);
  wrongArray.splice(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  answer = "";
}

export const Result: FC = () => {
  //State変数を得るためのuseLocation
  const location = useLocation();

  //解答を得るためのStateと、共通の変数を得るためのStateを分けて得る
  const { result, answer, nextProblemsArray, wrongArray, kinds } =
    location.state as State;
  console.log(nextProblemsArray);
  useEffect(() => {
    //非同期通信の関数
    const fetchData = async (): Promise<Props[]> => {
      //誤答のデータを送信してデータベースに登録するためのfetch
      const result = await fetch("http://192.168.11.8:2022/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wrongArray),
      });
      //受け取った結果をjsonに変換して変数に格納
      const resultJson: Props[] = await result.json();
      return resultJson;
    };
    //誤答のidの配列に何かしら値が存在する場合のみ、非同期通信を実行
    if (nextProblemsArray[0].length == 0 && typeof wrongArray !== "undefined") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Show
      nextProblemArray={nextProblemsArray}
      wrongArray={wrongArray}
      answer={answer}
      judg={result == "correct"}
      witch={typeof wrongArray !== "undefined"}
      kinds={kinds}
    />
  );
};
