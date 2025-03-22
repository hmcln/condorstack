import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Logo */}
            <div className="flex justify-center pt-8">
                <h1 className="text-3xl font-bold">CondorStack</h1>
            </div>

            {/* Footer */}
            <footer className="py-12 bg-card mt-auto">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                Terms
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                                Privacy
                            </Link>
                            <Link href={siteConfig.links.github} className="text-sm text-muted-foreground hover:text-foreground">
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
