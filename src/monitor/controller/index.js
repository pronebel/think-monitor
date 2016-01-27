'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
  async addAction(){

    console.log(this.http.query);
    console.log(this.http._post);

    let id = await this.model('report').collect(this.http._post);
    this.success(id)

  }
  async uaAction(){


    let id = await this.model('ua').collect(this.http._post);
    this.success(id)

  }
}