import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  // const { pathname } = request.nextUrl;
  try {
    let cookie = request.cookies.get('jwt-token')?.value;
    if (!cookie || !cookie.startsWith('Bearer')) {
      // throw new Error("Invalid token");
      return NextResponse.next();
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_PHERO_API_BASE_URL}/user/verify-cookie`, {
      method: 'GET',
      headers: {
        Authorization: cookie,
      },
    });
    await res.json();
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL(`https://web.programming-hero.com/login`)
    );
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
};
