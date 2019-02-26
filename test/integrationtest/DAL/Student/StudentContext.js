const StudentSchema = require("./StudentSchema");

const mongoose = require("mongoose");

class StudentContext {
  constructor() {
    this._context = new mongoose.model("Student", StudentSchema);
  }

  /**
   * @param  {} entity
   */
  Insert(entity) {
    return new Promise((resolve, reject) => {
      let param = Object.keys(entity).reduce((acc, key) => {
        acc[key] = entity[key];
        return acc;
      }, {});

      let instance = new this._context(param);

      instance.save((err, entity) => {
        if (err) {
          reject(false);
        } else {
          resolve(entity);
        }
      });
    });
  }

  /**
   * @param  {} criteria={}
   * @param  {} execludedFields={}
   */
  Select(criteria = {}, execludedFields = {}) {
    return new Promise((resolve, reject) => {
      this._context.find(criteria, execludedFields, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(false);
        }
      });
    });
  }

  /**
   * @param  {} entity
   */
  Update(entity) {
    return new Promise((resolve, reject) => {
      this._context.updateOne(
        { _id: entity._id },
        entity,
        { upsert: true, runValidators: true },
        (err, res) => {
          if (!err) {
            resolve(res ? res.ok : false);
          } else {
            reject(err.message);
          }
        }
      );
    });
  }

  /**
   * @param  {} id
   */
  Remove(id) {
    return new Promise((resolve, reject) => {
      this._context.deleteOne({ _id: id }, (err, res) => {
        if (!err && res && res.ok) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  /**
   */
  RemoveAll() {
    return new Promise((resolve, reject) => {
      this._context.deleteMany({}, (err, res) => {
        if (!err && res && res.ok) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }
}

module.exports = StudentContext;
