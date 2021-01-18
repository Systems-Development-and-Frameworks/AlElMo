
import jwt_decode from "jwt-decode";

export const state = () => ({
  jwtToken: false,
  userId: false,
  })
  
export const mutations = {
  setToken(state, token) {
    state.jwtToken = token;
    state.userId = jwt_decode(token).id;
  },
  setUserId(state, userId) {
    state.userId = userId;
  },
  deleteToken(state) {
    state.jwtToken = false;
    state.userId = false;
  }
}

export const getters = {
  isAuthenticated:(state)=> {
    return state.jwtToken !== false;
  }
}