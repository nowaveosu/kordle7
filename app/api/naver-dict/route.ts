import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ exists: false }, { status: 400 });
    }

    const url = `https://openapi.naver.com/v1/search/encyc.json?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
        headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
    });

    if (!response.ok) {
        console.error(`API 요청 실패: 상태 코드 ${response.status}`);
        return NextResponse.json({ exists: false }, { status: response.status });
    }
        const data = await response.json();
        const exists = data.total > 0 && data.items.length > 0;
        return NextResponse.json({ exists });
    } catch (error) {
        console.error("네이버 사전 API 호출 실패:", error);
        return NextResponse.json({ exists: false }, { status: 500 });
    }
}