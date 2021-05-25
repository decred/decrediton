class MockElectronStore {
  get(key) {
    return this[key];
  }
  set(key, value) {
    return (this[key] = value);
  }
  delete(key) {
    delete this[key];
  }
  has(key) {
    return !!this[key];
  }
}

export default MockElectronStore;
