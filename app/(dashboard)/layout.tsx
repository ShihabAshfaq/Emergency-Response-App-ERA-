import { ReactNode } from "react"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col">

            <main className="flex flex-1 flex-col gap-4 p-0 md:gap-8 md:p-0">
                {children}
            </main>
        </div>
    )
}
