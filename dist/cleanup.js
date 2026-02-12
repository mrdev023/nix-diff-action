import { A as catchAll, I as gen, R as logInfo, W as runPromise, dr as warning, n as removeWorktree, or as getState, q as sync } from "./assets/git-DiMYLs6o.js";
var cleanup = gen(function* () {
	const worktreePath = yield* sync(() => getState("worktreePath"));
	if (!worktreePath) {
		yield* logInfo("No worktree path saved, skipping cleanup");
		return;
	}
	yield* removeWorktree(worktreePath);
	yield* logInfo(`Cleaned up worktree at ${worktreePath}`);
});
const run = () => cleanup.pipe(catchAll((error) => sync(() => warning(`Cleanup failed: ${error}`))), runPromise);
run();
export { run };

//# sourceMappingURL=cleanup.js.map