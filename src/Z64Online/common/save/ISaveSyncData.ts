import { IKeyRing } from "@Z64Online/common/save/IKeyRing";
import { ProxySide } from "modloader64_api/SidedProxy/SidedProxy";
import { IZ64SyncSave } from "../types/Types";

export interface ISaveSyncData {
    hash: string;
    createKeyRing(): IKeyRing;
    processKeyRing(keys: IKeyRing, storage: IKeyRing, side: ProxySide): void;
    processKeyRing_OVERWRITE(keys: IKeyRing, storage: IKeyRing, side: ProxySide): void;
    createSave(): Buffer;
    forceOverrideSave(save: Buffer, storage: IZ64SyncSave, side: ProxySide): void;
    mergeSave(save: Buffer, storage: IZ64SyncSave, side: ProxySide): Promise<boolean>;
    applySave(save: Buffer): void;
}
