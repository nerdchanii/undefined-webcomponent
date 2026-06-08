# Cheap Folder Structure

Current package root:

```txt
packages/cheapers/src
```

## Current Boundaries

```txt
model/
```

Defines what Cheap values are. This is where component, element, child, and future instance-facing model types belong.

```txt
jsx/
```

Defines how author code becomes Cheap values. JSX runtime implementation lives here.

```txt
render/
```

Defines how Cheap values become Real DOM. This is only the first naive renderer for now. Later this area should become the commit/materialization layer.

```txt
jsx-runtime.ts
```

Compatibility entry for TypeScript automatic JSX runtime. Keep this file stable because `jsxImportSource` resolves it directly.

```txt
index.ts
```

Public package entry.

## Mental Model

- What: `model`
- How authoring becomes model: `jsx`
- How model becomes DOM: `render`
- Who owns state/effects/refs: future `runtime` or dedicated owner modules
- When work runs: future scheduler/lifecycle modules

## Deferred Folders

Do not create these until real implementation begins:

- `runtime/`: component refs, ownership tree, lifecycle orchestration
- `state/`: local state cells and external store bridge
- `effects/`: layout/passive effect records and cleanup
- `events/`: event records and stable native proxies
- `scheduler/`: microtask/frame queues and commit phases
- `refs/`: DOM/ref tree handles, node maps, and placement helpers
