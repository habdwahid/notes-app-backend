const ClientError = require('../../exceptions/ClientError');

class AuthenticationHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential({ username, password });
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const res = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
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

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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

module.exports = AuthenticationHandler;
