import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "@/config/auth";

const Login = () => {
    return (
        <section className="min-h-[70vh] bg-background flex items-center">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>
                                Login to LifeStyle Mart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                action={async () => {
                                    "use server"
                                    await signIn("google", { redirectTo: '/' })
                                }}
                            >
                                {/* <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="you@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" placeholder="••••••••" />
                                </div>
                                <Button type="submit" className="w-full">Sign in</Button> */}
                                <Button type="submit" variant="outline" className="w-full">Continue with Google</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Login;