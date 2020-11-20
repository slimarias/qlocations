<template>
  <div id="pageId" class="q-layout-page layout-padding">

    <div class="relative-position q-mb-lg backend-page">
      <div class="box" v-if="success">

        <div class="col-12">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
        </div>

        <!--Form-->
        <q-form autocorrect="off" autocomplete="off" ref="formContent" class="full-width q-my-sm" v-if="locale.success"
                @submit="itemId?updateItem():createItem()" @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input outlined dense v-model="locale.formTemplate.name"
                       :label="`${$tr('ui.form.name')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
              <div class="input-title">{{ `${$tr('ui.form.description')} (${locale.language})*` }}</div>
              <q-field borderless v-model="locale.formTemplate.description" :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                <q-editor class="full-width" v-model="locale.formTemplate.description"/>
              </q-field>
            </div>
            <div class="col-12">
              <l-map :draw-control="true" id="lMap" :zoom="mapZoom" :center="center"
                     :style="`height : 300px`" ref="map">
                <l-tile-layer name="OpenStreetMap" layer-type="base" :token="token"
                              attribution='&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              </l-map>
            </div>
          </div>
          <q-page-sticky
                  position="bottom-right"
                  :offset="[18, 18]">
            <!--Update button-->
            <q-btn v-if="$route.params.id" color="positive" :loading="loading"
                   icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
            <!--Save button-->
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit"/>
          </q-page-sticky>
        </q-form>
      </div>
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>

<script>
  import {latLng, Icon} from "leaflet";
  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
  import 'leaflet/dist/leaflet.css';
  export default {
    components: {
      LMap, LTileLayer, polygonDraw
    },
    watch: {
      $route(to, from) {
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
      })
    },
    data() {
      return {
        locale: {},
        map:{
          class: null,
          polygon: null,
          drawing: null
        },
        center: false,
        mapZoom: 15,
        loading: false,
        success: false,
        itemId: false,
      }
    },
    props:{
      id:{
        default: null
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            points: [],
          },
          fieldsTranslatable: {
            name: '',
            description: '',
          }
        }
      },
      token(){
        this.$store.getters['qsiteApp/getSettingValueByName']('isite::api-maps')
      }
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.id !==null?this.id:this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        this.center = ['4.642129714308486', '-74.11376953125001']//Default center
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qlocations.polygons'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              setTimeout(()=>{
                this.locale.form.countryId = response.data.countryId
                this.locale.form.provinceId = response.data.provinceId
              },500)
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
              reject(false)//Resolve
            })
          } else {
            resolve(true)//Resolve
          }
        })
      },
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        this.locale.form = this.$clone(orderData)
        let pointItems = []
        for (let x in this.locale.form.points){
          pointItems.push(this.locale.form.points[x])
        }
        this.locale.form.points = pointItems
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.polygons'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.polygons'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qlocations.admin.polygons.index'})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      getDataForm() {
        let response = this.locale.form
        for (var item in response) {
          let valueItem = response[item]
          if (valueItem == null || valueItem == undefined)
            delete response[item]
        }
        //response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
