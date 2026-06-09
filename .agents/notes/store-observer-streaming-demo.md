# Store Observer Streaming Demo

Purpose: create a later demo that proves Cheap can handle frequent updates with less unnecessary work.

Candidate demo:

- Streaming text output.
- Realtime counter or price ticker.
- Log tail UI.

Runtime path to exercise:

```txt
external stream/store/browser API emits value
  -> userland adapter or createStore updates store snapshot/version
  -> store/observer notifies subscribers
  -> scheduler coalesces frequent work
  -> runtime decides boundary update or lower-cost commit path
  -> dom commits minimal updates
```

What to measure:

- Number of component boundary reruns.
- Number of DOM node mutations.
- Event handler freshness after updates.
- Whether frequent updates are coalesced into fewer flushes.

Deferred for the demo:

- Built-in streaming transport adapters.
- Query/cache/mutation behavior.
- Full binding metadata if the first demo can prove value with boundary updates.

