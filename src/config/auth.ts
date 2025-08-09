import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            // Authorization config for Google OAuth
            authorization: {
                params: {
                    // 'prompt: consent' forces Google to always show the consent screen,
                    // even if the user has already granted permissions before.
                    // Useful if you change scopes or always want explicit user approval.
                    prompt: 'consent',

                    // 'access_type: offline' requests a refresh token in addition to the access token.
                    // This lets your app access Google APIs even when the user is offline,
                    // without forcing them to log in again.
                    access_type: 'offline',

                    // 'response_type: code' specifies that we want to use the OAuth 2.0
                    // Authorization Code flow, which is more secure.
                    // The server exchanges the returned code for tokens (access, refresh, ID).
                    response_type: 'code',
                },
            },
        })
    ],
})
