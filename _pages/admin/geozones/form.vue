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
                       :label="`${$tr('ui.form.name')}*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
              <div class="input-title">{{ `${$tr('ui.form.description')}*` }}</div>
              <q-field borderless v-model="locale.formTemplate.description" :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                <q-editor class="full-width" v-model="locale.formTemplate.description"/>
              </q-field>
            </div>
          </div>
          <div class="row q-col-gutter-md q-py-md">
            <div class="col-12 col-md-6 q-py-md">
              <div class="row q-col-gutter-md">
                <div class="col-8">
                  {{ $tr('qlocations.layout.form.countries') }}
                </div>
                <div class="col-4 text-right">
                  <q-btn color="positive" :loading="loading" @click="locale.formTemplate.countries.push(0)"
                       icon="fas fa-plus" />
                </div>
              </div>
              <div class="row q-col-gutter-md q-py-md">
                <div class="col-12" v-for="(country,i) in locale.formTemplate.countries">
                  <div class="row q-col-gutter-md">
                    <div class="col-10">
                      <!--Crud countries-->
                      <crud :crud-data="import('@imagina/qlocations/_crud/countries')"
                            type="select" :crud-props="{label:`${$tr('qlocations.layout.form.country')}*`}"
                            v-model="locale.formTemplate.countries[i]" :config="{options: {label: 'name', value: 'id'}}"
                      />
                    </div>
                    <div class="col-2 text-right">
                      <q-btn color="negative" :loading="loading" @click="locale.formTemplate.countries.splice(i,1)"
                             icon="fas fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 q-py-md">
              <div class="row q-col-gutter-md">
                <div class="col-8">
                  {{ $tr('qlocations.layout.form.provinces') }}
                </div>
                <div class="col-4 text-right">
                  <q-btn color="positive" :loading="loading" @click="locale.formTemplate.provinces.push(0)"
                         icon="fas fa-plus" />
                </div>
              </div>
              <div class="row q-col-gutter-md q-py-md">
                <div class="col-12" v-for="(province,i) in locale.formTemplate.provinces">
                  <div class="row q-col-gutter-md">
                    <div class="col-10">
                      <!--Crud countries-->
                      <crud :crud-data="import('@imagina/qlocations/_crud/provinces')"
                            type="select" :crud-props="{label:`${$tr('qlocations.layout.form.province')}*`}"
                            v-model="locale.formTemplate.provinces[i]" :config="{options: {label: 'name', value: 'id'}}"
                      />
                    </div>
                    <div class="col-2 text-right">
                      <q-btn color="negative" :loading="loading" @click="locale.formTemplate.provinces.splice(i,1)"
                             icon="fas fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 q-py-md">
              <div class="row q-col-gutter-md">
                <div class="col-8">
                  {{ $tr('qlocations.layout.form.cities') }}
                </div>
                <div class="col-4 text-right">
                  <q-btn color="positive" :loading="loading" @click="locale.formTemplate.cities.push(0)"
                       icon="fas fa-plus" />
                </div>
              </div>
              <div class="row q-col-gutter-md q-py-md">
                <div class="col-12" v-for="(city,i) in locale.formTemplate.cities">
                  <div class="row q-col-gutter-md">
                    <div class="col-10">
                      <!--Crud countries-->
                      <crud :crud-data="import('@imagina/qlocations/_crud/cities')"
                            type="select" :crud-props="{label:`${$tr('qlocations.layout.form.city')}*`}"
                            v-model="locale.formTemplate.cities[i]" :config="{options: {label: 'name', value: 'id'}}"
                      />
                    </div>
                    <div class="col-2 text-right">
                      <q-btn color="negative" :loading="loading" @click="locale.formTemplate.cities.splice(i,1)"
                             icon="fas fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 q-py-md">
              <div class="row q-col-gutter-md">
                <div class="col-8">
                  {{ $tr('qlocations.layout.form.neighborhoods') }}
                </div>
                <div class="col-4 text-right">
                  <q-btn color="positive" :loading="loading" @click="locale.formTemplate.neighborhoods.push(0)"
                         icon="fas fa-plus" />
                </div>
              </div>
              <div class="row q-col-gutter-md q-py-md">
                <div class="col-12" v-for="(neighborhood,i) in locale.formTemplate.neighborhoods">
                  <div class="row q-col-gutter-md">
                    <div class="col-10">
                      <!--Crud countries-->
                      <crud :crud-data="import('@imagina/qlocations/_crud/polygons')"
                            type="select" :crud-props="{label:`${$tr('qlocations.layout.form.neighborhood')}*`}"
                            v-model="locale.formTemplate.neighborhoods[i]" :config="{options: {label: 'name', value: 'id'}}"
                      />
                    </div>
                    <div class="col-2 text-right">
                      <q-btn color="negative" :loading="loading" @click="locale.formTemplate.neighborhoods.splice(i,1)"
                             icon="fas fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 q-py-md">
              <div class="row q-col-gutter-md">
                <div class="col-8">
                  {{ $tr('qlocations.layout.form.polygons') }}
                </div>
                <div class="col-4 text-right">
                  <q-btn color="positive" :loading="loading" @click="locale.formTemplate.polygons.push(0)"
                         icon="fas fa-plus" />
                </div>
              </div>
              <div class="row q-col-gutter-md q-py-md">
                <div class="col-12" v-for="(polygon,i) in locale.formTemplate.polygons">
                  <div class="row q-col-gutter-md">
                    <div class="col-10">
                      <!--Crud countries-->
                      <crud :crud-data="import('@imagina/qlocations/_crud/polygons')"
                            type="select" :crud-props="{label:`${$tr('qlocations.layout.form.polygon')}*`}"
                            v-model="locale.formTemplate.polygons[i]" :config="{options: {label: 'name', value: 'id'}}"
                      />
                    </div>
                    <div class="col-2 text-right">
                      <q-btn color="negative" :loading="loading" @click="locale.formTemplate.polygons.splice(i,1)"
                             icon="fas fa-trash" />
                    </div>
                  </div>
                </div>
              </div>
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

  export default {
    components: {
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
        loading: false,
        success: false,
        itemId: false,
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            name: '',
            description: '',
            countries: [],
            provinces: [],
            cities: [],
            polygons: [],
            neighborhoods: [],
          },
          fieldsTranslatable: {
          }
        }
      },
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getData()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qlocations.geozones'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'provinces,countries,cities,polygons',
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
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qlocations.geozones'
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
          let configName = 'apiRoutes.qlocations.geozones'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
            this.$router.push({name: 'qlocations.admin.geozones.index'})
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
        response.selectable = JSON.stringify(response.selectable)
        return response
      },
    }
  }
</script>

<style scoped>

</style>
