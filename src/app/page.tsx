import { Suspense } from "react";
import SqlRunnerPage from "./SqlRunner";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SqlRunnerPage />
    </Suspense>
  );
}
