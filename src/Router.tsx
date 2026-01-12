import { createRouter, ErrorComponent } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { QueryClient } from "@tanstack/react-query"
import NotFound from "./components/templates/NotFound/NotFound"

export const queryClient = new QueryClient()

export const router = createRouter({
    routeTree,
    context: {
        queryClient
    },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({error}) => <ErrorComponent error={error} />,
    defaultNotFoundComponent: () => <NotFound />,
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}
