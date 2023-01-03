const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;
      const userId = await this._service.addUser({ username, password, fullname });
      const res = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });

      res.code(201);
      return res;
    } catch (err) {
      if (err instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });

        res.code(err.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan server',
      });

      res.code(500);
      console.error();
      return res;
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });

        res.code(err.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan server',
      });

      res.code(500);
      console.error();
      return res;
    }
  }

  async getUsersByUsernameHandler(request, h) {
    try {
      const { username = '' } = request.query;
      const users = await this._service.getUsersByUsername(username);

      return {
        status: 'success',
        data: {
          users,
        },
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: err.message,
        });

        res.code(err.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan server',
      });

      res.code(500);
      console.error(err);
      return res;
    }
  }
}

module.exports = UsersHandler;
