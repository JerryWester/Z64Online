import { IOOTCore } from 'Z64Lib/API/OoT/OOTAPI';
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { IZ64Clientside } from '@Z64Online/common/storage/Z64Storage';
import { PuppetAbstract } from '@Z64Online/common/puppet/PuppetAbstract';
import { PuppetData_OOT } from './PuppetData_OOT';

export class Puppet_OOT extends PuppetAbstract {

  constructor(
    player: INetworkPlayer,
    core: IOOTCore,
    ModLoader: IModLoaderAPI,
    parent: IZ64Clientside
  ) {
    super(player, core, ModLoader, parent);
    this.data = new PuppetData_OOT(this, 0, this.ModLoader);
  }
}
