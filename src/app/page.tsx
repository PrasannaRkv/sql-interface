import { Suspense } from "react";
import SqlRunner from "@/components/SqlRunner";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SqlRunner />
    </Suspense>
  );
}
