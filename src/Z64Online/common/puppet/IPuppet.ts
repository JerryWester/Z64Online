import { Scene } from "Z64Lib/API/OOT/OOTAPI";
import { PuppetData } from "../../oot/puppet/PuppetData";
import { INetworkPlayer } from "modloader64_api/NetworkHandler";
import { AgeOrForm } from "Z64Lib/API/Common/Z64API";
import { IPuppetData } from "@Z64Online/common/puppet/IPuppetData";

export interface IPuppet {
    player: INetworkPlayer;
    id: string;
    data: PuppetData;
    isSpawned: boolean;
    isSpawning: boolean;
    isShoveled: boolean;
    scene: Scene;
    readonly age: AgeOrForm;
    spawn(): void;
    processIncomingPuppetData(data: IPuppetData): void;
    shovel(): void;
    despawn(): void;
}