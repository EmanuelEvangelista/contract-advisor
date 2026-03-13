import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Si el token existe y el status es 'inactive', no permitimos acceso a nada privado
    if (token?.status === "inactive") {
      // Si ya está en la home, lo dejamos, pero si intenta entrar a panel u onboarding, lo pateamos
      if (pathname !== "/") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // 🔥 2. Logueado entrando al home
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/panel", req.url));
    }

    // 🔥 3. Logueado SIN studio intentando panel
    if (token && !token.studioId && pathname.startsWith("/panel")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // 🔥 4. Logueado SIN studio pero ya está en onboarding → permitir
    if (token && !token.studioId && pathname === "/onboarding") {
      return NextResponse.next();
    }

    // 🔥 5. Logueado CON studio intentando onboarding
    if (token?.studioId && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/panel", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/", "/panel/:path*", "/onboarding"],
};
