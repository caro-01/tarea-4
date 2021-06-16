// Mapa Leaflet
var mapa = L.map('mapid').setView([9.93, -84.181], 13);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

// Otra capa base
    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	}
	).addTo(mapa);	

// Otra capa base
    var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
    }).addTo(mapa);


// Conjunto de capas base
var capas_base = {
  "ESRI": esri,
  "Stamen_Terrain": Stamen_Terrain,
  "OSM": capa_osm,
};	    


// Ícono personalizado para rótulos
const iconorotulos = L.divIcon({
  html: '<i class="fas fa-map-marked-alt"></i>',
  className: 'estiloIconos'
  
});

// Control de capas
control_capas = L.control.layers(capas_base, null, {collapsed: false}).addTo(mapa);	

// Control de escala
L.control.scale({position: "topright", imperial: false}).addTo(mapa);
   
// Capa vectorial de rotulos de Santa Ana en formato GeoJSON
$.getJSON("https://caro-01.github.io/tarea_2/capas/rotulos/rotulos.geojson", function(geodata) {
  var capa_rotulos = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 8, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Código</strong>: " + feature.properties.id_rotulo + "<br>" + "<strong>Descripción</strong>: " + feature.properties.descrip;
      layer.bindPopup(popupText);
    },
    
	pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng,{icon: iconorotulos});
    }
  });
  
  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_rotulos_calor = L.heatLayer(coordenadas, {radius: 30, blur: 1});

  // Capa de puntos agrupados
  //var capa_rotulos_agrupados = L.markerClusterGroup({showCoverageOnHover: true, zoomToBoundsOnClick: true, spiderfyOnMaxZoom: true});
  //capa_rotulos_agrupados.addLayer(capa_rotulos);

  // Se añaden las capas al mapa y al control de capas
  capa_rotulos_calor.addTo(mapa);
  control_capas.addOverlay(capa_rotulos_calor, 'Mapa de calor de la ubicación de rótulos');
  // capa rótulos agrupados
  //control_capas.addOverlay(capa_rotulos_agrupados, 'Rótulos agrupados');
  // capa rótulos individuales
  control_capas.addOverlay(capa_rotulos, 'Rótulos individuales');
  
});

// Capa vectorial de puntos de interés de Santa Ana en formato GeoJSON
$.getJSON("https://caro-01.github.io/tarea_2/capas/localidades/localidades.geojson", function(geodata) {
  var capa_loc = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#EDF71A", 'weight': 8, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Código</strong>: " + feature.properties.name + "<br>" + "<strong>Distrito</strong>: " + feature.properties.distrito;
      layer.bindPopup(popupText);
    },
	
	pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng);
    }
	});
	
	// Capa de puntos agrupados
  var capa_loc_agrupados = L.markerClusterGroup({ showCoverageOnHover: true, zoomToBoundsOnClick: true, spiderfyOnMaxZoom: true});
  capa_loc_agrupados.addLayer(capa_loc);
      
  // Se añade la capa al mapa y al control de capas
  capa_loc.addTo(mapa);
  control_capas.addOverlay(capa_loc_agrupados, 'Puntos de interés agrupados');
  control_capas.addOverlay(capa_loc, 'Puntos de interés individuales');
  
});

 
 // Capa vectorial de la red vial de Santa Ana en formato GeoJSON
$.getJSON("https://caro-01.github.io/tarea_2/capas/red_vial/red_vial.geojson", function(geodata) {
  var capa_vias = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#000000", 'weight': 1, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Código</strong>: " + feature.properties.id + "<br>" + "<strong>Nomenclatura</strong>: " + feature.properties.nomenclatu;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(capa_vias, 'Red vial');
});	

// Capa vectorial de predios de Santa Ana en formato GeoJSON
$.getJSON("https://caro-01.github.io/tarea_2/capas/predial/predial.geojson", function(geodata) {
  var capa_pr = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#F4D03F", 'weight': 2, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>GIS</strong>: " + feature.properties.ngis + "<br>" + "<strong>Área m2</strong>: " + feature.properties.area1;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(capa_pr, 'Predial');
});	

  // Capa vectorial de distritos de Santa Ana en formato GeoJSON
$.getJSON("https://caro-01.github.io/tarea_2/capas/distritos/distritos.geojson", function(geodata) {
  var capa_distritos = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#1E8449", 'weight': 3, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Codigo</strong>: " + feature.properties.nodistrito + "<br>" + "<strong>Distrito</strong>: " + feature.properties.distrito;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(capa_distritos, 'Distritos');
});	
 