import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth"; 
import { Polar } from "@polar-sh/sdk"; 
import { db } from "~/server/db";

const polarClient = new Polar({ 
    accessToken: process.env.POLAR_ACCESS_TOKEN, 
    // Use 'sandbox' if you're using the Polar Sandbox environment
    // Remember that access tokens, products, etc. are completely separated between environments.
    // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
    server: 'sandbox'
}); 

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: { 
    enabled: true, 
    },
    // ... Better Auth config
    plugins: [
        polar({ 
            client: polarClient, 
            createCustomerOnSignUp: true, 
            use: [ 
                checkout({ 
                    products: [ 
                        { 
                            productId: "f5119c28-6493-49e6-97b1-954b570543f1", // ID of Product from Polar Dashboard
                            slug: "small" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        { 
                            productId: "f4315d31-bc62-4af8-b877-37983bcb62f0", // ID of Product from Polar Dashboard
                            slug: "medium" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        { 
                            productId: "9b2f0c64-c50b-415d-b3a0-e916550acb3e", // ID of Product from Polar Dashboard
                            slug: "large" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        } 
                    ], 
                    successUrl: "/dashboard", 
                    authenticatedUsersOnly: true
                }), 
                portal(), 
                 
                webhooks({ 
                    secret: process.env.POLAR_WEBHOOK_SECRET!, 
                    onOrderPaid: async (order) => {
                        const externalCustomerId= order.data.customer.externalId;
                        if(!externalCustomerId){
                            console.error("No external customer ID found for the order:");
                            throw new Error('No external customer ID found for the order.');
                        }

                        const productId= order.data.productId;

                        let creditsToAdd= 0;

                        switch (productId) {
                            case "f5119c28-6493-49e6-97b1-954b570543f1":
                                creditsToAdd= 50;
                                break;
                            case "f4315d31-bc62-4af8-b877-37983bcb62f0":
                                creditsToAdd= 200
                                break;
                            case "9b2f0c64-c50b-415d-b3a0-e916550acb3e":
                                creditsToAdd= 400
                                break;                        
                            default:
                                break;
                        }

                        await db.user.update({
                            where: { id: externalCustomerId},
                            data: { credits: { increment: creditsToAdd}},
                        })
                    }  
                   
                }) 
            ], 
        }) 
    ]
});