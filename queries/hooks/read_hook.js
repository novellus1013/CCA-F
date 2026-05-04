// stdin으로 도구 호출 정보(JSON)를 읽음
process.stdin.setEncoding("utf8");
let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  const toolArgs = JSON.parse(input);
  const readPath = toolArgs.tool_input?.file_path || "";

  //file_path에 .env가 포함되어 있으면 에러 메시지를 출력하고 exit(2)로 종료
  if (readPath.includes(".env")) {
    console.error("You cannot read the .env file");
    process.exit(2);
  }

  //그 외 경우엔 exit(0)으로 정상 종료 -> 도구 실행 허용
  process.exit(0);
});