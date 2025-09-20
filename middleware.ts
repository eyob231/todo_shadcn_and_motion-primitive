import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if(request.nextUrl.pathname === '/quiz') {
        return NextResponse.redirect(new URL('/n', request.url));
    }
    // return NextResponse.redirect(new URL('/n', request.url));
}

// export const config = {
//     matcher: '/quiz',
// };
