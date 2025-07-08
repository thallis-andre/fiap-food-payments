export class FakeMongooseModel<T = any> {
  exec(): Promise<T> {
    return Promise.reject(new Error('Not Implemented'));
  }
  findById() {
    return this;
  }
  findOne() {
    return this;
  }
}
