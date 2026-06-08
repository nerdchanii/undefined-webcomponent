import { render } from "@packages/cheapers";

function App() {
  return (
    <main className="example">
      <h1>Cheap example</h1>
      <p>Runtime package code now lives under packages/cheapers/src.</p>
    </main>
  );
}

const root = document.getElementById("root");

if (root) {
  render(<App />, root);
}
