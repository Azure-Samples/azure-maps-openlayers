---
page_type: sample
description: A OpenLayers plugin that makes it easy to overlay tile layers from the Azure Maps tile services.
languages:
- javascript
- typescript
products:
- azure
- azure-maps
---

# Azure Maps OpenLayers plugin

A [OpenLayers](https://openlayers.org/) plugin that makes it easy to overlay tile layers from the [Azure Maps tile services](https://docs.microsoft.com/rest/api/maps/renderv2/getmaptilepreview).

**Features:**

- Authenticate using an Azure Maps subscription key or Azure Active Directory.
- Works with with Azure Public and Government clouds.
- [Supports over 30 languages](https://docs.microsoft.com/azure/azure-maps/supported-languages)
- Supported layers:
    - **Road maps**
        - Main (`microsoft.base.road`) - All layers with our main style.
        - Labels (`microsoft.base.labels.road`) - Label data in our main style.
        - Hybrid (`microsoft.base.hybrid.road`) - Road, boundary and label data in our main style.
        - Dark grayscale (`microsoft.base.darkgrey`) - All layers with our dark grayscale style.
    - **Imagery** (`microsoft.imagery`)
    - **Traffic Flow**
        - absolute (`microsoft.traffic.flow.absolute`)
        - reduced-sensitivity (`microsoft.traffic.flow.reduced-sensitivity`)
        - relative (`microsoft.traffic.flow.relative`)
        - relative-delay (microsoft.traffic.flow.relative-delay`)
    - **Traffic Incident**
        - night (`microsoft.traffic.incident.night`)
        - s1 (`microsoft.traffic.incident.s1`)
        - s2 (`microsoft.traffic.incident.s2`)
        - s3 (`microsoft.traffic.incident.s3`)
    - **Weather**
        - Infrared (`microsoft.weather.infrared.main`) - Latest Infrared Satellite images shows clouds by their temperature.
        - Radar (`microsoft.weather.radar.main`) - Latest weather radar images including areas of rain, snow, ice and mixed conditions.
- Use time stamps with weather layers to get recent and forecast data.
- Adjust the line thickness in traffic flow layers.

Currently supports raster (i.e PNG) tiles, support for vector tiles is planned.

**Samples**

[Render Azure Maps in OpenLayers](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Render%20Azure%20Maps%20in%20OpenLayers)
<br/>[<img src="https://samples.azuremaps.com/third-party-map-controls/render-azure-maps-in-openlayers/screenshot.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Render%20Azure%20Maps%20in%20OpenLayers)

[Azure Maps OpenLayers satellite labels](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Azure%20Maps%20OpenLayers%20satellite%20labels)
<br/>[<img src="https://samples.azuremaps.com/third-party-map-controls/azure-maps-openlayers-satellite-labels/screenshot.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Azure%20Maps%20OpenLayers%20satellite%20labels)

[Azure Maps OpenLayers options](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Azure%20Maps%20OpenLayers%20options)
<br/>[<img src="https://samples.azuremaps.com/third-party-map-controls/azure-maps-openlayers-options/screenshot.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Azure%20Maps%20OpenLayers%20options)

[Simple Azure Maps layer picker for OpenLayers](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Simple%20Azure%20Maps%20layer%20picker%20for%20OpenLayers)
<br/>[<img src="https://samples.azuremaps.com/third-party-map-controls/simple-azure-maps-layer-picker-for-openlayers/screenshot.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Simple%20Azure%20Maps%20layer%20picker%20for%20OpenLayers)

## Getting started

Download the project and copy the `azure-maps-openlayers` JavaScript file from the `dist` folder into your project.

**Usage**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>

    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    
    <!-- Add references to the OpenLayers JavaScript and CSS files. -->
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.5/css/ol.css" type="text/css" />

    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>

    <!-- Add reference to the Azure Maps OpenLayers plugin. -->
    <script src="../dist/azure-maps-openlayers.js"></script>  

    <script type='text/javascript'>
        var map;

        function GetMap() {
            
            //Add authentication details for connecting to Azure Maps.
            var authOptions = {
                //Use Azure Active Directory authentication.
                authType: "anonymous",
                clientId: "04ec075f-3827-4aed-9975-d56301a2d663", //Your Azure Active Directory client id for accessing your Azure Maps account.
                getToken: function (resolve, reject, map) {
                    //URL to your authentication service that retrieves an Azure Active Directory Token.
                    var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";

                    fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
                }

                //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
                //authType: 'subscriptionKey',
                //subscriptionKey: '<Your Azure Maps Key>'
            };

            //Create a map instance.
            map = new ol.Map({
                target: 'myMap',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.AzureMaps({
                            authOptions: authOptions,
                            tilesetId: 'microsoft.imagery'
                        })
                    })
                ],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 2
                })
            });
        }
    </script> 
</head>
<body onload="GetMap()">
    <div id="myMap" style="position:relative;width:100%;min-width:290px;height:600px;"></div>
</body>
</html>
```

If using Azure Government cloud, set the Azure Maps domain in the `authOptions` to `'atlas.azure.us'`.

```javascript
authOptions: {
    azMapsDomain: 'atlas.azure.us'    
    //Your other authentication options.
}
```

More details on authentication options for Azure Maps is [documented here](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication).

## API Reference

### AzureMaps class

**Extends:** `ol.source.XYZ`

**Namespace:** `ol.source`

A tile source that connects to the Azure Maps Render V2 services.

**Contstructor**

> `AzureMaps(options?: AzureMapsTileSourceOptions)`

**Methods**

| Name | Return type | Description |
|------|------|-------------|
| `getLanguage()` | `string` |Gets the language code used by the layer. |
| `getTilesetId()` | `string` | Gets the tileset ID of the layer. |
| `getTimeStamp()` | `string` | Gets the time stamp value setting. |
| `getTrafficFlowThickness()` | `number` | Gets the traffic flow thickness setting. |
| `getView()` | `string` | Gets the geopolitical view setting of the layer. |
| `setLanguage(language: string)` | | Sets the language code to append to the request. |
| `setTilesetId(tilesetId: string)` | | Sets the tileset ID of the layer. |
| `setTimeStamp(timeStamp: string \| Date)` | | Sets the time stamp option of the request. |
| `setTrafficFlowThickness(thickness: number)` | | Sets the traffic flow thickness setting. |
| `setView(view: string)` | | Sets the geopolitical view setting of the layer. |

### AuthenticationOptions interface

Authentication options for connecting to the Azure Maps tile services.

**Properties** 

| Name | Type | Description |
|------|------|-------------|
| `aadAppId` | `string` | The Azure AD registered app ID. This is the app ID of an app registered in your Azure AD tenant. Must be specified for AAD authentication type. |
| `aadInstance` | `string` | The AAD instance to use for logging in. Can be optionally specified when using the AAD authentication type. By default the `https://login.microsoftonline.com/` instance will be used. |
| `aadTenant` | `string` | The AAD tenant that owns the registered app specified by `aadAppId`. Must be specified for AAD authentication type. |
| `authContext` | `AuthenticationContext` | Optionally provide an existing `AuthenticationContext` from the ADAL.js library. This authentication context will be used to acquire the AAD token. Only used with the AAD authentication type. This auth context must be configured to use the same AAD app ID as `this.aadAppId`. If this is not provided all map instances will share their own private auth context. |
| `authType` | `'subscriptionKey'` \| `'aad'` \| `'anonymous'` | The authentication mechanism to be used. |
| `azMapsDomain` | `string` | A URL string pointing to the domain of the Azure Maps service, default is `'atlas.microsoft.com'`. Set to `'atlas.azure.us'` if using the US Azure Government cloud. |
| `clientId` | `string` | The Azure Maps client ID, This is an unique identifier used to identify the maps account. Preferred to always be specified, but must be specified for AAD and anonymous authentication types. |
| `getToken` | `(resolve: (value?: string) => void, reject: (reason?: any) => void) => void` | A callback to use with the anonymous authentication mechanism. This callback will be responsible for resolving to a authentication token. E.g. fetching a CORS protected token from an endpoint. |
| `subscriptionKey` | `string` | Subscription key from your Azure Maps account. Must be specified for subscription key authentication type. |

### AzureMapsTileSourceOptions interface

Options for an Azure Maps tile source.

**Properties** 

| Name | Type | Description |
|------|------|-------------|
| `authOptions` | `AuthenticationOptions` | **Required.** Authentication options for connecting to Azure Maps. |
| `language` | `string` | Language code. [Supported languages](https://docs.microsoft.com/azure/azure-maps/supported-languages) |
| `tilesetId` | `string` | The tile set ID layer to load from the Azure Maps Render V2 service. Supported values:<br/><br/>`'microsoft.base.road',`<br/> `'microsoft.base.darkgrey'`<br/> `'microsoft.imagery'`<br/> `'microsoft.weather.infrared.main'`<br/> `'microsoft.weather.radar.main'`<br/> `'microsoft.base.hybrid.road'`<br/> `'microsoft.base.labels.road'`<br/> `'microsoft.traffic.incident.night'`<br/> `'microsoft.traffic.incident.s1'`<br/> `'microsoft.traffic.incident.s2'`<br/> `'microsoft.traffic.incident.s3'`<br/> `'microsoft.traffic.flow.absolute'`<br/> `'microsoft.traffic.flow.reduced-sensitivity'`<br/> `'microsoft.traffic.flow.relative'`<br/> `'microsoft.traffic.flow.relative-delay'` |
| `timeStamp` | `string` \| `Date` | The desired date and time of the requested tile. This parameter must be specified in the standard date-time format (e.g. 2019-11-14T16:03:00-08:00), as defined by ISO 8601. This parameter is only supported when tilesetId parameter is set to `microsoft.weather.infrared.main` or `microsoft.weather.radar.main`. |
| `trafficFlowThickness` | `number` | The thickness of lines when using the traffic flow tilesets. Default: `5` |
| `view` | `string` | Geopolitical view of the map. [Supported views](https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages#sdks) |

### Alternative Option for OpenLayers

This OpenLayers plugin makes it easy to overlay tile layers from Azure Maps using any of the supported authentication methods available in Azure Maps; subscription key or Azure Active Directory (recommended). If you are only using a subscription key and don't plan to use Azure Active Directory, the following code can be used instead to easily overlay Azure Maps tile layers on a OpenLayers map without having to use this plugin.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>

    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.5/css/ol.css" type="text/css" />

    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.6.5/build/ol.js"></script>

    <script type='text/javascript'>
        //Add your Azure Maps key to the map SDK. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
        var subscriptionKey = '<Your Azure Maps Key>';

        /*
            Tileset ID specifies which data layers to render in the tiles. Can be:
                 
            'microsoft.base.road',  
            'microsoft.base.darkgrey',
            'microsoft.imagery', 
            'microsoft.weather.infrared.main', 
            'microsoft.weather.radar.main', 
            'microsoft.base.hybrid.road',
            'microsoft.base.labels.road'
        */
        var tilesetId = 'microsoft.base.road';

        //The language of labels. Supported languages: https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages
        var language = 'en-US';

        //The regional view of the map. Supported views: https://aka.ms/AzureMapsLocalizationViews
        var view = 'Auto';

        var map;

        function GetMap() {
            map = new ol.Map({
                target: 'myMap',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            url: `https://atlas.microsoft.com/map/tile?subscription-key=${subscriptionKey}&api-version=2.0&tilesetId=${tilesetId}&zoom={z}&x={x}&y={y}&tileSize=256&language=${language}&view=${view}`,
                            attributions: `© ${new Date().getFullYear()} TomTom, Microsoft`
                        })
                    })
                ],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 2
                })
            });
        }
    </script>
</head>
<body onload="GetMap()">
    <div id="myMap" style="position:relative;width:100%;min-width:290px;height:600px;"></div>
</body>
</html>
```

## Related Projects

* [Azure Maps Web SDK Open modules](https://github.com/microsoft/Maps/blob/master/AzureMaps.md#open-web-sdk-modules) - A collection of open source modules that extend the Azure Maps Web SDK.
* [Azure Maps Web SDK Samples](https://github.com/Azure-Samples/AzureMapsCodeSamples)
* [Azure Maps Gov Cloud Web SDK Samples](https://github.com/Azure-Samples/AzureMapsGovCloudCodeSamples)
* [Azure Maps & Azure Active Directory Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
* [List of open-source Azure Maps projects](https://github.com/microsoft/Maps/blob/master/AzureMaps.md)

## Additional Resources

* [Azure Maps (main site)](https://azure.com/maps)
* [Azure Maps Documentation](https://docs.microsoft.com/azure/azure-maps/index)
* [Azure Maps Blog](https://azure.microsoft.com/blog/topics/azure-maps/)
* [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-maps.html)
* [Azure Maps feedback](https://feedback.azure.com/forums/909172-azure-maps)

## Contributing

We welcome contributions. Feel free to submit code samples, file issues and pull requests on the repo and we'll address them as we can. 
Learn more about how you can help on our [Contribution Rules & Guidelines](https://github.com/Azure-Samples/azure-maps-openlayers/blob/main/CONTRIBUTING.md). 

You can reach out to us anytime with questions and suggestions using our communities below:
* [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-maps.html)
* [Azure Maps feedback](https://feedback.azure.com/forums/909172-azure-maps)

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). 
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or 
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

MIT
 
See [License](https://github.com/Azure-Samples/azure-maps-openlayers/blob/main/LICENSE.md) for full license text.