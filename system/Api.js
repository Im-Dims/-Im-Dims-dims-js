const axios = require("axios");

module.exports = class API {
  constructor() {
    this.URI = process.env.API_ENDPOINT;
    this.apiKey = process.env.API_KEY;
    this.create = axios.create({
      baseURL: this.URI,
      timeout: 60000
    });
  }

  async get(url = '', params = {}, apiKey = this.apiKey, options = {}) {
    try {
      const searchParams = new URLSearchParams({
        ...params,
        ...(apiKey ? { apikey: apiKey } : {})
      });
      const response = await this.create.get(url, {
        params: searchParams,
        ...options
      });
      return response.data;
    } catch (error) {
      return {
        status: 400,
        error: error.message
      };
    }
  }

  async post(url = '', data = {}, apiKey = this.apiKey, options = {}) {
    try {
      const response = await this.create.post(url, {
        ...data,
        ...(apiKey ? { apikey: apiKey } : {})
      }, {
        ...options
      });
      return response.data;
    } catch (error) {
      return {
        status: 400,
        error: error.message
      };
    }
  }
};