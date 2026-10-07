import { describe, expect, it } from "vitest"
import { pluginNameFromModule } from "./pluginStrings"
describe("pluginNameFromModule", () => {
  it("extracts the plugin from a UI asset URL", () => {
    expect(pluginNameFromModule("/api/plugins/skillsguishow/ui/index.js?v=4")).toBe("skillsguishow")
    expect(pluginNameFromModule("/api/plugins/agent/ui/chunks/abc.js")).toBe("agent")
    expect(pluginNameFromModule("/api/plugins/life/ui/memory.js")).toBe("life")
  })
  it("ignores anything that is not a plugin UI asset", () => {
    expect(pluginNameFromModule("/api/plugins/ui/x.js")).toBe("")
    expect(pluginNameFromModule("/assets/index.js")).toBe("")
    expect(pluginNameFromModule("http://evil/api/plugins/x/ui/y.js")).toBe("")
    expect(pluginNameFromModule(undefined)).toBe("")
    expect(pluginNameFromModule(null)).toBe("")
    expect(pluginNameFromModule(42)).toBe("")
  })
})
