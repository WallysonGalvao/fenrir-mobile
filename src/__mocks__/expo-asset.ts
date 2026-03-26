export class Asset {
  localUri = 'mocked-asset-uri'
  uri = 'mocked-asset-uri'
  static loadAsync = jest.fn(() => Promise.resolve([new Asset()]))
  static fromModule = jest.fn(() => new Asset())
}
