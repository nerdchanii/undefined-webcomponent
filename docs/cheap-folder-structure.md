# Cheap Folder Architecture

Package root:

```txt
packages/cheapers/src
```

Cheap is organized around five stable boundaries:

- authoring: JSX and public APIs
- store: internal state, cell, observer, and subscription primitives
- runtime: component ownership, hooks, lifecycle, scheduling
- bindings: internal store-to-update target links
- commit: Real DOM materialization, placement, events, refs

## Target Tree

```txt
packages/cheapers/src
├── index.ts
├── jsx-runtime.ts
├── jsx/
│   ├── runtime.ts
│   ├── children.ts
│   └── types.d.ts
├── model/
│   ├── child.ts
│   ├── component.ts
│   ├── element.ts
│   ├── fragment.ts
│   ├── identity.ts
│   └── props.ts
├── runtime/
│   ├── boundary.ts
│   ├── collect-work.ts
│   ├── context.ts
│   ├── instance.ts
│   ├── lifecycle.ts
│   ├── owner.ts
│   ├── phase.ts
│   ├── reconcile.ts
│   ├── refresh.ts
│   ├── render-cycle.ts
│   └── root.ts
├── hooks/
│   ├── dispatcher.ts
│   ├── effect.ts
│   ├── memo.ts
│   ├── ref.ts
│   ├── state.ts
│   └── types.ts
├── store/
│   ├── cell.ts
│   ├── external-store.ts
│   ├── observer.ts
│   ├── create-store.ts
│   ├── subscription.ts
│   └── types.ts
├── bindings/
│   ├── binding.ts
│   ├── registry.ts
│   └── target.ts
├── scheduler/
│   ├── flush.ts
│   ├── queue.ts
│   └── task.ts
├── dom/
│   ├── commit.ts
│   ├── materialize.ts
│   ├── placement.ts
│   ├── props.ts
│   ├── render.ts
│   └── text.ts
├── events/
│   ├── listener.ts
│   ├── props.ts
│   └── target.ts
├── refs/
│   ├── handle.ts
│   ├── range.ts
│   └── tree.ts
├── dev/
│   ├── inspect.ts
│   └── warnings.ts
└── shared/
    ├── invariant.ts
    ├── is.ts
    └── types.ts
```

## Data And UI Coupling

State changes should be observable without forcing the store layer to own UI structure.

- `store/` owns snapshots, versions, observer lists, subscriptions, and stale update protection.
- `bindings/` owns intentional store-to-update target links.
- `runtime/` owns whether a store change reaches a boundary rerender or a lower-cost binding update.
- `scheduler/` owns when frequent updates are flushed.
- `dom/` owns the final commit operation.
- Coupling is an internal runtime decision. Public APIs should expose hooks and store primitives, not lifecycle escape hatches.

This keeps default data flow decoupled while still allowing high-performance coupling for streaming text, realtime dashboards, collaborative cursors, market data, logs, and AI token output.

## File Responsibilities

### Public Entry

| File | Responsibility | Notes |
| --- | --- | --- |
| `index.ts` | Public API exports. | Exports stable user APIs only: `render`, hooks, context, and approved store primitives. |
| `jsx-runtime.ts` | TypeScript automatic JSX entry. | Thin re-export layer for `jsx/runtime.ts`. Keep path stable for `jsxImportSource`. |

### `jsx/`

Authoring syntax to Cheap model values.

| File | Responsibility |
| --- | --- |
| `runtime.ts` | Implements `jsx`, `jsxs`, and `h`. Extracts `key`, separates `children`, returns model objects. |
| `children.ts` | Normalizes child input into model-compatible child arrays. Flattens arrays and filters unsupported empty values according to model rules. |
| `types.d.ts` | JSX namespace declarations for TypeScript authoring. |

Rules:

- `jsx/` may depend on `model/` and `shared/`.
- `jsx/` must not import `runtime/`, `hooks/`, `dom/`, or `scheduler/`.
- JSX creation must not execute function components.

### `model/`

Static value contracts shared by authoring, runtime, and DOM layers.

| File | Responsibility |
| --- | --- |
| `child.ts` | `CheapChild`, normalized child arrays, nullable/boolean child rules. |
| `component.ts` | Function component type, component props, component return type. |
| `element.ts` | Native element and component element descriptions. |
| `fragment.ts` | Fragment model and multi-child return contracts. |
| `identity.ts` | `key`, reset identity, remount identity metadata. |
| `props.ts` | Shared prop shape, event prop naming, ref prop shape. |

Rules:

- `model/` is data and type contracts only.
- `model/` must not know about DOM nodes, hook storage, scheduler queues, or store subscriber storage.
- Keep model files small enough that other internal layers can read contracts without pulling runtime behavior.

### `runtime/`

Component execution, ownership, lifecycle, and root orchestration.

| File | Responsibility |
| --- | --- |
| `root.ts` | Creates and owns root render containers. Bridges public `render` to runtime boundaries. |
| `boundary.ts` | Represents an update boundary. Stores current model output, DOM handle, dirty state, and parent/root links. |
| `collect-work.ts` | Collects affected closures, handlers, computed values, effects, boundaries, and DOM targets after store updates. |
| `instance.ts` | Component instance record. Owns props, hook records, effect records, rendered child boundary, and identity. |
| `owner.ts` | Tracks current owner during component execution and links parent/child ownership. |
| `phase.ts` | Defines runtime update phases and their ordering. |
| `reconcile.ts` | Owns reconciliation control. Decides preserve, update, move, replace, remount, detach, and unmount at boundary level. |
| `refresh.ts` | Refreshes closure-sensitive records such as event handlers, mutation callbacks, computed dependencies, and props-derived reads. |
| `render-cycle.ts` | Runs component functions, installs hook dispatcher, captures returned children, and coordinates commit. |
| `lifecycle.ts` | Mount, update, detach, reattach, unmount, cleanup phases. |
| `context.ts` | Context value propagation and lookup. |

Rules:

- `runtime/` coordinates; it should not contain low-level DOM prop setting or event listener details.
- `runtime/` owns reconciliation policy and identity decisions.
- `runtime/` owns update ordering inside a scheduled flush.
- Logic freshness must be prepared before DOM changes are visible.
- `runtime/` may call `dom/`, `hooks/`, `store/`, `bindings/`, `scheduler/`, and `refs/` through explicit functions.
- Runtime records are private unless exposed through explicit diagnostics in `dev/inspect.ts`.

### `hooks/`

React-like APIs bound to the current runtime instance.

| File | Responsibility |
| --- | --- |
| `dispatcher.ts` | Current hook dispatcher, hook cursor, render-phase guardrails. |
| `state.ts` | `useState`, state cells, functional updates, dirty boundary enqueue. |
| `effect.ts` | `useEffect`, future `useLayoutEffect`, dependency comparison, cleanup records. |
| `memo.ts` | `useMemo`, future `useCallback`, dependency comparison. |
| `ref.ts` | `useRef` stable object records. |
| `types.ts` | Hook record types and dependency list contracts. |

Rules:

- Hooks may read the current instance from `runtime/owner.ts` or a narrow runtime accessor.
- Hooks should use `store/` for local state cells, store subscriptions, and external store snapshots.
- Hooks may enqueue work through `scheduler/`.
- Hooks must not directly create, insert, or remove DOM nodes.

### `store/`

Internal state and store primitives independent from UI structure.

| File | Responsibility |
| --- | --- |
| `cell.ts` | Local mutable state cell used by `useState` and future derived values. |
| `create-store.ts` | Temporary `createStore` primitive over snapshots and pub/sub. Expected to become more atomic over time. |
| `observer.ts` | Observer list and notification utilities. |
| `external-store.ts` | External store bridge contract for user-owned state containers. |
| `subscription.ts` | Subscribe/unsubscribe records, cleanup, and observer notification. |
| `types.ts` | Store value, version, snapshot, and unsubscribe contracts. |

Rules:

- `store/` owns internal state and change observation, not UI ownership or lifecycle.
- `store/` should be based on small pub/sub and observer primitives.
- Browser event primitives such as `EventTarget` may be used as an implementation detail if they keep the store layer smaller.
- The store contract should not require DOM ownership even if browser APIs are used internally.
- A store may notify subscribers without knowing how UI work is committed.
- One component may have local state; one state value may also be represented by one store.
- Streaming transports are userland inputs. Core should optimize frequent store updates without owning `ReadableStream`, WebSocket, SSE, or transport logic.
- Query, cache, retry, mutation, and transport logic should live outside core.

### `bindings/`

Internal links between observed store changes and update targets.

| File | Responsibility |
| --- | --- |
| `binding.ts` | Binding record from a store snapshot to a runtime or DOM update target. |
| `target.ts` | Boundary, text, prop, ref, and future DOM target contracts. |
| `registry.ts` | Binding registration, invalidation, and cleanup. |

Rules:

- `bindings/` is internal. It is not a public lifecycle surface.
- Bindings allow Cheap to choose lower-cost updates before falling back to boundary rerender.
- Bindings should target minimal DOM API or browser API changes when the target is known.
- Bindings must not own store values, component instances, or DOM mutation details.

### `scheduler/`

Work timing and flush policy.

| File | Responsibility |
| --- | --- |
| `queue.ts` | Dirty boundary queue and de-duplication. |
| `task.ts` | Task records and phase names. |
| `flush.ts` | Microtask flush, effect flush, future frame/priority hooks. |

Rules:

- Scheduler stores when work runs, not what a component means.
- Scheduler should accept boundary/task handles instead of importing concrete hook internals.
- Frequent store updates should be coalesced by scheduler policy before they force boundary work.
- First implementation can be microtask-only, but the queue contract should allow priority later.

### `dom/`

Real DOM creation and commit operations.

| File | Responsibility |
| --- | --- |
| `render.ts` | Public DOM render bridge used by `index.ts`; delegates root creation to `runtime/root.ts`. |
| `materialize.ts` | Converts model children into DOM handles. Executes no hooks directly. |
| `commit.ts` | Applies operations selected by `runtime/reconcile.ts` to the DOM. |
| `placement.ts` | Insert-before, move, detach, reattach, and next-real-sibling lookup. |
| `props.ts` | Applies DOM attributes, properties, refs, and delegates event props to `events/`. |
| `text.ts` | Creates and updates text nodes. |

Rules:

- `dom/` is the only layer that mutates DOM nodes directly.
- `dom/` executes commit operations; it does not decide boundary identity or remount policy.
- Direct updates should target known nodes/handles when available.
- Browser APIs should be used directly when they reduce unnecessary synthetic work.
- `dom/` must not own component hook state.

### `events/`

Native event handling.

| File | Responsibility |
| --- | --- |
| `props.ts` | Detects event props and maps prop names to native event names. |
| `listener.ts` | Installs stable native listener proxies and updates current handler references. |
| `target.ts` | Event target/path helpers, including `composedPath()` handling. |

Rules:

- Use native events as the default.
- Avoid rebuilding synthetic event propagation in core.
- Handler updates should update references without repeatedly removing and adding listeners.

### `refs/`

DOM handles and logical placement handles.

| File | Responsibility |
| --- | --- |
| `handle.ts` | Single-node, text-node, empty, and range handle types. |
| `range.ts` | First/last DOM range helpers for fragments and multi-node component output. |
| `tree.ts` | Logical ref tree for ownership, sibling lookup, and DOM-less component placement. |

Rules:

- The minimum DOM unit is `Node`, not `Element`.
- Components may have one node, a range, or no direct DOM handle.
- Avoid comment anchors by default; use logical sibling lookup first.

### `dev/`

Development-only diagnostics.

| File | Responsibility |
| --- | --- |
| `inspect.ts` | Controlled runtime inspection for devtools and debugging. |
| `warnings.ts` | Development warnings and error formatting. |

Rules:

- Production paths should not depend on dev diagnostics.
- Dev inspection should use explicit runtime debug APIs, not arbitrary private imports.

### `shared/`

Small internal utilities.

| File | Responsibility |
| --- | --- |
| `invariant.ts` | Internal assertion helpers. |
| `is.ts` | Small predicates used across domains. |
| `types.ts` | Cross-layer utility types only. |

Rules:

- Do not use `shared/` as a dumping ground.
- If a helper belongs to a domain, keep it in that domain.

## Dependency Rules

Allowed dependencies:

```txt
index.ts        -> dom/render, hooks, runtime/context, store/create-store
jsx-runtime.ts  -> jsx/runtime
jsx             -> model, shared
model           -> shared
runtime         -> model, hooks, store, bindings, scheduler, dom, refs, shared
hooks           -> runtime accessors, store, scheduler, shared
store           -> shared
bindings        -> store, scheduler, shared
scheduler       -> shared
dom             -> model, events, refs, shared
events          -> shared
refs            -> shared
dev             -> explicit runtime debug contracts, shared
```

Forbidden dependencies:

```txt
model      -> runtime | hooks | dom | events | scheduler | bindings
jsx        -> runtime | hooks | dom | scheduler
hooks      -> dom | events
store      -> runtime internals | dom | hooks internals | bindings
bindings   -> runtime internals | dom
events     -> runtime | hooks
scheduler  -> dom | hooks internals
```

If two folders need each other, introduce a narrow contract and inject the implementation. Do not solve cycles with broad `shared/` exports.

## Runtime Interaction

Initial mount:

```txt
render(child, container)
  -> runtime/root creates RootBoundary
  -> runtime/render-cycle resolves component elements
  -> hooks/dispatcher binds current instance while components run
  -> dom/materialize creates DOM handles
  -> refs/tree stores placement handles
  -> dom/commit inserts nodes into container
  -> runtime/lifecycle runs mount phases
  -> scheduler/flush runs passive effects
```

State update:

```txt
setState(next)
  -> hooks/state updates store/cell
  -> scheduler/queue marks owning boundary dirty
  -> scheduler/flush starts update task
  -> runtime/render-cycle reruns boundary
  -> runtime/reconcile decides preserve/update/move/replace/remount
  -> dom/commit applies selected node/text/prop/placement operations
  -> runtime/lifecycle runs effect cleanup and next effects
```

Frequent store update:

```txt
external stream/store/browser API emits value
  -> userland adapter or createStore updates store snapshot/version
  -> store/observer notifies subscribers
  -> bindings/registry invalidates bound targets when available
  -> scheduler/queue coalesces work
  -> runtime/collect-work groups affected closures, handlers, effects, boundaries, and targets
  -> runtime/refresh prepares logic freshness
  -> runtime/reconcile chooses direct commit or boundary update
  -> dom/commit applies the selected operation
```

Event update:

```txt
new props with onClick
  -> dom/props detects event prop
  -> events/listener installs or reuses native proxy
  -> events/listener updates current handler reference
```

## Update Phases

Runtime flush order matters because DOM freshness and logic freshness are separate.

```txt
1. store mutation
2. affected work collection
3. derived/computed refresh
4. closure and event handler refresh
5. reconciliation decision
6. DOM commit
7. layout effects
8. passive effects
```

Rules:

- No stale event handler should be observable after DOM commit.
- Derived values must refresh before dependent closures or DOM targets read them.
- A direct DOM commit is valid only when all affected logic records are fresh or unaffected.
- If closure freshness cannot be proven cheaply, schedule boundary refresh or reconciliation.
- Scheduler decides when a flush runs; runtime decides the order inside the flush.

## Contract Levels

Stable public:

- `index.ts`
- `jsx-runtime.ts`
- `createStore` while store primitives are being shaped

Stable internal:

- model value shapes
- store snapshot/subscription contract
- internal binding target contract
- affected work collection contract
- runtime phase ordering
- boundary scheduling contract
- DOM handle contract

Private:

- hook storage layout
- store subscriber storage
- queue implementation
- event listener maps
- instance object internals
- ref tree storage

## Scaffolding Order

1. Split `model/types.ts` into `model/child.ts`, `model/component.ts`, `model/element.ts`, and `model/props.ts`.
2. Move `render/dom.ts` to `dom/render.ts`.
3. Extract `dom/materialize.ts`, `dom/props.ts`, and `dom/text.ts` from the current renderer.
4. Add `events/props.ts` and `events/listener.ts` for native event props.
5. Add `runtime/root.ts`, `runtime/boundary.ts`, `runtime/instance.ts`, and `runtime/reconcile.ts`.
6. Add `store/cell.ts`, `store/subscription.ts`, and `store/types.ts`.
7. Add `hooks/dispatcher.ts` and `hooks/state.ts` on top of `store/cell.ts`.
8. Add `scheduler/queue.ts` and `scheduler/flush.ts`.
9. Add `store/observer.ts`, `store/create-store.ts`, and `store/external-store.ts`.
10. Add `bindings/binding.ts`, `bindings/target.ts`, and `bindings/registry.ts`.
11. Add `runtime/collect-work.ts`, `runtime/phase.ts`, and `runtime/refresh.ts`.
12. Add `refs/handle.ts`, then `refs/range.ts` when fragments or multi-node outputs need it.
13. Add `runtime/lifecycle.ts` and `hooks/effect.ts`.
14. Add `dev/` only when diagnostics or inspection APIs are implemented.

Each step should keep `npm run build` passing.

## Naming Rules

- Use `dom/`, not `render/`, for DOM mutation and commit code.
- Use `runtime/`, not `core/`, for ownership and lifecycle code.
- Keep file names singular when they define one concept: `boundary.ts`, `instance.ts`, `queue.ts`.
- Keep file names plural only when the file maps a family of inputs: `props.ts`, `types.ts`.

## Deferred

- Built-in streaming transport adapters.
- Query/cache/mutation packages.
