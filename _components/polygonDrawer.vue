<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.js'
import 'leaflet-draw/dist/leaflet.draw.css'
import { findRealParent, propsBinder } from 'vue2-leaflet'
export default {
  name: 'polygonDrawer',
  props: {
    visible: {
      type: Boolean,
      custom: true,
      default: true
    }
  },
  mounted(){
    this.$nextTick(() => {
      if (this.$parent._isMounted) {
        this.deferredMountedTo(this.$parent.mapObject)
      }
    })
  },
  methods: {
    deferredMountedTo (parent) {
      let editableLayers = new L.FeatureGroup();
      parent.addLayer(editableLayers);
      let drawPluginOptions = {
        position: 'topleft',
        collapsed: true,
        draw: {
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            shapeOptions: {
              color: '#97009c'
            },
            featureGroup: editableLayers
          },
          // disable toolbar item by setting it to false
          polyline: false,
          circle: false, // Turns off this drawing tool
          rectangle: false,
          marker: false,
        },
        edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: false,
        }
      };

      // Initialise the draw control and pass it the FeatureGroup of editable layers
      let drawControl = new L.Control.Draw(drawPluginOptions);
      parent.addControl(drawControl);
    },
  }
}
</script>
