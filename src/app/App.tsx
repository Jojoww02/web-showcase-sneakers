import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { router } from "@/Router";

const queryClient = new QueryClient();

export default function App() {
    const [color, setColor] = useState(true);
    const myRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(myRef, { once: false, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            setColor(true);
        } else {
            setColor(false);
        }
    }, [isInView])

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <TanStackRouterDevtools router={router} position="bottom-left" />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
