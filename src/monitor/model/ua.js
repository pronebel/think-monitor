'use strict';
/**
 * model:card
 *
 * {
 *    name:"卡名称",
 *    number:"卡号",
 *    type:"卡类型",
 *    desc:"描述"
 *
 * }
 *
 *
 */

export default class extends think.model.mongo {
    init(...args){
        super.init(...args);

    }
    collect(card){

        console.log(card);


        return this.add(card)
    }
}