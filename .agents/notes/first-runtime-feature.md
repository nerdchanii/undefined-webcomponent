# First Runtime Feature

Purpose: implement the first usable Cheap runtime feature without pulling in the full optimization plan.

Scope:

- Add `useState`.
- Add native event props such as `onClick`.
- Keep updates boundary-based at first.
- Preserve the public React-like authoring surface.

Initial flow:

```txt
event fires
  -> native listener proxy calls latest handler
  -> setState updates store/cell
  -> scheduler queues owning boundary
  -> runtime reruns boundary
  -> dom commits the result
```

Constraints:

- Do not implement binding fast paths yet.
- Do not introduce plugin or extension APIs.
- Keep closure freshness visible in the implementation, even if the first version rerenders the boundary.
- Keep `npm run build` passing after each step.

