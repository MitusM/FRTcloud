// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===

import { PDO } from './dbServices.js'

class GeoModel extends PDO {
  constructor(options) {
    super(options)
  }

  async countryList() {
    const [rows] = await this.pool.query(
      ' SELECT country_id as id, title_ru as title FROM `_countries` ORDER BY `country_id` ASC ',
    )
    return rows
  }

  async regions(country_id) {
    const [rows] = await this.pool.query(
      'SELECT region_id as id, title_ru as title FROM `_regions` WHERE country_id="' +
        country_id +
        '" ORDER BY title_ru ASC ',
    )
    return rows
  }

  async cities(region_id) {
    const [rows] = await this.pool.query(
      ' SELECT `city_id` as id, `country_id`, `region_id`, `region_ru`, `title_ru` as title FROM `_cities` WHERE `region_id` ="' +
        region_id +
        '" ORDER BY title_ru ASC ',
    )
    return rows
  }
}

export { GeoModel }
