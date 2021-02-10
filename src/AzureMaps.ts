import ol from 'openlayers';
import { AzureMapsTileSourceOptions } from './AzureMapsTileSourceOptions';
import { AuthenticationManager } from './internal/AuthenticationManager';
import { Constants } from './internal/Constants';
import { AzureMapsTileGrid } from './internal/AzureMapsTileGrid';

const _renderV2TileUrl = 'https://{azMapsDomain}/map/tile?api-version=2.0&tilesetId={tilesetId}&zoom={z}&x={x}&y={y}&tileSize={tileSize}&language={language}&view={view}';
const _trafficFlowTileUrl = 'https://{azMapsDomain}/traffic/flow/tile/png?api-version=1.0&style={style}&zoom={z}&x={x}&y={y}';
const _trafficIncidentTileUrl = 'https://{azMapsDomain}/traffic/incident/tile/png?api-version=1.0&style={style}&zoom={z}&x={x}&y={y}';
const _blankImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

/**
 * A tile layer source that connects to the Azure Maps Render V2 service.
 */
export class AzureMaps extends ol.source.XYZ {

    /************************
     * Private properties
     ***********************/

    private _authManager: AuthenticationManager;
    private _baseUrl: string = _renderV2TileUrl;

    private _options: AzureMapsTileSourceOptions = {
        language: 'en-US',
        view: 'Auto',
        tilesetId: 'microsoft.base.road',
        trafficFlowThickness: 5
    };

    /************************
     * Constructor
     ***********************/

    /**
     * A tile source that connects to the Azure Maps Render V2 service.
     * @param options Azure Maps Tile layer options.
     */
    constructor(options: AzureMapsTileSourceOptions) {
        super({
            projection: 'EPSG:3857',
            url: _blankImage,
            tileGrid: new AzureMapsTileGrid()
        });

        const self = this;

        //@ts-ignore
        super.setAttributions(() => { return self._getAttribution() });

        const opt = <AzureMapsTileSourceOptions>self._options;
        Object.assign(opt, options)
        const au = opt.authOptions || {};

        if (!au.azMapsDomain) {
            au.azMapsDomain = Constants.SHORT_DOMAIN;
        }

        const am = AuthenticationManager.getInstance(au);
        self._authManager = am;

        if (!am.isInitialized()) {
            am.initialize().then(() => {
                super.setTileLoadFunction((tile, url) => { self._tileLoadFunction(tile, url) });
                self.setTilesetId(opt.tilesetId);
            });
        } else {
            super.setTileLoadFunction((tile, url) => { self._tileLoadFunction(tile, url) });
            self.setTilesetId(opt.tilesetId);
        }
    }

    /************************
     * Public functions
     ***********************/

    /** Gets the geopolitical view setting of the layer. */
    public getView(): string {
        return (<AzureMapsTileSourceOptions>this._options).view;
    }

    /** Sets the geopolitical view setting of the layer. */
    public setView(view: string): void {
        (<AzureMapsTileSourceOptions>this._options).view = view;
    }

    /** Gets the language code used by the layer. */
    public getLanguage(): string {
        return (<AzureMapsTileSourceOptions>this._options).language;
    }

    /**
     * Sets the language code to append to the request.
     * @param language The language code to set.
     */
    public setLanguage(language: string): void {
        //@ts-ignore
        this._options.language = language;
        this._refresh();
    }

    /** Gets the tileset ID of the layer. */
    public getTilesetId(): string {
        return (<AzureMapsTileSourceOptions>this._options).tilesetId;
    }

    /**
     * Sets the tileset ID of the layer.
     * @param tilesetId The tileset to change to.
     */
    public setTilesetId(tilesetId: string): void {
        const self = this;
        (<AzureMapsTileSourceOptions>self._options).tilesetId = tilesetId;

        self._baseUrl = _renderV2TileUrl;

        var maxZoom = 22;

        if(tilesetId){
            if (tilesetId.startsWith('microsoft.weather.')) {
                maxZoom = 15;
            } else if (tilesetId === 'microsoft.imagery') {
                maxZoom = 19;
            }

            if (tilesetId.startsWith('microsoft.traffic.flow')) {
                self._baseUrl = _trafficFlowTileUrl;
            } else if (tilesetId.startsWith('microsoft.traffic.incident')) {
                self._baseUrl = _trafficIncidentTileUrl;
            }
        }

        (<AzureMapsTileGrid>self.getTileGrid()).setMaxZoom(maxZoom);

        self._refresh();
    }

    /**
     * Gets the time stamp value setting.
     */
    public getTimeStamp(): string | Date {
        return (<AzureMapsTileSourceOptions>this._options).timeStamp;
    }

    /**
     * Sets the time stamp option of the request.
     * @param timeStamp Time stamp value.
     */
    public setTimeStamp(timeStamp: string | Date): void {
        (<AzureMapsTileSourceOptions>this._options).timeStamp = timeStamp;
        this._refresh();
    }

    /**
     * Gets the traffic flow thickness setting.
     */
    public getTrafficFlowThickness(): number {
        return (<AzureMapsTileSourceOptions>this._options).trafficFlowThickness;
    }

    /**
     * sets the traffic flow thickness setting.
     */
    public setTrafficFlowThickness(thickness: number): void {
        (<AzureMapsTileSourceOptions>this._options).trafficFlowThickness = thickness;
        this._refresh();
    }

    /************************
     * Private functions
     ***********************/

    /**
     * Gets the attributions for the tile layer.
     */
    private _getAttribution(): string | string[] {
        const self = this;
        const ts = (<AzureMapsTileSourceOptions>self._options).tilesetId;
        var partner: string;
        const year = `© ${new Date().getFullYear()}`;

        if (ts) {
            if (ts.startsWith('microsoft.base.') || ts.startsWith('microsoft.traffic.')) {
                partner = 'TomTom';
            } else if (ts.startsWith('microsoft.weather.')) {
                partner = 'AccuWeather';
            } else if (ts === 'microsoft.imagery') {
                partner = 'DigitalGlobe';
            }

            if (partner) {
                return [`${year} ${partner}`, `${year} Microsoft`];
            }

            return `${year} Microsoft`;
        }

        return null;
    }

    /**
     * Loads a map tile.
     * @param tile Tile info.
     * @param url URL for tile.
     */
    private _tileLoadFunction(tile: ol.Tile, url: string): void {
        //Create a custom tile load function that will append Azure Active Directory headers to tile requests.
        this._authManager.getRequest(url).then(r => {
            r.blob().then(blobResponse => {
                const reader = new FileReader();
                reader.onload = () => {
                    //@ts-ignore
                    tile.getImage().src = <string>reader.result;
                };
                reader.readAsDataURL(blobResponse);
            });
        });
    }

    private _refresh(): void {
        super.setUrl(this._getFormattedUrl());
        super.refresh();
    }

    private _getFormattedUrl(): string {
        const self = this;
        const opt = <AzureMapsTileSourceOptions>self._options;

        var url = self._baseUrl
            .replace('{tileSize}', '256')
            .replace('{language}', opt.language)
            .replace('{view}', opt.view)
            .replace('{tilesetId}', opt.tilesetId);

        if (opt.tilesetId && opt.tilesetId.startsWith('microsoft.traffic')) {
            url = url.replace('{style}', self._getTrafficStyle());

            if (opt.tilesetId.indexOf('flow') > 0) {
                url += '&thickness=' + opt.trafficFlowThickness;
            }
        }

        if (opt.timeStamp) {
            var ts = <string>opt.timeStamp;

            if (opt.timeStamp instanceof Date) {
                //Create an ISO 8601 timestamp string.
                //JavaScripts format for ISO string includes decimal seconds and the letter "Z" at the end that is not supported. Use slice to remove this.
                ts = opt.timeStamp.toISOString().slice(0, 19);
            }

            url = url.replace('{timeStamp}', ts);
        }

        return url;
    }

    private _getTrafficStyle(): string {
        const ts = (<AzureMapsTileSourceOptions>this._options).tilesetId;

        if (ts && ts.indexOf('microsoft.traffic.') > -1) {
            return ts.replace('microsoft.traffic.incident.', '').replace('microsoft.traffic.flow.', '');
        }

        return null;
    }
}
