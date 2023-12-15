import SecureLS from 'secure-ls'

enum Keys {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  LOGGED_BEFORE = 'LOGGED_BEFORE',
}

class SecuredStorage {
  private readonly _securedStorage = new SecureLS({
    encodingType: 'rc4',
    isCompression: false,
  })

  setAccessToken(token: string) {
    this._securedStorage.set(Keys.ACCESS_TOKEN, token)
  }

  getAccessToken(): string | undefined {
    return this._securedStorage.get(Keys.ACCESS_TOKEN)
  }

  removeAccessToken() {
    this._securedStorage.remove(Keys.ACCESS_TOKEN)
  }

  setLoggedBefore(loggedBefore: boolean) {
    this._securedStorage.set(Keys.LOGGED_BEFORE, loggedBefore)
  }

  getLoggedBefore(): boolean {
    return Boolean(this._securedStorage.get(Keys.LOGGED_BEFORE))
  }

  removeLoggedBefore() {
    this._securedStorage.remove(Keys.LOGGED_BEFORE)
  }
}

const securedStorage = new SecuredStorage()

export default securedStorage
