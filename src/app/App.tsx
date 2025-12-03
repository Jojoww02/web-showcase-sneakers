import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/Router";

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
        <RouterProvider router={router} />
    )
}
