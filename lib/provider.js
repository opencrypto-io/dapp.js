
class Provider {
  constructor (engine) {
    this._engine = engine
    this._config = Object.assign(this.defaultConfig(), this._engine._config.provider)
    this._api = null
    this.create()
  }
  create () {}
  defaultConfig () {}
}

module.exports = Provider
