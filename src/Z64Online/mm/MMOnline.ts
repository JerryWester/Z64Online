import { IZ64GameMain } from "@Z64Online/common/types/Types";
import { ProxySide, SidedProxy } from "modloader64_api/SidedProxy/SidedProxy";
import path from 'path';
import { Preinit } from "modloader64_api/PluginLifecycle";
import { setupMM } from "@Z64Online/common/types/GameAliases";
import { MMOnlineStorageClient } from "./storage/MMOnlineStorageClient";
import { InjectCore } from "modloader64_api/CoreInjection";
import { IZ64Main } from "Z64Lib/API/Common/IZ64Main";
import { IZ64Utility } from "@Z64Online/common/api/InternalAPI";
import { IZ64ClientStorage } from "@Z64Online/common/storage/Z64Storage";
import { IPacketHeader } from "modloader64_api/NetworkHandler";
import { IS_DEV_BUILD } from "@Z64Online/common/lib/IS_DEV_BUILD";

export const SCENE_ARR_SIZE = 0xD20;
export const EVENT_ARR_SIZE = 0x8;
export const ITEM_FLAG_ARR_SIZE = 0x18;
export const MASK_FLAG_ARR_SIZE = 0x18;
export const WEEK_EVENT_ARR_SIZE = 0x64;

export const enum syncMode {
    "BASIC" = 0,    // Syncs all permanent data (Items, Masks, Quest Screen, Perm Flags, etc..)
    "TIME" = 1,     // Everyone is tied to the same exact clock. Syncs all save data, event data, and scene data.
    "RELATIVE" = 2  // Groundhog Day Sync: Player's movements are recorded in real-time relative to in-game time, like playing against a time trial ghost in a race.
}

export interface IMMOnlineLobbyConfig {
    data_syncing: boolean;
    actor_syncing: boolean;
    key_syncing: boolean;
}

export class MMOnlineConfigCategory {
    keySync: boolean = false;
    notifications: boolean = true;
    nameplates: boolean = true;
    muteNetworkedSounds: boolean = false;
    muteLocalSounds: boolean = false;
    notificationSound: boolean = true;
    syncBottleContents: boolean = false;
    diagnosticMode: boolean = false;
    syncMode: number = syncMode.BASIC;
}

export default class MMOnline implements IZ64GameMain, IZ64Utility {
    @InjectCore()
    core!: IZ64Main;
    @SidedProxy(ProxySide.CLIENT, path.resolve(__dirname, "MMOnlineClient.js"))
    client: any;
    @SidedProxy(ProxySide.SERVER, path.resolve(__dirname, "MMOnlineServer.js"))
    server: any;

    // Storage
    LobbyConfig: IMMOnlineLobbyConfig = {} as IMMOnlineLobbyConfig;
    clientStorage: MMOnlineStorageClient = new MMOnlineStorageClient();

    @Preinit()
    preinit(): void {
        setupMM();
    }

    sendPacketToPlayersInScene(packet: IPacketHeader): void {
        if (this.server !== undefined) {
            this.server.sendPacketToPlayersInScene(packet);
        }
    }

    getClientStorage(): IZ64ClientStorage {
        return this.client !== undefined ? this.client.clientStorage : null;
    }

    getServerURL(): string {
        return IS_DEV_BUILD ? "192.99.70.23:9035" : "192.99.70.23:8035";
    }
}