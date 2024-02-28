import fetch from './fetch'

export interface IUpdatePasswordForm {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export default {
  async updatePassword(passwordForm: IUpdatePasswordForm) {
    return fetch.post('/user/settings/updatePassword', passwordForm)
  }
}
