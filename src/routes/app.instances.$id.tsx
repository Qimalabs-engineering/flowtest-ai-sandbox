import { createFileRoute, redirect } from "@tanstack/react-router";

// Instance detail simply redirects to the existing transaction detail page
// which already renders the flow graph, four-questions panel and replay drawer.
export const Route = createFileRoute("/app/instances/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/app/transaction/$id", params: { id: params.id } });
  },
});
