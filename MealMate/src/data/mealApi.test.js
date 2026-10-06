import { describe, expect, it, vi } from "vitest";
import { createCache, getCachedRequest, withSignal } from "./mealApi";

describe("shared API requests", () => {
  it("returns a Promise for cache hits", async () => {
    const cache = createCache(5);
    const load = vi.fn().mockResolvedValue(["meal"]);
    const first = getCachedRequest(cache, "chicken", load);
    await first;
    const cached = getCachedRequest(cache, "chicken", load);

    expect(cached).toBeInstanceOf(Promise);
    await expect(cached).resolves.toEqual(["meal"]);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("aborts an individual caller without aborting other callers", async () => {
    const cache = createCache(5);
    let resolveShared;
    const sharedPromise = getCachedRequest(cache, "salmon", () => new Promise((resolve) => {
      resolveShared = resolve;
    }));
    const controllerA = new AbortController();
    const controllerB = new AbortController();
    const callerA = withSignal(sharedPromise, controllerA.signal);
    const callerB = withSignal(sharedPromise, controllerB.signal);

    controllerA.abort();
    await expect(callerA).rejects.toMatchObject({ name: "AbortError" });
    resolveShared(["salmon meal"]);
    await expect(callerB).resolves.toEqual(["salmon meal"]);
  });

  it("does not cache a failed request", async () => {
    const cache = createCache(5);
    const load = vi.fn()
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce(["retried meal"]);

    await expect(getCachedRequest(cache, "pasta", load)).rejects.toThrow("temporary failure");
    await expect(getCachedRequest(cache, "pasta", load)).resolves.toEqual(["retried meal"]);
    expect(load).toHaveBeenCalledTimes(2);
  });
});
