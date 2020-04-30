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
            <div class="col-12 col-md-6">
              <q-input outlined dense v-model="locale.formTemplate.name"
                       :label="`${$tr('ui.form.name')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
              <q-input outlined dense v-model="locale.formTemplate.code"
                       :label="`${$tr('qlocations.layout.form.code')} (${locale.language})*`"
                       :rules="[val => !!val || $tr('ui.message.fieldRequired')]"/>
            </div>
            <div class="col-12 col-md-6">
              <!--Crud countries-->
              <crud :crud-data="import('@imagina/qlocations/_crud/countries')"
                    type="select" :crud-props="{label:`${$tr('qlocations.layout.form.country')}*`}"
                    v-model="locale.formTemplate.countryId" :config="{options: {label: 'name', value: 'id'}}"
              />
              <!--Crud provinces-->
              <crud :crud-data="import('@imagina/qlocations/_crud/provinces')"
                    type="select" :crud-props="{label:`${$tr('qlocations.layout.form.province')}*`}"
                    v-model="locale.formTemplate.provinceId" :config="{options: {label: 'name', value: 'id'}}"
                    :custom-data="{read: {requestParams: {filter: {country: locale.formTemplate.countryId}}}}"
              />
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
            code: '',
            countryId: '48',
            provinceId: null,
          },
          fieldsTranslatable: {
            name: '',
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
            let configName = 'apiRoutes.qlocations.cities'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'province,country',
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
          let configName = 'apiRoutes.qlocations.cities'
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
          let configName = 'apiRoutes.qlocations.cities'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')}`})
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
