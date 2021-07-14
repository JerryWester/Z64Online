import { IActor } from "modloader64_api/OOT/IActor"
import { Puppet } from "./Puppet";
import { IOOTCore } from "modloader64_api/OOT/OOTAPI";

export class HorseData{

    pointer: number;
    parent: Puppet;
    puppet!: IActor;
    private readonly copyFields: string[] = ["pos", "rot", "anim_id", "speed"];

    constructor(pointer: number, parent: Puppet, core: IOOTCore){
        this.puppet = core.actorManager.createIActorFromPointer(pointer);
        this.pointer = pointer;
        this.parent = parent;
    }

    get pos(): Buffer{
        return this.puppet.position.getRawPos();
    }

    set pos(buf: Buffer){
        this.puppet.rdramWriteBuffer(0x24, buf);
    }

    get rot(): Buffer{
        return this.puppet.rotation.getRawRot();
    }

    set rot(buf: Buffer){
        this.puppet.rdramWriteBuffer(0xB4, buf);
    }

    get anim_id(): number{
        return this.puppet.rdramRead32(0x1a4);
    }

    set anim_id(id: number){
        this.puppet.rdramWrite32(0x214, id);
    }

    get speed(): number{
        return this.puppet.rdramRead32(0x1b8);
    }

    set speed(s: number){
        this.puppet.rdramWrite32(0x1a4, s);
    }

    toJSON() {
        const jsonObj: any = {};
    
        for (let i = 0; i < this.copyFields.length; i++) {
          jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
        }
        //console.log(JSON.stringify(jsonObj, null, 2));
        return jsonObj;
      }

}