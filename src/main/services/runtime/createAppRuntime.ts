import { AppRuntimeImpl } from "../../../runtime/core/AppRuntimeImpl";

export function createAppRuntime(rootPath: string) {
  return new AppRuntimeImpl(rootPath);
}
