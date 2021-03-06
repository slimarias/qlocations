const moduleName = 'ilocations';
const moduleVersion = 'v2';
const urlBase = `/${moduleVersion}/${moduleName}`;

export default {
  countries: `${urlBase}/countries`,
  cities: `${urlBase}/cities`,
  provinces: `${urlBase}/provinces`,
  polygons: `${urlBase}/polygons`,
  geozones: `${urlBase}/geozones`,
  neighborhoods: `${urlBase}/neighborhoods`,
}
