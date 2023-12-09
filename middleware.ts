import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req) {
        /* Tried to access public route while logged in, redirect to org selection page */
        if (auth.userId && auth.isPublicRoute) {
            let path = "/select-org"

            if (auth.orgId) {
                path = `/organization/${auth.orgId}`
            }
            const orgSelection = new URL(path, req.url)
            return NextResponse.redirect(orgSelection)
        }
        /* Tried to acces protected URL, return the user to the url after auth */
        if(!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({returnBackUrl: req.url})
        }
        /* Logged in user has no org, redirect to org selection page */
        if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org') {
            const orgSelection = new URL('/select-org', req.url)
            return NextResponse.redirect(orgSelection)
        }
    }
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
