import ol from 'openlayers';

export class AzureMapsTileGrid extends ol.tilegrid.TileGrid {

    public maxZoom = 22;

    constructor(){
        super({
            extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10],
            minZoom: 0,
            //@ts-ignore
           // maxZoom: 22,
            origin: [-20037508.342789244, 20037508.342789244],
            resolutions: [156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.748113140705, 152.8740565703525, 76.43702828517625, 38.21851414258813, 19.109257071294063, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395, 0.29858214173896974, 0.14929107086948487, 0.07464553543474244, 0.03732276771737122],
            tileSize: 256
        });
    }

    public setMaxZoom(maxZoom: number): void {
        this.maxZoom = maxZoom;
    }

    public getMaxZoom(): number {
        return this.maxZoom;
    }
}