import { onViUpdate } from "modloader64_api/PluginLifecycle";
import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { bus } from "modloader64_api/EventHandler";
import { Z64OnlineEvents } from "@Z64Online/common/api/Z64API";
import { InputTextFlags, string_ref } from "modloader64_api/Sylvain/ImGui";
import { InjectCore } from "modloader64_api/CoreInjection";
import { IZ64Main } from "Z64Lib/API/Common/IZ64Main";
import { Font } from "modloader64_api/Sylvain/Gfx";
import path from 'path';
import { changeKillfeedFont } from "modloader64_api/Announcements";
import { rgba, xy } from "modloader64_api/Sylvain/vec";
import { BUILD_DATE, VERSION_NUMBER } from "@Z64Online/common/lib/VERSION_NUMBER";

export class ImGuiHandler_MM {

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: IZ64Main;
    input: string_ref = [""];
    result: string_ref = [""];
    font!: Font;

    @onViUpdate()
    onViUpdate() {
        if (this.font === undefined) {
            try {
                this.font = this.ModLoader.Gfx.createFont();
                this.font.loadFromFile(path.resolve(__dirname, "HyliaSerifBeta-Regular.otf"), 22, 2);
                changeKillfeedFont(this.font);
                global.ModLoader["FONT"] = this.font;
            } catch (err) {
                this.ModLoader.logger.error(err);
            }
            return;
        }
        // #ifdef IS_DEV_BUILD
        if (this.core.MM!.helper.isTitleScreen()){
            this.ModLoader.Gfx.addText(this.ModLoader.ImGui.getBackgroundDrawList(), this.font, "Z64Online", xy(2, this.ModLoader.ImGui.getWindowHeight() - 100), rgba(255, 255, 255, 255), rgba(0, 0, 0, 255), xy(1, 1));
            this.ModLoader.Gfx.addText(this.ModLoader.ImGui.getBackgroundDrawList(), this.font, `Version: ${VERSION_NUMBER}`, xy(2, this.ModLoader.ImGui.getWindowHeight() - 68), rgba(255, 255, 255, 255), rgba(0, 0, 0, 255), xy(1, 1));
            this.ModLoader.Gfx.addText(this.ModLoader.ImGui.getBackgroundDrawList(), this.font, `Build Date: ${BUILD_DATE}`, xy(2, this.ModLoader.ImGui.getWindowHeight() - 36), rgba(255, 255, 255, 255), rgba(0, 0, 0, 255), xy(1, 1));
        }
        // #endif
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Mods")) {
                if (this.ModLoader.ImGui.beginMenu("Z64O")) {
                    if (this.ModLoader.ImGui.button("DUMP RAM")) {
                        bus.emit(Z64OnlineEvents.DEBUG_DUMP_RAM, {});
                    }
                    this.ModLoader.ImGui.endMenu();
                }
                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
        this.ModLoader.ImGui.end();
    }
}