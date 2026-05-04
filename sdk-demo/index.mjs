import { query } from "@anthropic-ai/claude-agent-sdk";

const prompt = "현재 디렉토리의 파일 목록을 보여줘";

/*
SDK는 기본적으로 전체 도구 세트에 접근 가능 -> allowedTools에 사용할 도구를 전달해서 도구 제한 가능 
for await (const message of query({ prompt, options: { allowedTools: ["Read", "Glob"] }}))
*/
for await (const message of query({ prompt })) {
    console.log(JSON.stringify(message, null, 2));
}

//node index.mjs 실행 시 