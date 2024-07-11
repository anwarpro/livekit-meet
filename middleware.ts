import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function middleware(req: NextRequest, res: NextResponse) {
    try {
        const response = await fetch(`${API_URL}server-health`).then(res => res.json())
        console.log("🚀 ~ middleware ~ response:", response)
        if (response.serverStatus) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/server-maintenances', req.url))
        }
    } catch (error) {
        console.log("🚀 ~ middleware ~ meetify server down")
        return NextResponse.redirect(new URL('/server-maintenances', req.url))
    }

}

//"Matching Paths"
export const config = {
    matcher: ['/', '/rooms/:path*', '/dashboard/:path*'],
}