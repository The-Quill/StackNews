import moment from 'moment'

export class Time {
    constructor(){
        this._now = moment().valueOf()
    }
    get now(){
        return this._now
    }
    get unix(){
        return this.now
    }

    before(time) {
        return moment(this.now).isBefore(time)
    }
    after(time) {
        return moment(this.now).isAfter(time)
    }
    weekOlder(time) {
        return moment(+time).add(6, 'days').isBefore(moment(this.now))
    }
}
