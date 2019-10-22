import {
  IModLoaderAPI,
  ModLoaderEvents,
  IPlugin,
} from 'modloader64_api/IModLoaderAPI';
import {
  EventHandler,
  EventsServer,
  EventServerLeft,
  EventsClient,
  EventServerJoined,
} from 'modloader64_api/EventHandler';
import { OotOnlineStorageClient } from '../../OotOnlineStorageClient';
import { zzstatic } from './zzstatic/src/zzstatic';
import zlib from 'zlib';
import {
  Ooto_AllocateModelPacket,
  Ooto_DownloadAllModelsPacket,
} from '../OotOPackets';
import { Age } from 'modloader64_api/OOT/OOTAPI';
import {
  ServerNetworkHandler,
  INetworkPlayer,
  NetworkHandler,
} from 'modloader64_api/NetworkHandler';
import { OotOnlineStorage } from '../../OotOnlineStorage';
import { IOotOnlineHelpers, OotOnlineEvents } from '../../OotoAPI/OotoAPI';
import { ModelPlayer } from './ModelPlayer';
import { ModelAllocationManager } from './ModelAllocationManager';
import { Puppet } from '../linkPuppet/Puppet';
import { Zobj } from './zzstatic/src/data/zobj';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export class ModelManager {
  ModLoader: IModLoaderAPI;
  clientStorage: OotOnlineStorageClient;
  parent: IOotOnlineHelpers;
  allocationManager: ModelAllocationManager;
  customModelFileAdult = '';
  customModelFileChild = '';

  constructor(
    ModLoader: IModLoaderAPI,
    clientStorage: OotOnlineStorageClient,
    parent: IOotOnlineHelpers
  ) {
    this.ModLoader = ModLoader;
    this.clientStorage = clientStorage;
    this.parent = parent;
    this.allocationManager = new ModelAllocationManager();
  }

  @EventHandler(OotOnlineEvents.CUSTOM_MODEL_APPLIED_ADULT)
  onCustomModel(file: string) {
    this.customModelFileAdult = file;
  }

  @EventHandler(OotOnlineEvents.CUSTOM_MODEL_APPLIED_CHILD)
  onCustomModel2(file: string) {
    this.customModelFileChild = file;
  }

  @EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
  onRomPatched(evt: any) {
    let temp: string = path.resolve(__dirname + '/temp.z64');
    let temp2: string = path.resolve(__dirname + '/ZOOTDEC.z64');
    let temp3: string = path.resolve(__dirname + '/complete.z64');
    let rom: Buffer = evt.rom as Buffer;
    if (this.customModelFileChild !== '' || this.customModelFileAdult !== '') {
      fs.writeFileSync(temp, rom);
      if (process.platform === 'win32') {
        spawnSync(path.resolve(__dirname + '/Decompress.exe'), [temp, temp2], {
          cwd: __dirname,
        });
      } else {
        spawnSync(path.resolve(__dirname + '/Decompress'), [temp, temp2], {
          cwd: __dirname,
        });
      }
      evt.rom = fs.readFileSync(temp2);
    }
    if (this.customModelFileAdult !== '') {
      console.log('Setting up adult model...');
      (() => {
        let rom: Buffer = evt.rom as Buffer;
        let dma = 0x7430;
        let link: number = 502 * 0x10;
        let start: number = rom.readUInt32BE(dma + link + 0x8);

        let a: any[] = JSON.parse(
          fs.readFileSync(__dirname + '/adult.json').toString()
        );
        for (let i = 0; i < a.length; i++) {
          rom.writeUInt8(a[i].value, a[i].addr);
        }

        fs.readFileSync(this.customModelFileAdult).copy(rom, start);

        evt.rom = rom;
      })();
    }
    if (this.customModelFileChild !== '') {
      console.log('Setting up child model...');
      (() => {
        let rom: Buffer = evt.rom as Buffer;
        let dma = 0x7430;
        let link: number = 503 * 0x10;
        let start: number = rom.readUInt32BE(dma + link + 0x8);

        let a: any[] = JSON.parse(
          fs.readFileSync(__dirname + '/child.json').toString()
        );
        for (let i = 0; i < a.length; i++) {
          rom.writeUInt8(a[i].value, a[i].addr);
        }

        fs.readFileSync(this.customModelFileChild).copy(rom, start);

        evt.rom = rom;
      })();
    }
    if (this.customModelFileChild !== '' || this.customModelFileAdult !== '') {
      if (fs.existsSync('./ARCHIVE.bin')) {
        fs.copyFileSync('./ARCHIVE.bin', __dirname + '/ARCHIVE.bin');
      }
      fs.writeFileSync(temp2, evt.rom);
      if (process.platform === 'win32') {
        spawnSync(path.resolve(__dirname + '/Compress.exe'), [temp2, temp3], {
          cwd: __dirname,
        });
      } else {
        spawnSync(path.resolve(__dirname + '/Compress'), [temp2, temp3], {
          cwd: __dirname,
        });
      }

      if (fs.existsSync(__dirname + '/ARCHIVE.bin')) {
        fs.copyFileSync(__dirname + '/ARCHIVE.bin', './ARCHIVE.bin');
      }
      evt.rom = fs.readFileSync(temp3);
    }
    let adult: Buffer = Buffer.alloc(1);
    let child: Buffer = Buffer.alloc(1);
    (() => {
      let rom: Buffer = evt.rom as Buffer;
      let dma = 0x7430;
      let link: number = 502 * 0x10;
      let start: number = rom.readUInt32BE(dma + link + 0x8);
      let end: number = rom.readUInt32BE(dma + link + 0xc);
      let size: number = end - start;
      let isRomCompressed = true;
      if (end === 0) {
        isRomCompressed = false;
        size =
          rom.readUInt32BE(dma + link + 0x4) - rom.readUInt32BE(dma + link);
        end = start + size;
      }
      let code = 0x00a87000;
      let offset = 0xe65a0;
      let skele: number = rom.readUInt32BE(code + offset);
      let buf: Buffer = Buffer.alloc(size);
      rom.copy(buf, 0, start, end);
      if (isRomCompressed) {
        this.ModLoader.logger.info('Decompressing yaz0 file...');
        buf = this.ModLoader.utils.yaz0Decode(buf);
      } else {
        console.log('Rom is decompressed.');
      }
      if (new Zobj(buf).isModLoaderZobj()) {
        buf.writeUInt32BE(skele, 0x500c);
        adult = buf;
        this.clientStorage.adultModel = adult;
      }
    })();
    (() => {
      let rom: Buffer = evt.rom as Buffer;
      let dma = 0x7430;
      let link: number = 503 * 0x10;
      let start: number = rom.readUInt32BE(dma + link + 0x8);
      let end: number = rom.readUInt32BE(dma + link + 0xc);
      let size: number = end - start;
      let isRomCompressed = true;
      if (end === 0) {
        isRomCompressed = false;
        size =
          rom.readUInt32BE(dma + link + 0x4) - rom.readUInt32BE(dma + link);
        end = start + size;
      }
      let code = 0x00a87000;
      let offset = 0xe65a4;
      let skele: number = rom.readUInt32BE(code + offset);
      let buf: Buffer = Buffer.alloc(size);
      rom.copy(buf, 0, start, end);
      if (isRomCompressed) {
        this.ModLoader.logger.info('Decompressing yaz0 file...');
        buf = this.ModLoader.utils.yaz0Decode(buf);
      } else {
        console.log('Rom is decompressed.');
      }
      if (new Zobj(buf).isModLoaderZobj()) {
        buf.writeUInt32BE(skele, 0x500c);
        child = buf;
        this.clientStorage.childModel = child;
      }
    })();
  }

  onPostInit() {
    this.ModLoader.emulator.rdramWriteBuffer(
      0x800000,
      this.allocationManager.models[0].model.adult
    );
    this.ModLoader.emulator.rdramWriteBuffer(
      0x837800,
      this.allocationManager.models[1].model.child
    );
    if (this.clientStorage.adultModel.byteLength > 1) {
      this.ModLoader.clientSide.sendPacket(
        new Ooto_AllocateModelPacket(
          zlib.deflateSync(this.clientStorage.adultModel),
          Age.ADULT,
          this.ModLoader.clientLobby
        )
      );
    }
    if (this.clientStorage.childModel.byteLength > 1) {
      this.ModLoader.clientSide.sendPacket(
        new Ooto_AllocateModelPacket(
          zlib.deflateSync(this.clientStorage.childModel),
          Age.CHILD,
          this.ModLoader.clientLobby
        )
      );
    }
  }

  @ServerNetworkHandler('Ooto_AllocateModelPacket')
  onModelAllocate_server(packet: Ooto_AllocateModelPacket) {
    let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
      packet.lobby,
      (this.parent as unknown) as IPlugin
    ) as OotOnlineStorage;
    if (!storage.playerModelCache.hasOwnProperty(packet.player.uuid)) {
      storage.playerModelCache[packet.player.uuid] = new ModelPlayer(
        packet.player.uuid
      );
    }
    if (packet.age === Age.CHILD) {
      storage.playerModelCache[
        packet.player.uuid
      ].model.child = zlib.inflateSync(packet.model);
      console.log(
        'server: Saving custom child model for player ' +
          packet.player.nickname +
          '.'
      );
    } else if (packet.age === Age.ADULT) {
      storage.playerModelCache[
        packet.player.uuid
      ].model.adult = zlib.inflateSync(packet.model);
      console.log(
        'server: Saving custom adult model for player ' +
          packet.player.nickname +
          '.'
      );
    }
  }

  @NetworkHandler('Ooto_AllocateModelPacket')
  onModelAllocate_client(packet: Ooto_AllocateModelPacket) {
    if (
      !this.clientStorage.playerModelCache.hasOwnProperty(packet.player.uuid)
    ) {
      this.clientStorage.playerModelCache[packet.player.uuid] = new ModelPlayer(
        packet.player.uuid
      );
    }
    if (packet.age === Age.CHILD) {
      this.clientStorage.playerModelCache[
        packet.player.uuid
      ].model.child = zlib.inflateSync(packet.model);
      console.log(
        'client: Saving custom child model for player ' +
          packet.player.nickname +
          '.'
      );
    } else if (packet.age === Age.ADULT) {
      this.clientStorage.playerModelCache[
        packet.player.uuid
      ].model.adult = zlib.inflateSync(packet.model);
      console.log(
        'client: Saving custom adult model for player ' +
          packet.player.nickname +
          '.'
      );
    }
  }

  @EventHandler(EventsServer.ON_LOBBY_LEAVE)
  onServerPlayerLeft(evt: EventServerLeft) {
    let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
      evt.lobby,
      (this.parent as unknown) as IPlugin
    ) as OotOnlineStorage;
    delete storage.playerModelCache[evt.player.uuid];
  }

  @EventHandler(EventsClient.ON_PLAYER_LEAVE)
  onPlayerLeft(player: INetworkPlayer) {
    delete this.clientStorage.playerModelCache[player.uuid];
    if (this.allocationManager.isPlayerAllocated(player)) {
      this.allocationManager.deallocateSlot(
        this.allocationManager.getModelIndex(
          this.allocationManager.getPlayerAllocation(player)
        )
      );
    }
  }

  @EventHandler(EventsServer.ON_LOBBY_JOIN)
  onPlayerJoin_server(evt: EventServerJoined) {
    let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
      evt.lobby,
      (this.parent as unknown) as IPlugin
    ) as OotOnlineStorage;
    this.ModLoader.serverSide.sendPacketToSpecificPlayer(
      new Ooto_DownloadAllModelsPacket(storage.playerModelCache, evt.lobby),
      evt.player
    );
  }

  @NetworkHandler('Ooto_DownloadAllModelsPacket')
  onModelDownload(packet: Ooto_DownloadAllModelsPacket) {
    Object.keys(packet.models).forEach((key: string) => {
      this.clientStorage.playerModelCache[key] = packet.models[key];
    });
    console.log(this.clientStorage.playerModelCache);
  }

  @EventHandler(OotOnlineEvents.PLAYER_PUPPET_PRESPAWN)
  onPuppetPreSpawn(puppet: Puppet) {
    if (
      !this.clientStorage.playerModelCache.hasOwnProperty(puppet.player.uuid)
    ) {
      this.ModLoader.emulator.rdramWrite16(0x60014e, puppet.age);
      return;
    }
    if (!this.allocationManager.isPlayerAllocated(puppet.player)) {
      this.allocationManager.allocateSlot(
        this.clientStorage.playerModelCache[puppet.player.uuid]
      );
    }
    let model: ModelPlayer = this.allocationManager.getPlayerAllocation(
      puppet.player
    );
    let index: number = this.allocationManager.getModelIndex(model);
    let allocation_size = 0x37800;
    let addr: number = 0x800000 + allocation_size * index;
    console.log(index + ' ' + addr.toString(16));
    if (puppet.age === Age.ADULT) {
      let buf: Buffer = Buffer.alloc(model.model.adult.byteLength);
      model.model.adult.copy(buf);
      this.ModLoader.emulator.rdramWriteBuffer(
        addr,
        new zzstatic().doRepoint(buf, index)
      );
    }
    if (puppet.age === Age.CHILD) {
      let buf: Buffer = Buffer.alloc(model.model.child.byteLength);
      model.model.child.copy(buf);
      this.ModLoader.emulator.rdramWriteBuffer(
        addr,
        new zzstatic().doRepoint(buf, index)
      );
    }
    this.ModLoader.emulator.rdramWrite16(0x60014e, index);
  }

  @EventHandler(OotOnlineEvents.PLAYER_PUPPET_DESPAWNED)
  onPuppetDespawn(puppet: Puppet) {}
}