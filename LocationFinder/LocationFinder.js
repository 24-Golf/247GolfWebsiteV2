document.addEventListener('DOMContentLoaded', async () => {
  await customElements.whenDefined('gmpx-store-locator');
  const locator = document.querySelector('gmpx-store-locator');
  locator.configureFromQuickBuilder(CONFIGURATION);
});const CONFIGURATION = {
        "locations": [
          {"title":"24/7 Golf - Ludington","address1":"5756 US-10","address2":"Ludington, MI 49431, USA","coords":{"lat":43.957528203572636,"lng":-86.42327952209014},"placeId":"ChIJ6Wm_J1oRHIgRGa5HyEVqipo","actions":[{"label":"Book appointment","defaultUrl":"http://24-7golf.com/booking"}]},
          {"title":"24/7 Golf - Grand Rapids","address1":"4255 Alpine Ave NW Ste A","address2":"Comstock Park, MI 49321, USA","coords":{"lat":43.041798348646026,"lng":-85.69027300674593},"placeId":"ChIJ-Qj6VGepGYgRHRaYm_eISdc","actions":[{"label":"Book appointment","defaultUrl":"http://24-7golf.com/booking"}]},
          {"title":"24/7 Golf - Williamsburg","address1":"6463 US-31","address2":"Williamsburg, MI 49690, USA","coords":{"lat":44.77974381100765,"lng":-85.4969684932541},"placeId":"ChIJi2EQLwDRH4gRs54otsYyZhQ","actions":[{"label":"Book appointment","defaultUrl":"http://24-7golf.com/booking"}]},
          {"title":"24/7 Golf - Dewitt","address1":"1161 E Clark Rd Ste 136","address2":"DeWitt, MI 48820, USA","coords":{"lat":42.81466649356487,"lng":-84.54158496441804},"placeId":"ChIJm2XuCM_tIogRvBZqL_HR0y4","actions":[{"label":"Book appointment","defaultUrl":"http://24-7golf.com/booking"}]},
          {"title":"24/7 Golf - Haslett","address1":"2121 Haslett Rd","address2":"Haslett, MI 48840, USA","coords":{"lat":42.74670035597035,"lng":-84.4270352490738},"placeId":"ChIJRWHEm1TnIogR8gS666bcjb8","actions":[{"label":"Book appointment","defaultUrl":"http://24-7golf.com/booking"}]},
          {"title":"24/7 Golf - Traverse City (COMING SOON)","address1":"972 W South Airport Rd","address2":"Traverse City, MI 49686, USA","coords":{"lat":44.73375354579127,"lng":-85.59453066441803},"placeId":"ChIJy7XQJy_NH4gRNPIsaWZcppU"},
          {"title":"24/7 Golf - Standale (COMING SOON)","address1":"4030 Lake Michigan Dr NW suite b","address2":"Grand Rapids, MI 49534, USA","coords":{"lat":42.971868303512856,"lng":-85.76721983558198},"placeId":"Ej00MDMwIExha2UgTWljaGlnYW4gRHIgTlcgc3VpdGUgYiwgR3JhbmQgUmFwaWRzLCBNSSA0OTUzNCwgVVNBIiMaIQoWChQKEgkjC25dfaUZiBEj-PvsHu_dZBIHc3VpdGUgYg"},
          {"title":"24/7 Golf - Kentwood (COMING SOON)","address1":"6070 Kalamazoo Ave SE","address2":"Grand Rapids, MI 49508, USA","coords":{"lat":42.853196463356284,"lng":-85.62399916441802},"placeId":"ChIJkbbgtpi0GYgRwOhdwIVC-pI"},
          {"title":"24/7 Golf - Rockford (COMING SOON)","address1":"515 E Division St NE","address2":"Rockford, MI 49341, USA","coords":{"lat":43.11932952057435,"lng":-85.54644584907379},"placeId":"ChIJgXcLMBr_GIgRlVdml3F5rcc"},
          {"title":"24/7 Golf - Grand Having (COMING SOON)","address1":"1830 172nd Ave ste a","address2":"Grand Haven, MI 49417, USA","coords":{"lat":43.04240748803507,"lng":-86.21402856441803},"placeId":"EjAxODMwIDE3Mm5kIEF2ZSBzdGUgYSwgR3JhbmQgSGF2ZW4sIE1JIDQ5NDE3LCBVU0EiIRofChYKFAoSCWNRVEoogRmIET80wZOg0ad3EgVzdGUgYQ"}
        ],
        "mapOptions": {"center":{"lat":38.0,"lng":-100.0},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":false,"zoom":4,"zoomControl":true,"maxZoom":17,"mapId":""},
        "mapsApiKey": "AIzaSyBlnmn-NqT_J77I1MQ_i7IuT9cDsrAQBps",
        "capabilities": {"input":true,"autocomplete":true,"directions":true,"distanceMatrix":true,"details":true,"actions":true}
      };