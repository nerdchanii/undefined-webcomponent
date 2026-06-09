import { render } from "@packages/cheapers";

function App() {
  const number = 10;
  return (
    <main className="example">
      <h1 className="hi">Cheap{number} example</h1>
      <p>Runtime package code now lives under packages/cheapers/src.</p>
    </main>
  );
}

const root = document.getElementById("root");

if (root) {
  render(<App />, root);
}
