/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2021-06-06 09:53:20 
*/
import { IOOTCore } from "modloader64_api/OOT/OOTAPI";
import { INetworkPlayer } from "modloader64_api/NetworkHandler";
import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import Vector3 from "modloader64_api/math/Vector3";
import { IZ64OnlineHelpers } from "../data/InternalAPI";
import { IPuppetData } from "./IPuppetData";
import { IHorseData } from "./IHorseData";
import { AgeorForm } from "@OotOnline/common/types/Types";

export interface IPuppet {
    player: INetworkPlayer;
    id: string;
    data: IPuppetData;
    isSpawned: boolean;
    isSpawning: boolean;
    isShoveled: boolean;
    scene: number;
    core: IOOTCore;
    void: Vector3;
    ModLoader: IModLoaderAPI;
    horse: IHorseData | undefined;
    horseSpawning: boolean;
    parent: IZ64OnlineHelpers;
    renderFn: number;
    readonly age: AgeorForm;
    debug_movePuppetToPlayer(): void;
    doNotDespawnMe(p: number): void;
    spawn(): void;
    toggleVisibility(t: boolean): void;
    processIncomingPuppetData(data: IPuppetData): void;
    processIncomingHorseData(data: IHorseData): void;
    shovel(): void;
    despawn(): void;
    hasAttachedHorse(): boolean;
}