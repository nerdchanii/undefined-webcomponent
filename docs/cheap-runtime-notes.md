# Cheap Runtime Notes

Cheap is a React-like UI runtime experiment. The public API should feel familiar to React users, but the internal runtime should be based on Real DOM references, component instances, and fine-grained commits.

## Direction

- Public API follows React-like JSX and hooks where possible.
- The runtime should avoid full Virtual DOM diffing as the normal update path.
- Real DOM nodes are the commit target.
- Component identity, lifecycle, hooks, effects, bindings, and ownership are managed by a lightweight internal tree.
- Remount should be rare. Prefer update, move, detach, and reattach when identity is preserved.

## Internal Model

Cheap should distinguish these concepts internally:

- `Component`: owns hooks, effects, state, lifecycle, children, and logical scope.
- `Element`: maps to a native DOM element.
- `Text`: maps to a native text node.
- `Fragment` or range: represents multiple sibling DOM nodes.
- `Binding`: connects a data source to a DOM commit target.
- `RefTree`: logical structure used for ownership, lifecycle, sibling position, and DOM handles.

The minimum DOM unit is `Node`, not only `Element`. Text nodes, fragments, and DOM-less components matter.

## DOM-Less Components

Components may return `null`, children, fragments, or only run effects. They still need a `ComponentRef`.

Cheap can support this without always inserting comment anchors. A component may have:

- a single DOM node handle
- a first/last DOM range handle
- no direct DOM handle

For DOM-less refs, logical sibling position can be kept in the RefTree. When DOM insertion is needed, the renderer can find the next real DOM sibling and insert before it. `DocumentFragment` can be used to batch insertion or movement of multiple nodes.

This part may behave like a small virtual/logical tree, but only for ownership and placement, not as a full VDOM update model.

## Lifecycle

A rough lifecycle model:

1. Create component instance.
2. Run component function and create element/component descriptions.
3. Create or materialize Real DOM nodes when needed.
4. Attach DOM to the document.
5. Run layout effects.
6. Run passive effects.
7. On update, commit changed bindings or run local boundary reconciliation if needed.
8. On detach, preserve instance/state when possible.
9. On unmount, run cleanup and release events, effects, bindings, refs, and subscriptions.

`useEffect(() => cleanup, [])` should be supported. Cleanup runs on unmount/dispose, not on simple detach/reattach.

## State And Updates

`useState` can be treated as a local external store:

- A state cell owns the current value.
- `setState` marks that source dirty.
- Dirty sources notify bindings, effects, or component boundary updates.
- Functional updates like `setCount(c => c + 1)` should be fully supported.

The stale closure problem remains important:

```tsx
setCount(count + 1)
```

Cheap must eventually choose between:

- refreshing closures through local boundary reconciliation
- compiler-assisted live reads from state cells

The practical path is likely hybrid:

- Fast path: source to binding to DOM commit.
- Fallback path: component boundary rerun and local reconciliation.
- Remount only when identity changes.

## Reconciliation

Cheap does not eliminate reconciliation entirely. It moves reconciliation away from the default path.

- Normal state changes should prefer direct binding commits.
- Complex expressions, unknown dependencies, closure refresh, or structural changes may require local boundary reconciliation.
- Type/key changes or explicit reset boundaries may remount.

## Events

Use native events by default.

- Prefer direct native listeners with stable proxy handlers.
- Do not rebuild React-style synthetic propagation as the core model.
- Only nodes with event handlers need event records.
- Event records should be lazy and optional on node refs.
- Handler updates should replace the current handler reference without repeatedly removing and adding native listeners.

`event.composedPath()` is still important for advanced event handling, custom elements, portals, debugging, and possible delegation strategies.

## Data, External Stores, And Resources

Cheap should separate UI structure from data sources where possible.

- `useState`: local component-owned source.
- `useMemo`: derived source, not just a rerender cache.
- `useExternalStore`: bridge external state into Cheap bindings.
- Query, mutation, cache, infinite scroll, and observer logic should likely live outside core.

Async components can be supported later with an async boundary, race protection, and cleanup. Auto skeletons are possible, especially when Cheap has RefTree and binding metadata.

## Safety And Identity

Remount minimization must not leak stale user data.

When switching between security-sensitive identities, such as user/account/tenant/document, Cheap needs an explicit identity boundary.

Examples:

- `key={user.id}`
- future `ResetBoundary identity={user.id}`

If identity changes, cleanup and remount may be safer than preserving stale closures, effects, subscriptions, or refs.

## Deferred

These are intentionally deferred:

- Lazy collection pipelines similar to lodash lazy.
- Full compiler-assisted binding and closure rewriting.
- Web Components export/adapter support.
- Query/cache/mutation/infinite-scroll package design.
- Hydration details and marker strategy.
- AutoSkeleton API details.
