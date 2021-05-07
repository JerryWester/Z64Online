export const PuppetProxyGen_Adult: any = {
    // Master Sword
    "0x590": "0x5138",
    "0x598": "0x5140",
    "0x5A0": "0x5130",
    // Biggoron Sword
    "0x5C0": "0x5148",
    "0x5C8": "0x5150",
    "0x5D0": Buffer.from('DF00000000000000', 'hex'),
    // Hylian Shield
    "0x5F0": "0x5160",
    // Mirror Shield
    "0x5F8": "0x5168",
    // Bow
    "0x600": "0x5180",
    // Hookshot
    "0x610": "0x5190",
    // Master Sword (sheathed)
    "0x620": [0x5238, 0x20, 0xC, 0x1C, 0x5138, 0x5130],
    // BGS (sheathed)
    "0x660": [0x5238, 0x20, 0xC, 0x1C, 0x5138, 0x5130],
    // Hylian Shield (back)
    "0x690": [0x5258, 0x10, 0xC, -1, 0x5160],
    // Mirror Shield (back)
    "0x6B0": [0x5268, 0x10, 0xC, -1, 0x5168]
};

export const PuppetProxyGen_Child: any = {
    // Kokiri Sword
    "0x5A8": "0x5180",
    "0x5B0": "0x5188",
    "0x5B8": "0x5178",
    // Deku Stick
    "0x5D8": "0x51A8",
    // Right Fist,
    "0x5E0": "0x5170",
    // Deku Shield
    "0x5E8": "0x50D0",
    // Slingshot
    "0x608": "0x5190",
    // Boomerang
    "0x618": "0x51B0",
    // Kokiri Sword (shealthed)
    "0x640": [0x5228, 0x20, 0xC, 0x1C, 0x5180, 0x5178],
    // Deku Shield (back)
    "0x680": [0x5268, 0x10, 0xC, -1, 0x50D0],
    // Hylian Shield (back)
    "0x6A0": "0x51B8"
};

export const EqManifestToOffsetMap_Link: any = {
    "sword0_hilt": "0x5180",
    "sword0_blade": "0x5188",
    "sword0_sheath": "0x5178"
};

export const EqManifestToOffsetMap_Puppet: any = {
};